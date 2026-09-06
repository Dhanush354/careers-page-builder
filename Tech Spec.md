# Tech Spec — Career Builder

## 1. Problem statement

Recruiters need a branded careers page (hero, benefits, values, FAQ, open
roles, etc.) that stays in sync with their actual job listings, without
writing code or waiting on a design/dev cycle. Career Builder lets a
recruiter sign up, get a company workspace, assemble a page from
pre-built sections (or a free-form visual canvas), and publish it to a
public URL — with jobs syncing automatically from the job board they
manage in the same dashboard.

## 2. Assumptions

- **One company per recruiter account (MVP).** `profiles.company_id` is a
  single foreign key, not a join table — no multi-company/multi-seat
  support yet. Good enough for a single-tenant-per-recruiter MVP; would
  need a `company_members` join table to support teams.
- **Public read, authenticated write.** Anyone can view a *published*
  company's careers page and active jobs with no login. Only the
  recruiter linked to a company (via their profile) can edit it. There is
  no candidate account system — this product is recruiter-facing only,
  candidates only ever read.
- **Draft vs. published are genuinely separate states.** A recruiter can
  save broken/half-finished work indefinitely without it ever touching
  the public page. Publishing is an explicit, separate action that
  snapshots the draft.
- **Two builders can coexist.** The original "structured sections" editor
  (typed blocks, most flexible for injecting live data) and a newer
  GrapesJS visual canvas (free-form, closer to a real page builder) are
  both first-class and both write to the same `companies` row. In
  practice a recruiter picks one; the schema doesn't enforce that choice.
- **Sample job data (`data/jobs.csv`) is fixture data for local dev/demo
  only** — it's seeded via a script using the service-role key, never
  read by the running app.
- **No billing yet.** The landing page shows Free/Pro pricing tiers as
  marketing copy; there's no Stripe/payment integration in this codebase.
  Treat "Pro" as aspirational, not implemented.

## 3. Architecture

```
Browser
  │
  ▼
Next.js App Router (single deployable)
  ├─ Public marketing pages         app/page.tsx, app/login, app/signup
  ├─ Recruiter dashboard (auth'd)   app/dashboard, app/jobs
  ├─ Structured editor (auth'd)     app/[slug]/edit        (draft)
  │                                 app/[slug]/preview      (draft preview)
  ├─ Canvas editor (auth'd)         app/[slug]/builder      (GrapesJS, draft)
  ├─ Public careers page            app/[slug]/careers      (structured, published)
  └─ Public canvas page             app/[slug]/career       (GrapesJS export, published)
  │
  ├─ Server Actions ("use server")  lib/auth, lib/editor, lib/jobs
  │     └─ re-derive identity server-side on every call via
  │        getCurrentRecruiter(): Supabase session → profiles → companies
  │        (never trusts a client-supplied slug/company id)
  │
  ├─ proxy.ts (Next middleware)     refreshes Supabase auth cookie on
  │                                 every request; route-level auth checks
  │                                 still happen per-page (see §6, risks)
  │
  ▼
Supabase (Postgres + Auth)
  ├─ auth.users                     Supabase-managed
  ├─ public.profiles                1:1 with auth.users
  ├─ public.companies               draft + published snapshot columns
  └─ public.jobs                    company-scoped listings
  RLS enforced at the DB layer — see §4.

External services
  └─ Cloudinary (unsigned upload)   logo/banner images, client → Cloudinary
                                     directly, URL stored in companies.theme
```

Two Supabase clients are used depending on trust level:
- **Publishable-key client** (`lib/supabase/server.ts`, cookie-scoped) —
  used for anything that should be filtered by RLS: reading a recruiter's
  own company/profile, reading published companies/jobs publicly.
- **Service-role client** (created inline in `lib/jobs/actions.ts`,
  `lib/auth/actions.ts`, `scripts/seed-jobs.mjs`) — bypasses RLS entirely.
  Used only in server-only code paths (signup's initial company/profile
  insert, job CRUD, the seed script), and every one of those call sites
  manually scopes the query with `.eq("company_id", recruiter.company.id)`
  so it can't be used for cross-tenant access even though RLS isn't doing
  the filtering.

