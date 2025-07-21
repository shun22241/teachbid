-- FINAL SETUP: Run this in Supabase SQL Editor
-- This will enable demo login immediately!

-- 1. Create profiles table
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

-- 2. Enable RLS with permissive policies for demo
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Insert profiles for existing demo users (EXACT IDs from auth.users)
INSERT INTO profiles (id, email, role, display_name, bio, created_at, updated_at) VALUES 
(
  '44415ea5-8bf3-41ef-b272-7ac5880ab3ae',
  'student1@test.com', 
  'student', 
  'デモ生徒', 
  'TeachBidのデモ用生徒アカウントです。プログラミングと数学を学習したいと思っています。',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET 
  role = EXCLUDED.role, 
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  updated_at = NOW();

INSERT INTO profiles (id, email, role, display_name, bio, skills, hourly_rate_min, hourly_rate_max, created_at, updated_at) VALUES 
(
  '175be6d0-c932-4277-b9ba-63c35ddc7d6e',
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
  role = EXCLUDED.role, 
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills,
  hourly_rate_min = EXCLUDED.hourly_rate_min,
  hourly_rate_max = EXCLUDED.hourly_rate_max,
  updated_at = NOW();

-- 4. Verify setup
SELECT '🎉 DEMO SETUP COMPLETE!' as status;
SELECT '👥 Profiles created:' as info, count(*) as count FROM profiles;
SELECT '📋 Demo accounts:' as accounts, email, role, display_name FROM profiles WHERE email LIKE '%@test.com';

-- 5. Success message
SELECT '
✅ DEMO LOGIN NOW READY!

Test at: https://teachbid-6zypl4zqc-shunya5566-gmailcoms-projects.vercel.app/auth/login

Accounts:
📚 Student: student1@test.com / password123
👨‍🏫 Teacher: teacher1@test.com / password123

Both should login and redirect to their respective dashboards!
' as success_message;