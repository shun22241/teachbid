-- Demo user profiles creation script
-- Run this in Supabase SQL Editor after creating users

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