# 🚨 URGENT: Database Setup Required

## Issue Found
**The `profiles` table does not exist in the Supabase database!** This is why demo account login is failing.

## Immediate Action Required

### 1. Access Supabase Dashboard
Go to: https://jmkcostjyceaoycgfxib.supabase.co

### 2. Run Database Schema Creation
1. Navigate to **SQL Editor**
2. Create a new query
3. Copy and paste the entire contents of `scripts/create-database-schema.sql`
4. Execute the script

### 3. Create Demo Users in Authentication
Since the profiles table will be empty initially, you need to:

1. Go to **Authentication** → **Users**
2. Click **"Invite a user"** or **"Add user"**
3. Create these users:
   - **Email**: student1@test.com
   - **Password**: password123
   - **Confirm**: Yes (check "Auto Confirm User")
   
   - **Email**: teacher1@test.com  
   - **Password**: password123
   - **Confirm**: Yes (check "Auto Confirm User")

### 4. Alternative: Quick Fix with Manual Profile Creation
If you want to test immediately without creating auth users, you can modify the demo profile inserts in the SQL script to use fixed UUIDs:

```sql
-- Replace the demo data section (step 14) with:
INSERT INTO profiles (
  id,
  email,
  role,
  display_name,
  bio
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'student1@test.com',
  'student',
  'デモ生徒',
  'TeachBidのデモ用生徒アカウントです。'
);

INSERT INTO profiles (
  id,
  email,
  role,
  display_name,
  bio,
  skills,
  hourly_rate_min,
  hourly_rate_max
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'teacher1@test.com',
  'teacher',
  'デモ講師',
  'TeachBidのデモ用講師アカウントです。',
  ARRAY['プログラミング', '数学'],
  2000,
  5000
);
```

## What the Schema Creates

✅ **Core Tables**:
- `profiles` - User profiles with roles
- `teaching_requests` - Student requests
- `proposals` - Teacher proposals
- `contracts` - Agreed contracts
- `reviews` - Rating system
- `messages` - Communication
- `notifications` - User notifications

✅ **Security**:
- Row Level Security (RLS) enabled
- Proper policies for data access
- Automatic profile creation trigger

✅ **Demo Data**:
- Demo student and teacher profiles
- Ready for immediate testing

## Verification

After running the script, verify in **Table Editor**:
1. Check that `profiles` table exists
2. Confirm demo data is present
3. Test login at: https://teachbid-j17qs0ws0-shunya5566-gmailcoms-projects.vercel.app/auth/login

## Current Status
- ❌ Database schema missing
- ❌ Profiles table doesn't exist  
- ❌ Demo accounts can't login
- ✅ Application code is ready
- ✅ SQL scripts prepared
- ✅ Troubleshooting guide available

## Next Steps After Database Setup
1. Test demo account login
2. Verify user roles work correctly
3. Check dashboard redirects
4. Confirm all features work as expected