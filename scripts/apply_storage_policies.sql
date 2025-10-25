-- Apply updated storage policies to fix RLS violations
-- Run this script in your Supabase SQL editor

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

-- Verify the bucket exists and is public
update storage.buckets 
set public = true 
where id = 'menu-assets';

-- Show current policies
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies 
where tablename = 'objects' 
and schemaname = 'storage';
