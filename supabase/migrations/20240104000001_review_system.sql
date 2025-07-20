-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_type VARCHAR(10) NOT NULL CHECK (reviewer_type IN ('student', 'teacher')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  comment TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(transaction_id, reviewer_type),
  CONSTRAINT valid_reviewer_type CHECK (
    (reviewer_type = 'student' AND reviewer_id = (SELECT student_id FROM transactions WHERE id = transaction_id)) OR
    (reviewer_type = 'teacher' AND reviewer_id = (SELECT teacher_id FROM transactions WHERE id = transaction_id))
  )
);

-- Create review_helpful table for tracking helpful votes
CREATE TABLE IF NOT EXISTS review_helpful (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(review_id, user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_transaction_id ON reviews(transaction_id);
CREATE INDEX IF NOT EXISTS idx_reviews_request_id ON reviews(request_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_type ON reviews(reviewer_type);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_is_published ON reviews(is_published);

CREATE INDEX IF NOT EXISTS idx_review_helpful_review_id ON review_helpful(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_user_id ON review_helpful(user_id);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful ENABLE ROW LEVEL SECURITY;

-- RLS policies for reviews
CREATE POLICY "Users can view published reviews" ON reviews
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view their own reviews" ON reviews
  FOR SELECT USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid());

CREATE POLICY "Users can create reviews for their transactions" ON reviews
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid() AND
    transaction_id IN (
      SELECT id FROM transactions 
      WHERE (student_id = auth.uid() AND reviewer_type = 'student') OR
            (teacher_id = auth.uid() AND reviewer_type = 'teacher')
    )
  );

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (reviewer_id = auth.uid());

-- RLS policies for review_helpful
CREATE POLICY "Anyone can view helpful votes" ON review_helpful
  FOR SELECT USING (true);

CREATE POLICY "Users can vote helpful on reviews" ON review_helpful
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their helpful votes" ON review_helpful
  FOR DELETE USING (user_id = auth.uid());

-- Function to update helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE reviews 
  SET helpful_count = (
    SELECT COUNT(*) FROM review_helpful WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
  )
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for helpful count
CREATE TRIGGER trigger_update_helpful_count_insert
  AFTER INSERT ON review_helpful
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

CREATE TRIGGER trigger_update_helpful_count_delete
  AFTER DELETE ON review_helpful
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Function to calculate average rating for a user
CREATE OR REPLACE FUNCTION get_user_average_rating(user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT AVG(rating)::DECIMAL(3,2) INTO avg_rating
  FROM reviews
  WHERE reviewee_id = user_id AND is_published = true;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to get review stats for a user
CREATE OR REPLACE FUNCTION get_user_review_stats(user_id UUID)
RETURNS TABLE(
  total_reviews BIGINT,
  average_rating DECIMAL,
  rating_distribution JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_reviews,
    AVG(rating)::DECIMAL(3,2) as average_rating,
    JSON_OBJECT_AGG(rating, count) as rating_distribution
  FROM (
    SELECT 
      rating,
      COUNT(*) as count
    FROM reviews 
    WHERE reviewee_id = user_id AND is_published = true
    GROUP BY rating
  ) rating_counts;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger for reviews
CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add rating columns to profiles table for caching
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Function to update profile rating cache
CREATE OR REPLACE FUNCTION update_profile_rating_cache()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the reviewee's cached rating
  UPDATE profiles 
  SET 
    average_rating = get_user_average_rating(COALESCE(NEW.reviewee_id, OLD.reviewee_id)),
    total_reviews = (
      SELECT COUNT(*) FROM reviews 
      WHERE reviewee_id = COALESCE(NEW.reviewee_id, OLD.reviewee_id) AND is_published = true
    )
  WHERE id = COALESCE(NEW.reviewee_id, OLD.reviewee_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers to update profile rating cache
CREATE TRIGGER trigger_update_profile_rating_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_rating_cache();

CREATE TRIGGER trigger_update_profile_rating_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_rating_cache();

CREATE TRIGGER trigger_update_profile_rating_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_rating_cache();