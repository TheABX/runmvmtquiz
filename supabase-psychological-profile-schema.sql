-- ============================================
-- Psychological Profile Table Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Create psychological_profile table
CREATE TABLE IF NOT EXISTS psychological_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  main_section TEXT,
  personalized_intro TEXT,
  strength TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE psychological_profile ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own psychological profile"
  ON psychological_profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own psychological profile"
  ON psychological_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own psychological profile"
  ON psychological_profile FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS psychological_profile_user_id_idx ON psychological_profile(user_id);

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_psychological_profile_updated_at ON psychological_profile;
CREATE TRIGGER update_psychological_profile_updated_at
  BEFORE UPDATE ON psychological_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the table was created correctly:
-- SELECT * FROM psychological_profile LIMIT 1;
-- ============================================

