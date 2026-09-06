-- Storage foundation for company career-page assets (logos, banners,
-- gallery images). Run this after 001_initial_schema.sql.
--
-- Expected object path convention (enforced by the policies below, not by
-- the database): career-assets/<company_id>/logo|banner|gallery/<file>

insert into storage.buckets (id, name, public)
values ('career-assets', 'career-assets', true)
on conflict (id) do nothing;

-- Public read of every object in the bucket — career pages are public.
create policy "career_assets_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'career-assets');

-- Authenticated recruiters may upload/update/delete only inside the folder
-- matching their own company_id. storage.foldername(name) splits the object
-- path on "/" into a text[]; the first segment is expected to be the
-- company id.
create policy "career_assets_insert_own_company"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'career-assets'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id::text = (storage.foldername(name))[1]
    )
  );

create policy "career_assets_update_own_company"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'career-assets'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id::text = (storage.foldername(name))[1]
    )
  )
  with check (
    bucket_id = 'career-assets'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id::text = (storage.foldername(name))[1]
    )
  );

create policy "career_assets_delete_own_company"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'career-assets'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.company_id::text = (storage.foldername(name))[1]
    )
  );
