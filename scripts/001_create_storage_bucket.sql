-- Create storage bucket for menu assets
insert into storage.buckets (id, name, public)
values ('menu-assets', 'menu-assets', true)
on conflict (id) do nothing;

-- Drop existing policies if they exist
drop policy if exists "Authenticated users can upload menu assets" on storage.objects;
drop policy if exists "Authenticated users can update menu assets" on storage.objects;
drop policy if exists "Authenticated users can delete menu assets" on storage.objects;
drop policy if exists "Public can read menu assets" on storage.objects;
drop policy if exists "Service role can manage menu assets" on storage.objects;

-- Allow service role to manage all files (for server-side operations)
create policy "Service role can manage menu assets"
on storage.objects for all
to service_role
using (bucket_id = 'menu-assets')
with check (bucket_id = 'menu-assets');

-- Allow authenticated users to upload files
create policy "Authenticated users can upload menu assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'menu-assets');

-- Allow authenticated users to update files
create policy "Authenticated users can update menu assets"
on storage.objects for update
to authenticated
using (bucket_id = 'menu-assets')
with check (bucket_id = 'menu-assets');

-- Allow authenticated users to delete files
create policy "Authenticated users can delete menu assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'menu-assets');

-- Allow public read access to menu assets
create policy "Public can read menu assets"
on storage.objects for select
to public
using (bucket_id = 'menu-assets');