## 4. Data model

```sql
companies
  id                     uuid pk
  name                   text
  slug                   text unique            -- public URL segment
  theme                  jsonb                  -- draft brand/theme
  page_blocks            jsonb[]                -- draft structured-editor content
  published_theme        jsonb null             -- live snapshot (structured)
  published_page_blocks  jsonb[] null           -- live snapshot (structured)
  published_at           timestamptz null       -- non-null = page is live
  grapesjs_data          jsonb null             -- draft canvas project (GrapesJS format)
  published_html         text null              -- exported canvas HTML (live)
  published_css          text null              -- exported canvas CSS (live)
  created_at / updated_at

profiles
  id            uuid pk, fk -> auth.users(id) on delete cascade
  company_id    uuid fk -> companies(id) on delete set null
  full_name     text
  created_at / updated_at

jobs
  id                 uuid pk
  company_id         uuid fk -> companies(id) on delete cascade
  title              text
  work_policy        text        -- e.g. Remote/Hybrid/Onsite
  location           text
  department         text
  employment_type    text        -- Full time / Part time
  experience_level   text        -- Junior/Mid/Senior
  job_type           text        -- Permanent/Contract/Temporary
  salary_range       text
  job_slug           text        -- NOT unique by design (dataset has dup title+location)
  posted_days_ago    text
  is_active          boolean     -- gates public visibility
  created_at / updated_at
```

**Row Level Security** (migration `001_initial_schema.sql`) is the actual
authorization boundary, not app-layer checks alone:

| table | anon (public) | authenticated (recruiter) |
|---|---|---|
| `companies` | `select` only rows where `published_at is not null` | `select`/`update` only the row matching own `profiles.company_id` |
| `profiles` | no access | `select`/`update` own row only |
| `jobs` | `select` only `is_active = true` rows whose company is published | full CRUD scoped to own `company_id` |

Grants are paired 1:1 with policies (no blanket `grant all`), and
`service_role` gets full access as the trusted server/admin path.

Migrations `002` and `003` are additive (`add column if not exists`) and
introduce the draft/published split and the GrapesJS columns
respectively, without breaking existing rows (002 backfills published
snapshots for already-published companies).

## 5. Key flows

**Signup** → creates a Supabase auth user, then (via service-role client)
inserts `companies` + `profiles` in the same request; if the profile
insert fails the company insert is rolled back manually (no DB
transaction across the two, since one is `auth.users` and one is
`public`).

**Draft save (structured editor)** → `saveCareersPage()` re-derives the
recruiter's company server-side, validates `{ theme, page_blocks }` with
a Zod schema, updates only `theme`/`page_blocks` (never the published
columns), revalidates `/[slug]/edit|preview|careers`.

**Publish (structured editor)** → `publishCareersPage()` does **not**
accept client-submitted content at all — it re-reads the recruiter's
*already-saved* draft from the DB, re-validates it, and copies it into
`published_theme`/`published_page_blocks` + stamps `published_at`. This
means the public page can never show something that wasn't already a
validated, saved draft.

**Unpublish** → clears `published_at` only; draft and published snapshot
data are both left intact so re-publishing loses nothing.

**Canvas save/publish** (`lib/editor/grapesjs-actions.ts`) → same
identity/authorization pattern; publish wraps GrapesJS's body-only HTML
export into a full standalone document (`<html><head><style>...`) and
stores `published_html`/`published_css`.

**Public canvas serve** (`app/[slug]/career/route.ts`) → a route handler,
not a page — serves `published_html` as a raw response, but first:
1. injects real job cards into any `[data-inject="open-roles"]` block
   (fetched live via `getActiveJobsForCompany`, not baked in at publish
   time — so new/closed jobs show up on the canvas page without
   re-publishing),
