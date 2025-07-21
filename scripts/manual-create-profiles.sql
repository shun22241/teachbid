-- Manual demo user profiles creation script
-- Run this in Supabase SQL Editor after creating auth users

-- First, check if profiles table exists and what columns it has
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';

-- Insert student profile
-- Note: You may need to get the actual user IDs from auth.users table first
-- SELECT id, email FROM auth.users WHERE email IN ('student1@test.com', 'teacher1@test.com');

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

-- Alternative: If you need to insert with specific UUIDs (replace with actual user IDs):
/*
-- student1 profile with fixed UUID (replace with actual ID)
INSERT INTO profiles (id, email, role, display_name, bio, created_at, updated_at)
VALUES (
  '44415ea5-8bf3-41ef-b272-7ac5880ab3ae',
  'student1@test.com',
  'student',
  'テスト生徒',
  'デモ用の生徒アカウントです。',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  updated_at = NOW();

-- teacher1 profile with fixed UUID (replace with actual ID)
INSERT INTO profiles (id, email, role, display_name, bio, skills, hourly_rate_min, hourly_rate_max, created_at, updated_at)
VALUES (
  '175be6d0-c932-4277-b9ba-63c35ddc7d6e',
  'teacher1@test.com',
  'teacher',
  'テスト講師',
  'デモ用の講師アカウントです。',
  ARRAY['プログラミング', '数学'],
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
*/

-- Check RLS status
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';

-- If you need to temporarily disable RLS for testing (use with caution):
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- To re-enable RLS later:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verify the insertions
SELECT id, email, role, display_name FROM profiles WHERE email IN ('student1@test.com', 'teacher1@test.com');