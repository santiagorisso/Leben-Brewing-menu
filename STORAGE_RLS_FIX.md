# Storage RLS Policy Fix

## Problem

You were getting a "new row violates row-level security policy" error when trying to upload files to Supabase Storage.

## Root Cause

1. **Missing Service Role Policy**: Your RLS policies only allowed `authenticated` users, but server-side operations using service role keys were being blocked
2. **Authentication Context**: Client-side operations weren't properly checking authentication status before attempting storage operations

## Solution Applied

### 1. Updated RLS Policies (`scripts/apply_storage_policies.sql`)

- Added a policy for `service_role` to manage all files (for server-side operations)
- Kept existing policies for authenticated users
- Maintained public read access

### 2. Enhanced Client-Side Authentication (`lib/supabase-storage-client.ts`)

- Added authentication checks before storage operations
- Better error messages for unauthenticated users
- Proper error handling

### 3. Key Changes Made

#### Storage Policies

```sql
-- Allow service role to manage all files (for server-side operations)
create policy "Service role can manage menu assets"
on storage.objects for all
to service_role
using (bucket_id = 'menu-assets')
with check (bucket_id = 'menu-assets');
```

#### Client Authentication

```typescript
// Check if user is authenticated before storage operations
const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser();

if (authError || !user) {
  return {
    success: false,
    error:
      "You must be logged in to save menu data. Please log in and try again.",
  };
}
```

## How to Apply the Fix

### Step 1: Apply the SQL Policies

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the contents of `scripts/apply_storage_policies.sql`

### Step 2: Verify Environment Variables

Make sure you have these environment variables set:

```env
SUPABASE_SUPABASE_URL=your_supabase_url
SUPABASE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Test the Fix

1. Try uploading a file through your admin interface
2. Check that authenticated users can save menu data
3. Verify that public users can still read menu data

## What This Fixes

✅ **Server-side operations** now work with service role key  
✅ **Client-side operations** require proper authentication  
✅ **Public read access** is maintained  
✅ **Better error messages** for authentication issues

## Troubleshooting

If you still get RLS errors:

1. **Check your service role key** - Make sure `SUPABASE_SERVICE_ROLE_KEY` is set correctly
2. **Verify policies were applied** - Run the verification query in the SQL script
3. **Check authentication status** - Ensure users are properly logged in before storage operations
4. **Review bucket settings** - Make sure the bucket is public for read operations

## Files Modified

- `scripts/001_create_storage_bucket.sql` - Updated RLS policies
- `scripts/apply_storage_policies.sql` - New script to apply fixes
- `lib/supabase-storage-client.ts` - Added authentication checks
- `STORAGE_RLS_FIX.md` - This documentation