2. injects a hand-authored mobile-responsive `<style>` block, since
   GrapesJS's export has zero `@media` queries by default — applied at
   *serve* time so it retroactively fixes pages published before this
   was added.

## 6. Known risks / things I'd flag in review

- **No middleware-level route protection yet.** `proxy.ts` only refreshes
  the auth cookie; each protected page (`/dashboard`, `/jobs`, `/[slug]/edit`,
  `/[slug]/builder`) does its own `getCurrentRecruiter()` check and
  redirects. Functionally correct today, but a new protected route added
  without that check would silently be unguarded — a middleware matcher
  covering the protected prefixes would be safer.
- **Two publish paths writing the same `published_at`.** A company can be
  "published" by either the structured editor or the canvas editor, and
  `/[slug]/careers` vs `/[slug]/career` are different render paths
  reading different columns. Whichever was published most recently wins
  for that specific URL, but there's nothing stopping both existing in
  an inconsistent state (e.g. structured page published, then canvas
  page never touched — `/[slug]/career` would 404/redirect since
  `published_html` is null). Worth deciding whether a company should be
  locked into one builder once it starts using either.
- **Cloudinary upload preset is unsigned by design** (client uploads
  directly with `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`). Acceptable for an
  MVP logo/banner uploader, but it means anyone with the cloud name +
  preset (both public, `NEXT_PUBLIC_*`) can upload to that bucket. Worth
  moving to signed uploads before this handles anything more sensitive
  than marketing images.
- **No automated tests currently committed** — see test plan below for
  what I'd add first.

## 7. Test plan

### Manual verification performed
- Signup with a fresh email → company/profile created → redirected to
  dashboard with correct empty state.
- Signup with an already-used company slug → rejected with "URL already
  taken", no orphaned auth user/company left behind.
- Save draft with invalid data (e.g. schema violation) → rejected client
  visibly, DB untouched.
- Publish with a clean draft → `/[slug]/careers` reflects it immediately
  (revalidated), unpublished company still 404s/soft-fails publicly.
- Unpublish → public route stops serving, draft still editable and intact.
- Job CRUD (`/jobs`) → create/edit/delete/toggle active, confirmed
  `is_active=false` jobs disappear from the public careers page and from
  canvas-injected job cards.
- Cross-tenant check: logged in as recruiter A, attempted to hit
  `saveCareersPage`/job actions scoped to company B's id — blocked by the
  `.eq("company_id", recruiter.company.id)` guard (and would additionally
  be blocked by RLS if not for the service-role bypass in job actions).
- Canvas publish → confirmed exported HTML has no media queries pre-fix,
  and that the serve-time mobile CSS injection actually collapses grids
  on a narrow viewport post-fix.

### Automated tests I'd add next (priority order)
1. **RLS policy tests** (pgTAP or Supabase's test harness) — the highest
   ROI given RLS is the actual security boundary: anon can't read
   unpublished companies/inactive jobs; recruiter A cannot select/update/
   delete company B's rows or jobs even via direct table access.
2. **Server action unit tests** for `saveCareersPage`/`publishCareersPage`/
   `unpublishCareersPage` — mock `getCurrentRecruiter()` states
   (`unauthenticated`, `no-company`, `ready`) and assert each returns the
   right `EditorActionResult` without touching the DB when unauthorized.
3. **Schema validation tests** for `saveCareersPageSchema` — malformed
   `page_blocks` (wrong `type` discriminant, missing required content
   fields) rejected; valid payloads round-trip.
4. **`getPublicationStatus()` unit tests** — published/unpublished/
   unpublished-changes classification against the various null/mismatch
   permutations of draft vs. published theme/blocks.
5. **E2E (Playwright)**: signup → edit → publish → view public page →
   unpublish → confirm 404/soft-fail, run against a disposable Supabase
   project or local Supabase stack.
6. **Route handler test** for `app/[slug]/career/route.ts`'s job
   injection and mobile-CSS injection functions in isolation (pure string
   functions, easy to unit test without a DB).
