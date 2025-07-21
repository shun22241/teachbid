# Supabase Demo Account Troubleshooting Guide

## Step 1: Check Supabase Dashboard

### 1.1 Table Editor → profiles テーブル
- Navigate to your Supabase project: https://jmkcostjyceaoycgfxib.supabase.co
- Go to Table Editor
- Check if `profiles` table exists
- Check if it contains any data

### 1.2 Authentication → Users
- Check if demo users exist:
  - student1@test.com
  - teacher1@test.com
- If not, you need to create them manually

## Step 2: Create Demo Users (if they don't exist)

### In Supabase Dashboard → Authentication → Users
1. Click "Invite a user"
2. Create student1@test.com with password: password123
3. Create teacher1@test.com with password: password123
4. Make sure to confirm both accounts

## Step 3: Create Profiles (if profiles table is empty)

### Option A: Using SQL Editor
Copy and paste the contents of `scripts/manual-create-profiles.sql`:

```sql
-- Check what users exist first
SELECT id, email FROM auth.users WHERE email IN ('student1@test.com', 'teacher1@test.com');

-- Insert student profile
INSERT INTO profiles (
  id,
  email,
  role,
  display_name,
  bio,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'student1@test.com'),
  'student1@test.com',
  'student',
  'テスト生徒',
  'デモ用の生徒アカウントです。プログラミングと数学を学習中。',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  updated_at = NOW();

-- Insert teacher profile  
INSERT INTO profiles (
  id,
  email,
  role,
  display_name,
  bio,
  skills,
  hourly_rate_min,
  hourly_rate_max,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'teacher1@test.com'),
  'teacher1@test.com',
  'teacher',
  'テスト講師',
  'デモ用の講師アカウントです。プログラミングと数学の指導が得意。',
  ARRAY['プログラミング', '数学', 'Python', 'JavaScript'],
  2000,
  5000,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills,
  hourly_rate_min = EXCLUDED.hourly_rate_min,
  hourly_rate_max = EXCLUDED.hourly_rate_max,
  updated_at = NOW();

-- Verify insertions
SELECT id, email, role, display_name FROM profiles WHERE email IN ('student1@test.com', 'teacher1@test.com');
```

## Step 4: Check RLS (Row Level Security)

### 4.1 Authentication → Policies
- Check if there are policies on the `profiles` table
- Policies may be blocking access

### 4.2 Temporarily Disable RLS (for testing only)
```sql
-- Check current RLS status
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';

-- Temporarily disable RLS for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable RLS
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

## Step 5: Test Login

1. Go to your deployed app: https://teachbid-pgtm3fklx-shunya5566-gmailcoms-projects.vercel.app/auth/login
2. Try logging in with:
   - student1@test.com / password123
   - teacher1@test.com / password123
3. Check browser console for any errors

## Step 6: Debug with Browser Console

If login still fails, open browser Developer Tools (F12) and run:

```javascript
// Check Supabase client
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Check authentication state
supabase.auth.getUser().then(result => {
  console.log('Current user:', result);
});

// Check profiles table access
supabase.from('profiles').select('*').limit(1).then(result => {
  console.log('Profiles access test:', result);
});
```

## Common Issues and Solutions

### Issue 1: "Invalid login credentials"
- **Cause**: User doesn't exist in auth.users
- **Solution**: Create users manually in Supabase Dashboard

### Issue 2: "User profile not found"
- **Cause**: User exists in auth.users but not in profiles table
- **Solution**: Run the manual SQL script from Step 3

### Issue 3: "Access denied" or "Row level security policy violation"
- **Cause**: RLS policies are blocking access
- **Solution**: Temporarily disable RLS or fix policies

### Issue 4: "Table 'profiles' doesn't exist"
- **Cause**: Database migration hasn't been run
- **Solution**: Check if database schema is properly set up

## Service Role Key Issue

The current `.env.local` has the same key for both `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`. To get the proper service role key:

1. Go to Supabase Dashboard → Settings → API
2. Copy the "service_role" key (not the anon key)
3. Update `.env.local` with the correct service role key
4. This will allow the `npm run create-demo-users` script to work

## Next Steps

After completing the above steps:
1. Test login functionality
2. Verify user roles are working correctly
3. Check that dashboard redirects work properly
4. Deploy any fixes if needed