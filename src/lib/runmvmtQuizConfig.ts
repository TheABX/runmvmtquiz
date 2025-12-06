import type { QuizQuestion } from './runmvmtTypes';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // SECTION 1 — Goal Clarity
  {
    id: "goal_distance",
    section: "Goal",
    question: "What distance are you training for?",
    type: "single_choice",
    required: true,
    options: [
      { id: "5k", label: "5km" },
      { id: "10k", label: "10km" },
      { id: "half_marathon", label: "Half Marathon" },
      { id: "marathon", label: "Marathon" },
      { id: "50k", label: "50km Ultra" },
      { id: "80k", label: "80km Ultra" },
      { id: "100k_plus", label: "100km+ Ultra" }
    ]
  },
  {
    id: "goal_type",
    section: "Goal",
    question: "What's your primary goal?",
    type: "single_choice",
    required: true,
    options: [
      { id: "complete", label: "Run the whole distance" },
      { id: "pb", label: "Improve my PB" },
      { id: "comfortable", label: "Complete comfortably" },
      { id: "race", label: "Race competitively" },
      { id: "unsure", label: "Not sure — just want a structured plan" }
    ]
  },
  {
    id: "has_race_date",
    section: "Goal",
    question: "Do you already have a race date?",
    type: "single_choice",
    required: true,
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No, I just want a general plan" }
    ]
  },
  {
    id: "race_date",
    section: "Goal",
    question: "If yes, when is your race?",
    type: "date",
    required: false,
    helperText: "Optional — helps us align the plan to your race."
  },
  // SECTION 2 — Current Running Ability
  {
    id: "current_runs_per_week",
    section: "Current Ability",
    question: "How many times per week do you currently run?",
    type: "single_choice",
    required: true,
    options: [
      { id: "0", label: "0" },
      { id: "1_2", label: "1–2" },
      { id: "3_4", label: "3–4" },
      { id: "5_6", label: "5–6" },
      { id: "7_plus", label: "7+" }
    ]
  },
  {
    id: "current_weekly_km",
    section: "Current Ability",
    question: "What's your current average weekly distance?",
    type: "single_choice",
    required: true,
    options: [
      { id: "<10", label: "<10km" },
      { id: "10_30", label: "10–30km" },
      { id: "30_50", label: "30–50km" },
      { id: "50_80", label: "50–80km" },
      { id: "80_120", label: "80–120km" },
      { id: "120_plus", label: "120km+" }
    ]
  },
  {
    id: "longest_run",
    section: "Current Ability",
    question: "What's your current longest run distance?",
    type: "single_choice",
    required: true,
    options: [
      { id: "<5", label: "<5km" },
      { id: "5_10", label: "5–10km" },
      { id: "10_21", label: "10–21km" },
      { id: "21_30", label: "21–30km" },
      { id: "30_50", label: "30–50km" },
      { id: "50_plus", label: "50km+" }
    ]
  },
  {
    id: "recent_race_time",
    section: "Current Ability",
    question: "If you've raced recently, share a time for one of these distances (optional).",
    type: "text",
    required: false,
    placeholder: "e.g. 5km in 22:30, or 'None'"
  },
  // SECTION 3 — Training Preference + Lifestyle
  {
    id: "preferred_days_per_week",
    section: "Preferences",
    question: "How many days per week do you want to train?",
    type: "single_choice",
    required: true,
    options: [
      { id: "2_3", label: "2–3" },
      { id: "3_4", label: "3–4" },
      { id: "4_5", label: "4–5" },
      { id: "5_6", label: "5–6" },
      { id: "6_7", label: "6–7" }
    ]
  },
  {
    id: "session_preferences",
    section: "Preferences",
    question: "What type of sessions do you enjoy most?",
    type: "multi_choice",
    required: false,
    options: [
      { id: "easy", label: "Easy runs" },
      { id: "intervals", label: "Speed work / intervals" },
      { id: "long_slow", label: "Long slow runs" },
      { id: "hills", label: "Hill sessions" },
      { id: "variety", label: "Variety — surprise me" }
    ]
  },
  {
    id: "lifestyle",
    section: "Preferences",
    question: "What best describes your lifestyle outside of running?",
    type: "single_choice",
    required: true,
    options: [
      { id: "desk", label: "Lots of sitting / office work" },
      { id: "mixed", label: "Mix of movement and desk work" },
      { id: "active_job", label: "Active job (on your feet all day)" },
      { id: "heavy_labour", label: "Heavy labour / physically demanding work" },
      { id: "parent_low_sleep", label: "Parent with limited sleep" },
      { id: "other_mix", label: "A mix of the above" }
    ]
  },
  // SECTION 4 — Injury + Limitations
  {
    id: "injury_status",
    section: "Injury",
    question: "Have you had any injuries in the last 6 months?",
    type: "single_choice",
    required: true,
    options: [
      { id: "none", label: "No" },
      { id: "minor", label: "Minor niggles" },
      { id: "current", label: "Yes — currently injured" },
      { id: "recurring", label: "Yes — recurring issues (knees, shins, hips, ankles, etc.)" }
    ]
  },
  {
    id: "recovery_feel",
    section: "Injury",
    question: "How would you describe your recovery ability right now?",
    type: "single_choice",
    required: true,
    options: [
      { id: "fast", label: "I recover fast" },
      { id: "normal", label: "Pretty normal" },
      { id: "sore", label: "I get sore easily" },
      { id: "burnt_out", label: "I'm constantly tired or burnt out" }
    ]
  },
  // SECTION 5 — Terrain, Race Type & Strength
  {
    id: "main_surface",
    section: "Terrain",
    question: "What surface do you mostly run on?",
    type: "single_choice",
    required: true,
    options: [
      { id: "road", label: "Road" },
      { id: "trail", label: "Trail" },
      { id: "treadmill", label: "Treadmill" },
      { id: "mixed", label: "Mix of road and trail" }
    ]
  },
  {
    id: "course_profile",
    section: "Terrain",
    question: "Is your event flat or hilly?",
    type: "single_choice",
    required: true,
    options: [
      { id: "flat", label: "Mostly flat" },
      { id: "rolling", label: "Rolling hills" },
      { id: "mountain", label: "Steep hills / mountain ultra" },
      { id: "unsure", label: "Not sure yet" }
    ]
  },
  {
    id: "strength_training",
    section: "Strength",
    question: "Do you currently do strength training?",
    type: "single_choice",
    required: true,
    options: [
      { id: "yes_consistent", label: "Yes — consistently (2–3x/week)" },
      { id: "yes_inconsistent", label: "Yes — but inconsistent" },
      { id: "no_but_open", label: "No — but willing to start" },
      { id: "no_not_interested", label: "No — and not interested" }
    ]
  },
  // SECTION 6 — Mindset + Accountability
  {
    id: "structure_preference",
    section: "Mindset",
    question: "What best describes your approach to training?",
    type: "single_choice",
    required: true,
    options: [
      { id: "strict", label: "I like a strict plan with clear structure" },
      { id: "flexible", label: "I want flexibility" },
      { id: "middle", label: "Somewhere in between" }
    ]
  },
  {
    id: "biggest_challenge",
    section: "Mindset",
    question: "What's your biggest challenge with running right now?",
    type: "single_choice",
    required: true,
    options: [
      { id: "consistency", label: "Staying consistent" },
      { id: "injury_free", label: "Staying injury-free" },
      { id: "speed", label: "Running faster" },
      { id: "distance", label: "Running longer" },
      { id: "confidence", label: "Confidence / not knowing what to do" },
      { id: "nutrition", label: "Nutrition & fuelling" },
      { id: "other", label: "Something else" }
    ]
  },
  {
    id: "other_challenge_detail",
    section: "Mindset",
    question: "If you selected 'Something else', tell us more (optional).",
    type: "text",
    required: false
  },
  // SECTION 7 — Optional Advanced Inputs
  {
    id: "uses_hr",
    section: "Advanced",
    question: "Do you track heart rate?",
    type: "single_choice",
    required: false,
    options: [
      { id: "hr_yes", label: "Yes" },
      { id: "hr_yes_unsure", label: "Yes, but I'm not sure how to use it" },
      { id: "hr_no", label: "No" }
    ]
  },
  {
    id: "threshold_hr",
    section: "Advanced",
    question: "If known, what is your approximate threshold heart rate? (optional)",
    type: "number",
    required: false,
    placeholder: "e.g. 170"
  },
  {
    id: "tracking_method",
    section: "Advanced",
    question: "Do you normally track pace or power?",
    type: "single_choice",
    required: false,
    options: [
      { id: "pace", label: "Pace" },
      { id: "power", label: "Power" },
      { id: "both", label: "Both" },
      { id: "neither", label: "Neither" }
    ]
  }
];


