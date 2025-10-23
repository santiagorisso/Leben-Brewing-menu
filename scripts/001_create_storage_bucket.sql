-- Create storage bucket for menu assets
insert into storage.buckets (id, name, public)
values ('menu-assets', 'menu-assets', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload files
create policy "Authenticated users can upload menu assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'menu-assets');

-- Allow authenticated users to update files
create policy "Authenticated users can update menu assets"
on storage.objects for update
to authenticated
using (bucket_id = 'menu-assets');

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
