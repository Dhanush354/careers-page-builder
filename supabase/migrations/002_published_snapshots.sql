-- Draft / published snapshot split for companies.
--
-- theme / page_blocks            = draft, edited via /[slug]/edit, shown by
--                                   the recruiter preview (/[slug]/preview*)
-- published_theme / page_blocks  = the live snapshot the public
--                                   /[slug]/careers page actually renders
-- published_at                   = whether a published snapshot exists /
--                                   should be served publicly
--
-- Safe to run more than once: ADD COLUMN IF NOT EXISTS, and the backfill
-- only fills rows that don't already have a published snapshot.

alter table public.companies
  add column if not exists published_theme jsonb,
  add column if not exists published_page_blocks jsonb;

-- Backfill: companies already published (e.g. Acme) keep serving exactly
-- what they serve today — copy the current draft into the published
-- snapshot for any published company that doesn't have one yet.
update public.companies
set
  published_theme = theme,
  published_page_blocks = page_blocks
where
  published_at is not null
  and published_theme is null
  and published_page_blocks is null;
