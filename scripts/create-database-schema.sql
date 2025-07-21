-- TeachBid Database Schema Creation Script
-- Run this in Supabase SQL Editor

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  skills TEXT[],
  hourly_rate_min INTEGER,
  hourly_rate_max INTEGER,
  location TEXT,
  timezone TEXT,
  language_preferences TEXT[],
  availability JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create teaching_requests table
CREATE TABLE IF NOT EXISTS teaching_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  level TEXT NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  preferred_schedule TEXT,
  location_type TEXT CHECK (location_type IN ('online', 'in_person', 'both')),
  location TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES teaching_requests(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  proposed_rate INTEGER NOT NULL,
  estimated_hours INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES teaching_requests(id) ON DELETE CASCADE NOT NULL,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  agreed_rate INTEGER NOT NULL,
  total_hours INTEGER,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  request_id UUID REFERENCES teaching_requests(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaching_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Teaching requests policies
CREATE POLICY "Anyone can view open requests" ON teaching_requests FOR SELECT USING (true);
CREATE POLICY "Students can create requests" ON teaching_requests FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own requests" ON teaching_requests FOR UPDATE USING (auth.uid() = student_id);

-- Proposals policies
CREATE POLICY "Anyone can view proposals" ON proposals FOR SELECT USING (true);
CREATE POLICY "Teachers can create proposals" ON proposals FOR INSERT WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "Teachers can update own proposals" ON proposals FOR UPDATE USING (auth.uid() = teacher_id);

-- Contracts policies
CREATE POLICY "Contract parties can view contracts" ON contracts FOR SELECT USING (auth.uid() = student_id OR auth.uid() = teacher_id);
CREATE POLICY "Students can create contracts" ON contracts FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Contract parties can update contracts" ON contracts FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = teacher_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their contracts" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- 10. Create functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teaching_requests_updated_at BEFORE UPDATE ON teaching_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. Insert demo data
INSERT INTO profiles (
  id,
  email,
  role,
  display_name,
  bio,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'student1@test.com',
  'student',
  'デモ生徒',
  'TeachBidのデモ用生徒アカウントです。プログラミングと数学を学習したいと思っています。',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  updated_at = NOW();

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
  gen_random_uuid(),
  'teacher1@test.com',
  'teacher',
  'デモ講師',
  'TeachBidのデモ用講師アカウントです。プログラミングと数学の指導が得意です。',
  ARRAY['プログラミング', '数学', 'Python', 'JavaScript'],
  2000,
  5000,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills,
  hourly_rate_min = EXCLUDED.hourly_rate_min,
  hourly_rate_max = EXCLUDED.hourly_rate_max,
  updated_at = NOW();

-- 15. Verify the setup
SELECT 'Database schema created successfully!' as status;
SELECT 'Profiles table:' as info, count(*) as count FROM profiles;
SELECT 'Demo profiles:' as info, email, role, display_name FROM profiles WHERE email LIKE '%@test.com';