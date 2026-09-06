# AGENT_LOG

Notes on how I used AI tooling (Claude Code) while building Career
Builder — what I asked for, what got refined and why, and what I actually
learned from the process. Written from memory of the sessions plus the
evidence left behind in commit history and in-code comments, so entries
are grouped by the commit/feature they produced rather than a literal
transcript.

## Tools used
- **Claude Code** (Sonnet models) as the primary pair-programmer across
  the whole build — scaffolding new features, writing migrations,
  reviewing security-sensitive code (RLS, server actions), and this
  session, producing this doc set (`Tech Spec.md`, `README.md`, this
  file) from a codebase analysis pass.

## `78efc52` — canvas editor, Cloudinary upload, live job injection, landing page

- **Prompt intent:** add a second, more visual way to build the careers
  page (GrapesJS-based), wire up image uploads for branding, make the
  public canvas page show real job listings instead of static content,
  and give the marketing landing page a real design pass.
- **Refinement:** the first version of the canvas publish just stored
  whatever `editor.getHtml()`/`getCss()` returned. I had to push back and
  ask for it to be wrapped into a *complete* HTML document (doctype,
  head, meta viewport) since `getHtml()` only returns body content and
  the route handler serves it raw — without that wrapping the published
  page had no charset/viewport meta and broke on mobile browsers.
- **Refinement:** initial job injection replaced the open-roles block's
  content by string-matching on class names, which broke as soon as the
  GrapesJS block was re-styled. Asked for it to key off a stable
  `data-inject="open-roles"` attribute instead, so styling changes in the
  canvas never break the injection.
- **Learning:** GrapesJS's exported HTML has zero `@media` queries — I
  didn't know that going in. Rather than trying to make every block
  responsive at author time (which would mean rewriting the block
  library), the fix that stuck was a serve-time CSS injection in the
  route handler itself, so it applies retroactively to every already-
  published page too, not just future ones. That's the kind of "fix it
  where it's served, not where it's authored" call I wouldn't have
  reached for on the first pass — came out of asking Claude to explain
  *why* the mobile layout was broken before jumping to a fix.

## `c2e97c9` — canvas/careers route rename, editor theming, mobile responsiveness

- **Prompt intent:** rename routes so the structured editor's public page
  is `/[slug]/careers` and the canvas builder's is `/[slug]/builder` +
  `/[slug]/career`, apply consistent theming across both editors, and
  extend the mobile-responsive fix started in the previous commit.
- **Refinement:** asked for the revalidation calls (`revalidatePath`) in
  both `lib/editor/actions.ts` and `lib/editor/grapesjs-actions.ts` to be
  double-checked against the *actual* renamed routes — the first draft
  still revalidated a stale path from before the rename, which would have
  silently left a stale cache on publish. Good reminder to re-grep for a
  literal route string after any rename rather than trusting a find/
  replace caught every reference.
- **Learning:** having two independent publish flows (structured +
  canvas) writing to the same `companies.published_at` column is
  convenient for a shared "is this company live" check, but I flagged it
  as a real design question rather than a bug — captured it in the Tech
  Spec's risks section instead of silently "fixing" it, since which
  builder should win isn't something I could safely decide from an
  editing session alone.

## `f3ce09a` — rename to Career Builder

- **Prompt intent:** straightforward rebrand from the working name
  ("White Carrot"/"Whitecarrot") to "Career Builder" across user-facing
  copy (`app/layout.tsx` metadata, landing page copy).
- **Refinement:** asked explicitly to leave internal/dev-only references
  alone (repo folder name, the `Whitecarrot demo tenant` comment in
  `scripts/seed-jobs.mjs`, sample data) since those aren't user-facing and
  renaming them would just be churn with no benefit — a rebrand doesn't
  need to touch a local seed script's comments.

## This session — project analysis + Tech Spec / README / Agent Log

- **Prompt:** "analyse this complete project," followed by a request to
  produce the three deliverable docs.
- **Process:** rather than guessing at architecture, I had Claude read
  the actual migrations, server actions, `getCurrentRecruiter()`'s
  authorization chain, the RLS policies, and the two publish flows
  directly, and cross-check claims against the code before writing
  anything down (e.g. confirming the "no middleware route protection yet"
  claim by reading `proxy.ts` rather than assuming).
- **Learning / what I'd do differently:** the in-code comments left
  throughout this project (the Supabase type-inference gotchas in
  `types/database.ts`/`types/company.ts`, the "why service-role bypasses
  RLS but is still safe" note in `lib/jobs/actions.ts`) turned out to be
  the single most useful thing for reconstructing *intent* months later
  — worth keeping that habit up for every non-obvious decision, since it
  made this analysis pass much faster and more accurate than re-deriving
  the reasoning from the diff alone would have been.

## General takeaways from using AI tooling on this project
- Asking "why is this broken" before "fix this" repeatedly surfaced the
  cheaper, more durable fix (serve-time CSS injection vs. rewriting every
  block; stable `data-*` attribute vs. class-name matching).
- Security-sensitive code (RLS policies, the service-role bypass points,
  the recruiter authorization chain) is exactly where I slowed down and
  had Claude walk through the actual policy/grant pairing rather than
  accepting a plausible-looking migration — worth the extra pass every
  time RLS is touched.
- Letting the AI read real code before writing documentation (this
  session) produced a much more accurate Tech Spec than writing from
  memory would have — the "risks" section in particular came directly
  from re-reading `proxy.ts` and the two route handlers side by side.
