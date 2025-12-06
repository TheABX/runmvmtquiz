-- ============================================
-- Strength Assessment Table Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Create strength_assessment table
CREATE TABLE IF NOT EXISTS strength_assessment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE strength_assessment ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own strength assessment"
  ON strength_assessment FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own strength assessment"
  ON strength_assessment FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own strength assessment"
  ON strength_assessment FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS strength_assessment_user_id_idx ON strength_assessment(user_id);

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_strength_assessment_updated_at ON strength_assessment;
CREATE TRIGGER update_strength_assessment_updated_at
  BEFORE UPDATE ON strength_assessment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Movement Screening Columns
-- ============================================
-- Add movement screening columns to strength_assessment table
-- ============================================

-- Add columns if they don't exist
ALTER TABLE strength_assessment 
ADD COLUMN IF NOT EXISTS movement_screening_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS movement_screening_scores JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS movement_screening_total INTEGER,
ADD COLUMN IF NOT EXISTS movement_screening_pathway TEXT;

-- Example scores structure in movement_screening_scores:
-- {
--   "test1_single_leg_squat": {"left": 2, "right": 1},
--   "test2_ankle_mobility": {"left": 2, "right": 2},
--   "test3_calf_raise": {"left": 1, "right": 1},
--   "test4_hip_hinge": {"left": 2, "right": 2},
--   "test5_side_plank": {"left": 1, "right": 1},
--   "test6_t_spine": {"left": 2, "right": 2},
--   "test7_overhead_squat": 2
-- }

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the table was created correctly:
-- SELECT * FROM strength_assessment LIMIT 1;
-- 
-- Verify movement screening columns:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'strength_assessment' 
-- AND column_name LIKE 'movement_screening%';
-- ============================================

