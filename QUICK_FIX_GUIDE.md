# 🚀 QUICK FIX GUIDE - Demo Login Working in 2 Minutes!

## ✅ Good News!
Demo users **already exist** in Supabase authentication:
- student1@test.com (ID: 44415ea5-8bf3-41ef-b272-7ac5880ab3ae)
- teacher1@test.com (likely exists too)

## ❌ Issue
The `profiles` table doesn't exist, causing profile lookup to fail after successful login.

## 🎯 2-Minute Fix

### Step 1: Access Supabase Dashboard
Go to: https://jmkcostjyceaoycgfxib.supabase.co

### Step 2: Run Minimal Setup (30 seconds)
1. Click **SQL Editor**
2. Create new query
3. Copy/paste this ENTIRE script:

```sql
-- Minimal setup for immediate demo functionality
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  display_name TEXT,
  bio TEXT,
  skills TEXT[],
  hourly_rate_min INTEGER,
  hourly_rate_max INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS but allow public read
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Insert profiles for existing auth users
INSERT INTO profiles (id, email, role, display_name, bio) VALUES 
('44415ea5-8bf3-41ef-b272-7ac5880ab3ae', 'student1@test.com', 'student', 'デモ生徒', 'テスト用生徒アカウント')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, display_name = EXCLUDED.display_name;

-- Check for teacher and insert if exists
INSERT INTO profiles (id, email, role, display_name, bio, skills, hourly_rate_min, hourly_rate_max)
SELECT id, email, 'teacher', 'デモ講師', 'テスト用講師アカウント', ARRAY['プログラミング', '数学'], 2000, 5000
FROM auth.users WHERE email = 'teacher1@test.com'
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, display_name = EXCLUDED.display_name;

-- Verify
SELECT 'Setup complete!' as status;
SELECT email, role, display_name FROM profiles;
```

4. Click **Run** or press Ctrl+Enter

### Step 3: Test Login (30 seconds)
Go to: https://teachbid-6zypl4zqc-shunya5566-gmailcoms-projects.vercel.app/auth/login

Try logging in with:
- **Email**: student1@test.com
- **Password**: password123

## Expected Result
✅ Login should work completely now!
✅ Should redirect to student dashboard
✅ Profile information should display correctly

## If Teacher Login Doesn't Work
Run this additional query in SQL Editor:

```sql
-- Check if teacher user exists
SELECT id, email FROM auth.users WHERE email = 'teacher1@test.com';

-- If no result, create teacher user manually:
-- Go to Authentication > Users > Invite User
-- Email: teacher1@test.com
-- Password: password123
-- Auto-confirm: Yes

-- Then run this after creating the user:
INSERT INTO profiles (id, email, role, display_name, bio, skills, hourly_rate_min, hourly_rate_max)
SELECT id, email, 'teacher', 'デモ講師', 'テスト用講師アカウント', ARRAY['プログラミング', '数学'], 2000, 5000
FROM auth.users WHERE email = 'teacher1@test.com'
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
```

## Verification Commands
After setup, run these in SQL Editor to verify:

```sql
-- Check profiles
SELECT email, role, display_name FROM profiles;

-- Check auth users
SELECT email, created_at FROM auth.users WHERE email LIKE '%@test.com';
```

## Why This Works
1. ✅ Auth users already exist (confirmed by login test)
2. ✅ We create the missing `profiles` table
3. ✅ We insert profiles for existing auth users
4. ✅ RLS policies allow proper access
5. ✅ Demo login should work immediately!

Total time: **Under 2 minutes**