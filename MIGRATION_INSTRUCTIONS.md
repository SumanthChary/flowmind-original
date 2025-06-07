# Database Migration Required

The application is failing because the `profiles` table doesn't exist in your Supabase database.

## Steps to Fix:

1. **Open Supabase Studio**
   - Go to your Supabase project dashboard
   - Navigate to the "SQL Editor" tab

2. **Execute the Migration**
   - Copy the entire contents of `supabase/migrations/20250603162407_copper_feather.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

3. **Verify the Table Creation**
   - Go to the "Table Editor" tab
   - You should see a new `profiles` table with the following columns:
     - `id` (uuid, primary key)
     - `full_name` (text)
     - `avatar_url` (text)
     - `updated_at` (timestamp)

## What This Migration Does:

- Creates the `profiles` table with proper foreign key relationship to `auth.users`
- Sets up Row Level Security (RLS) policies
- Creates triggers for automatic profile creation and timestamp updates
- Allows authenticated users to read and update their own profiles

After running this migration, the authentication and profile functionality will work correctly.