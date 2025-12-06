# Psychological Performance Profile Implementation

## ✅ Implementation Complete

All files have been created and updated. Here's what was implemented:

### Files Created/Updated:

1. ✅ `src/lib/psychologicalQuizConfig.ts` - Quiz questions and logic functions
2. ✅ `app/dashboard/psychological-profile/page.tsx` - Full quiz UI
3. ✅ `src/pdf/PsychologicalProfile.tsx` - PDF component with personalized feedback
4. ✅ `app/api/generate-psychological-profile/route.ts` - API route to generate PDF
5. ✅ `app/dashboard/performance-setup/page.tsx` - Updated to check completion status
6. ✅ `supabase-psychological-profile-schema.sql` - SQL schema file

## 🔧 Next Step: Run SQL in Supabase

**IMPORTANT:** You need to run this SQL in your Supabase SQL Editor:

```sql
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

-- Enable RLS
ALTER TABLE psychological_profile ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create index
CREATE INDEX IF NOT EXISTS psychological_profile_user_id_idx ON psychological_profile(user_id);
```

## 📋 How It Works

### Quiz Flow:

1. **User clicks "Start Mindset Profile"** on performance setup page
2. **4 questions asked:**
   - Main mental challenge
   - Response to discomfort
   - Response to bad sessions
   - Pre-run state
3. **Answers analyzed** to determine:
   - Main section (Performance Anxiety / Negative Self-Talk / Pacing Anxiety / Bad Sessions)
   - Personalized intro line
   - Strength identification
4. **Results saved** to Supabase
5. **PDF generated** with personalized feedback

### Mindset Sections:

1. **Performance Anxiety** - Process anchoring strategies
2. **Negative Self-Talk & Overthinking** - Pattern interrupt techniques
3. **Pacing Anxiety** - The 2km Rule
4. **Emotional Recovery** - 24-Hour Rule for bad sessions

### PDF Features:

- Personalized intro based on quiz answers
- Relevant mindset section with strategies
- Strength reinforcement message
- Practical action steps
- Clean, professional layout matching other PDFs

## 🔗 Routes

- `/dashboard/psychological-profile` - Quiz page
- `/api/generate-psychological-profile` - PDF generation endpoint

## ✅ Testing Checklist

1. Run the SQL in Supabase
2. Navigate to `/dashboard/performance-setup`
3. Click "Start Mindset Profile"
4. Complete the 4 questions
5. Verify PDF downloads with personalized content
6. Check that module shows as completed on dashboard

