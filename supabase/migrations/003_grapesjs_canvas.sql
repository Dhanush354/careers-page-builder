-- GrapeJS canvas builder columns for companies.
--
-- grapesjs_data      = GrapeJS project JSON (draft, edited via /[slug]/builder)
-- published_html     = rendered HTML exported from GrapeJS on publish
-- published_css      = rendered CSS exported from GrapeJS on publish
--
-- published_at is already present from migration 002 and is reused by the
-- canvas builder — setting it to non-null marks the page as live regardless
-- of which editor (structured or canvas) last published.
--
-- Safe to run more than once: ADD COLUMN IF NOT EXISTS.

alter table public.companies
  add column if not exists grapesjs_data  jsonb default null,
  add column if not exists published_html text  default null,
  add column if not exists published_css  text  default null;
