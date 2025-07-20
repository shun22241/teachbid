-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- Custom types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE request_status AS ENUM ('open', 'matched', 'in_progress', 'completed', 'cancelled');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE proposal_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- Users profile table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  certifications TEXT[],
  hourly_rate_min INTEGER,
  hourly_rate_max INTEGER,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  rating_count INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  total_spending INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_account_id TEXT,
  referral_code TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  referred_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning requests table
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT NOT NULL CHECK (char_length(description) <= 2000),
  learning_goals TEXT[] NOT NULL,
  current_level TEXT,
  budget_min INTEGER NOT NULL CHECK (budget_min >= 1000),
  budget_max INTEGER NOT NULL CHECK (budget_max >= budget_min),
  duration_weeks INTEGER CHECK (duration_weeks > 0 AND duration_weeks <= 52),
  lessons_per_week INTEGER CHECK (lessons_per_week > 0 AND lessons_per_week <= 7),
  lesson_duration_minutes INTEGER CHECK (lesson_duration_minutes IN (30, 45, 60, 90, 120)),
  preferred_schedule JSONB,
  timezone TEXT DEFAULT 'Asia/Tokyo',
  deadline DATE CHECK (deadline > CURRENT_DATE),
  status request_status DEFAULT 'open',
  slug TEXT UNIQUE NOT NULL,
  views INTEGER DEFAULT 0,
  is_urgent BOOLEAN DEFAULT FALSE,
  urgent_until TIMESTAMPTZ,
  matched_proposal_id UUID,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teacher proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 1000),
  message TEXT NOT NULL CHECK (char_length(message) >= 50 AND char_length(message) <= 1000),
  lesson_plan TEXT NOT NULL CHECK (char_length(lesson_plan) <= 2000),
  available_schedule JSONB,
  sample_materials TEXT[],
  guarantee_terms TEXT,
  status proposal_status DEFAULT 'pending',
  is_selected BOOLEAN DEFAULT FALSE,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(request_id, teacher_id)
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES requests(id) NOT NULL,
  proposal_id UUID REFERENCES proposals(id) NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  teacher_id UUID REFERENCES profiles(id) NOT NULL,
  amount INTEGER NOT NULL,
  fee_rate DECIMAL(4,3) NOT NULL CHECK (fee_rate >= 0 AND fee_rate <= 1),
  fee_amount INTEGER NOT NULL,
  net_amount INTEGER NOT NULL,
  referral_discount INTEGER DEFAULT 0,
  promo_discount INTEGER DEFAULT 0,
  final_amount INTEGER NOT NULL,
  status transaction_status DEFAULT 'pending',
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_transfer_id TEXT,
  paid_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_amount INTEGER,
  refund_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue records for analytics
CREATE TABLE revenue_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('fee', 'urgent_option', 'boost_option', 'subscription', 'referral_bonus')),
  amount INTEGER NOT NULL,
  user_id UUID REFERENCES profiles(id),
  transaction_id UUID REFERENCES transactions(id),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories master table
CREATE TABLE categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  meta_keywords TEXT[],
  average_price_min INTEGER,
  average_price_max INTEGER,
  popular_skills TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) UNIQUE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT CHECK (char_length(comment) <= 500),
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (future implementation)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES requests(id) NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  recipient_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Option purchases (urgent listing, proposal boost)
CREATE TABLE option_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('urgent_listing', 'proposal_boost')),
  target_id UUID NOT NULL, -- request_id or proposal_id
  amount INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_rating ON profiles(rating DESC);
CREATE INDEX idx_requests_student_id ON requests(student_id);
CREATE INDEX idx_requests_category ON requests(category);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX idx_requests_slug ON requests(slug);
CREATE INDEX idx_proposals_request_id ON proposals(request_id);
CREATE INDEX idx_proposals_teacher_id ON proposals(teacher_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id, is_read);

-- Full text search indexes
CREATE INDEX idx_requests_search ON requests USING gin(to_tsvector('japanese', title || ' ' || description));
CREATE INDEX idx_profiles_search ON profiles USING gin(to_tsvector('japanese', display_name || ' ' || COALESCE(bio, '')));

-- Functions
-- Auto-generate slug for requests
CREATE OR REPLACE FUNCTION generate_unique_slug(title TEXT, table_name TEXT)
RETURNS TEXT AS $
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert to lowercase, replace spaces and special chars
  base_slug := LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9ぁ-んァ-ヶー一-龠]+', '-', 'g'));
  base_slug := REGEXP_REPLACE(base_slug, '-+', '-', 'g');
  base_slug := TRIM(BOTH '-' FROM base_slug);
  base_slug := LEFT(base_slug, 50);
  
  final_slug := base_slug;
  
  -- Check uniqueness
  LOOP
    IF table_name = 'requests' THEN
      EXIT WHEN NOT EXISTS (SELECT 1 FROM requests WHERE slug = final_slug);
    END IF;
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$ LANGUAGE plpgsql;

-- Calculate and update user ratings
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $
DECLARE
  new_rating DECIMAL(3,2);
  new_count INTEGER;
BEGIN
  SELECT AVG(rating)::DECIMAL(3,2), COUNT(*)::INTEGER
  INTO new_rating, new_count
  FROM reviews
  WHERE reviewee_id = NEW.reviewee_id
  AND is_public = TRUE;
  
  UPDATE profiles
  SET rating = COALESCE(new_rating, 0),
      rating_count = COALESCE(new_count, 0),
      updated_at = NOW()
  WHERE id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Update profile earnings/spending
CREATE OR REPLACE FUNCTION update_profile_financials()
RETURNS TRIGGER AS $
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update teacher earnings
    UPDATE profiles
    SET total_earnings = total_earnings + NEW.net_amount,
        updated_at = NOW()
    WHERE id = NEW.teacher_id;
    
    -- Update student spending
    UPDATE profiles
    SET total_spending = total_spending + NEW.final_amount,
        updated_at = NOW()
    WHERE id = NEW.student_id;
  END IF;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO profiles (id, email, role, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  
  -- Create welcome notification
  INSERT INTO notifications (user_id, type, title, message)
  VALUES (
    NEW.id,
    'welcome',
    'TeachBidへようこそ！',
    'アカウントの作成が完了しました。プロフィールを充実させて、学習を始めましょう。'
  );
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();

CREATE TRIGGER on_transaction_completed
  AFTER UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_profile_financials();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Requests
CREATE POLICY "Requests are viewable by everyone" ON requests
  FOR SELECT USING (status != 'cancelled' OR student_id = auth.uid());

CREATE POLICY "Students can create requests" ON requests
  FOR INSERT WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'student')
  );

CREATE POLICY "Students can update own requests" ON requests
  FOR UPDATE USING (auth.uid() = student_id);

-- Proposals
CREATE POLICY "Proposals viewable by request owner and proposal creator" ON proposals
  FOR SELECT USING (
    auth.uid() = teacher_id OR
    auth.uid() IN (SELECT student_id FROM requests WHERE id = proposals.request_id)
  );

CREATE POLICY "Teachers can create proposals" ON proposals
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

CREATE POLICY "Teachers can update own proposals within 24 hours" ON proposals
  FOR UPDATE USING (
    auth.uid() = teacher_id AND
    created_at > NOW() - INTERVAL '24 hours'
  );

-- Transactions
CREATE POLICY "Transactions viewable by participants only" ON transactions
  FOR SELECT USING (
    auth.uid() IN (student_id, teacher_id) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);