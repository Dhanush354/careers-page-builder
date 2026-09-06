-- Careers Page Builder — initial schema
-- Tables: companies, profiles, jobs
-- Includes: indexes, updated_at triggers, RLS enablement + policies.
--
-- Run this in the Supabase SQL Editor (or via `supabase db push` if the CLI
-- is linked to the project). Safe to run once against a fresh project.

create extension if not exists "pgcrypto";

-- ============================================================
-- updated_at trigger function (shared by all business tables)
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- companies
-- ============================================================

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  theme jsonb not null default '{}'::jsonb,
  page_blocks jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index companies_slug_idx on public.companies (slug);

create trigger set_companies_updated_at
  before update on public.companies
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- profiles
-- One authenticated recruiter belongs to at most one company (MVP).
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_id uuid references public.companies (id) on delete set null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- jobs
-- job_slug is intentionally NOT unique — the provided dataset can contain
-- repeated title/location combinations. jobs.id is the real identifier.
-- ============================================================

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  work_policy text,
  location text,
  department text,
  employment_type text,
  experience_level text,
  job_type text,
  salary_range text,
  job_slug text,
  posted_days_ago text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index jobs_company_id_idx on public.jobs (company_id);
create index jobs_company_id_is_active_idx on public.jobs (company_id, is_active);

create trigger set_jobs_updated_at
  before update on public.jobs
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;

-- ---------- profiles ----------
-- A user may only ever read/update their own profile row. There is no
-- policy for insert/delete: profile rows are created by a trusted
-- server-side flow when Supabase Auth is wired up (a later step).

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------- companies ----------
-- Recruiters can read/update only the company linked to their profile.
-- Anyone (including anonymous candidates) can read a company once published.
-- There is no public/candidate write policy of any kind.

create policy "companies_select_own_company"
  on public.companies for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id = companies.id
    )
  );

create policy "companies_update_own_company"
  on public.companies for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id = companies.id
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id = companies.id
    )
  );

create policy "companies_select_published"
  on public.companies for select
  to public
  using (published_at is not null);

-- ---------- jobs ----------
-- Recruiters have full CRUD, scoped to their own company's jobs.
-- Anyone can read active jobs that belong to a published company.
-- There is no public/candidate write policy of any kind.

create policy "jobs_select_own_company"
  on public.jobs for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id = jobs.company_id
    )
  );

create policy "jobs_insert_own_company"
  on public.jobs for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id = jobs.company_id
    )
  );

create policy "jobs_update_own_company"
  on public.jobs for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id = jobs.company_id
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id = jobs.company_id
    )
  );

create policy "jobs_delete_own_company"
  on public.jobs for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id = jobs.company_id
    )
  );

create policy "jobs_select_active_published"
  on public.jobs for select
  to public
  using (
    is_active = true
    and exists (
      select 1 from public.companies
      where companies.id = jobs.company_id
        and companies.published_at is not null
    )
  );

-- ============================================================
-- Role privileges
--
-- RLS only filters rows an already-permitted statement may touch — it does
-- not grant the statement itself. With "Automatically expose new tables"
-- disabled at project creation, PostgREST's `anon`/`authenticated` roles
-- have no privileges on these tables until granted explicitly. Every grant
-- below is paired with (and no broader than) an existing RLS policy above.
-- ============================================================

grant usage on schema public to anon, authenticated;

-- anon: read-only, and only what the public-read policies above expose.
-- (no grants at all on profiles — candidates never touch recruiter profiles)
grant select on public.companies to anon;
grant select on public.jobs to anon;

-- authenticated: own profile (read-only), own company (read/update),
-- own company's jobs (full CRUD). RLS still scopes every row to the
-- caller's company_id, so this is not cross-tenant access.
grant select on public.profiles to authenticated;
grant select, update on public.companies to authenticated;
grant select, insert, update, delete on public.jobs to authenticated;

-- service_role: trusted server-side/admin access only (used by scripts such
-- as scripts/seed-jobs.mjs, never by browser or request-scoped code). This
-- role already bypasses RLS by platform default; with table auto-exposure
-- disabled it still needs the base grants to reach the tables at all.
grant usage on schema public to service_role;
grant all on public.companies, public.profiles, public.jobs to service_role;

