-- Minimal TeachBid Database Setup for Immediate Testing
-- Run this in Supabase SQL Editor

-- 1. Create profiles table (essential)
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

-- 2. Basic RLS setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read access for now (can be restricted later)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Create demo profiles with fixed UUIDs (no need for auth users yet)
-- These will work even without corresponding auth.users entries for testing

-- Demo student profile
INSERT INTO profiles (
  id,
  email,
  role,
  display_name,
  bio,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'student1@test.com',
  'student',
  'デモ生徒',
  'TeachBidのデモ用生徒アカウントです。プログラミングと数学を学習したいと思っています。',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  updated_at = NOW();

-- Demo teacher profile  
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
  '22222222-2222-2222-2222-222222222222',
  'teacher1@test.com',
  'teacher',
  'デモ講師',
  'TeachBidのデモ用講師アカウントです。プログラミングと数学の指導が得意です。',
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

-- 5. Verify setup
SELECT 'Minimal setup completed!' as status;
SELECT 'Profiles created:' as info, count(*) as count FROM profiles;
SELECT email, role, display_name FROM profiles WHERE email LIKE '%@test.com';

-- 6. Show next steps
SELECT '
Next steps:
1. Go to Authentication > Users in Supabase Dashboard
2. Create users with emails: student1@test.com and teacher1@test.com
3. Set their IDs to: 11111111-1111-1111-1111-111111111111 and 22222222-2222-2222-2222-222222222222
4. Test login at your app
' as next_steps;