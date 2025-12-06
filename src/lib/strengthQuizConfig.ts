import type { QuizQuestion } from './runmvmtTypes';

export const STRENGTH_QUESTIONS: QuizQuestion[] = [
  // SECTION 1: Strength Training Experience
  {
    id: "strength_familiarity",
    section: "Strength Training Experience",
    question: "How familiar are you with strength training?",
    type: "single_choice",
    required: true,
    options: [
      { id: "never", label: "I've never done it" },
      { id: "little", label: "I've done a little, but inconsistently" },
      { id: "1-2x", label: "I train strength 1–2x per week" },
      { id: "3+", label: "I train strength 3+ times per week" },
      { id: "experienced", label: "I am experienced with structured strength programs" }
    ]
  },
  {
    id: "exercise_confidence",
    section: "Strength Training Experience",
    question: "How confident do you feel performing exercises like squats, lunges, deadlifts, and planks?",
    type: "single_choice",
    required: true,
    options: [
      { id: "not_confident", label: "Not confident" },
      { id: "somewhat", label: "Somewhat confident" },
      { id: "very_confident", label: "Very confident" }
    ]
  },
  {
    id: "runner_strength_program",
    section: "Strength Training Experience",
    question: "Have you ever followed a strength program specifically designed for runners?",
    type: "single_choice",
    required: true,
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" }
    ]
  },
  
  // SECTION 2: Equipment + Training Environment
  {
    id: "equipment_access",
    section: "Equipment + Training Environment",
    question: "What equipment do you have access to? (Select all that apply)",
    type: "multi_choice",
    required: true,
    options: [
      { id: "bodyweight", label: "Bodyweight only" },
      { id: "dumbbells", label: "Dumbbells" },
      { id: "kettlebells", label: "Kettlebells" },
      { id: "barbell", label: "Barbell + plates" },
      { id: "cable_machine", label: "Cable machine" },
      { id: "resistance_bands", label: "Resistance bands" },
      { id: "trx", label: "TRX" },
      { id: "gym_machines", label: "Leg press / gym machines" },
      { id: "home_gym", label: "Home gym setup" },
      { id: "commercial_gym", label: "I train at a commercial gym" }
    ]
  },
  {
    id: "training_location",
    section: "Equipment + Training Environment",
    question: "Where do you prefer to train?",
    type: "single_choice",
    required: true,
    options: [
      { id: "home", label: "At home" },
      { id: "gym", label: "At a gym" },
      { id: "either", label: "Either" }
    ]
  },
  
  // SECTION 3: Training Availability
  {
    id: "days_per_week",
    section: "Training Availability",
    question: "How many days per week can you commit to strength training?",
    type: "single_choice",
    required: true,
    options: [
      { id: "1", label: "1 day" },
      { id: "2", label: "2 days" },
      { id: "3", label: "3 days" },
      { id: "4+", label: "4+ days" }
    ]
  },
  {
    id: "session_duration",
    section: "Training Availability",
    question: "How long can you spend on each session?",
    type: "single_choice",
    required: true,
    options: [
      { id: "15-20", label: "15–20 minutes" },
      { id: "20-30", label: "20–30 minutes" },
      { id: "30-45", label: "30–45 minutes" },
      { id: "45-60", label: "45–60 minutes" }
    ]
  },
  {
    id: "training_timing",
    section: "Training Availability",
    question: "When do you prefer to strength train?",
    type: "single_choice",
    required: true,
    options: [
      { id: "before", label: "Before running" },
      { id: "after", label: "After running" },
      { id: "non_running", label: "On non-running days" },
      { id: "no_preference", label: "No preference" }
    ]
  },
  
  // SECTION 4: Injury History + Limitations
  {
    id: "injury_history",
    section: "Injury History + Limitations",
    question: "Have you had any injuries in the last 12 months?",
    type: "single_choice",
    required: true,
    options: [
      { id: "none", label: "No injuries" },
      { id: "minor", label: "Minor niggles only" },
      { id: "one", label: "One significant injury" },
      { id: "multiple", label: "Multiple injuries" }
    ]
  },
  {
    id: "injury_type",
    section: "Injury History + Limitations",
    question: "What type of injury?",
    type: "multi_choice",
    required: false,
    options: [
      { id: "foot_ankle", label: "Foot / ankle" },
      { id: "knee", label: "Knee" },
      { id: "hip_glutes", label: "Hip / glutes" },
      { id: "lower_back", label: "Lower back" },
      { id: "hamstring", label: "Hamstring" },
      { id: "calf_achilles", label: "Calf / Achilles" },
      { id: "other", label: "Other" }
    ]
  },
  {
    id: "movement_limitations",
    section: "Injury History + Limitations",
    question: "Are there any movements you cannot perform comfortably?",
    type: "multi_choice",
    required: false,
    options: [
      { id: "squats", label: "Squats" },
      { id: "lunges", label: "Lunges" },
      { id: "deadlifts", label: "Deadlifts" },
      { id: "upper_body", label: "Upper body exercises" },
      { id: "planks_core", label: "Planks or core work" },
      { id: "none", label: "No limitations" }
    ]
  },
  
  // SECTION 5: Strength Goals
  {
    id: "strength_goal",
    section: "Strength Goals",
    question: "What's your main strength goal as a runner?",
    type: "single_choice",
    required: true,
    options: [
      { id: "reduce_injury", label: "Reduce injury risk" },
      { id: "running_economy", label: "Improve running economy" },
      { id: "build_strength", label: "Build overall strength" },
      { id: "power_speed", label: "Improve power and speed" },
      { id: "muscle_tone", label: "Improve muscle tone and aesthetics" },
      { id: "balance_stability", label: "Improve balance and stability" }
    ]
  },
  {
    id: "strength_importance",
    section: "Strength Goals",
    question: "How important is strength training to your running goals right now?",
    type: "single_choice",
    required: true,
    options: [
      { id: "essential", label: "Essential" },
      { id: "important", label: "Important" },
      { id: "helpful", label: "Helpful but not essential" },
      { id: "not_sure", label: "Not sure" }
    ]
  },
  
  // SECTION 6: Lifestyle, Fatigue & Stress
  {
    id: "recovery_quality",
    section: "Lifestyle, Fatigue & Stress",
    question: "How well do you generally recover between training sessions?",
    type: "single_choice",
    required: true,
    options: [
      { id: "very_well", label: "Very well" },
      { id: "okay", label: "Okay" },
      { id: "often_sore", label: "Often feel sore or fatigued" },
      { id: "constant_fatigue", label: "Constant fatigue" }
    ]
  },
  {
    id: "life_stress",
    section: "Lifestyle, Fatigue & Stress",
    question: "How much overall life stress are you currently experiencing?",
    type: "single_choice",
    required: true,
    options: [
      { id: "low", label: "Low" },
      { id: "moderate", label: "Moderate" },
      { id: "high", label: "High" },
      { id: "very_high", label: "Very high" }
    ]
  },
  
  // SECTION 7: Personal Preferences
  {
    id: "enjoy_strength",
    section: "Personal Preferences",
    question: "Do you enjoy strength training?",
    type: "single_choice",
    required: true,
    options: [
      { id: "love_it", label: "Love it" },
      { id: "ok", label: "It's ok" },
      { id: "if_helps", label: "I'll do it if it helps my running" },
      { id: "dont_like", label: "I don't like it" }
    ]
  },
  {
    id: "training_style",
    section: "Personal Preferences",
    question: "Which training style do you prefer?",
    type: "single_choice",
    required: true,
    options: [
      { id: "short_efficient", label: "Short + efficient" },
      { id: "longer_detailed", label: "Longer, more detailed sessions" },
      { id: "minimal_equipment", label: "Minimal equipment" },
      { id: "classic_gym", label: "Classic gym style" },
      { id: "no_preference", label: "No preference" }
    ]
  },
  {
    id: "mobility_work",
    section: "Personal Preferences",
    question: "Would you like optional mobility work included in your program?",
    type: "single_choice",
    required: true,
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "maybe", label: "Maybe" }
    ]
  },
  
  // SECTION 8: Optional Performance Add-Ons
  {
    id: "movement_screening",
    section: "Optional Performance Add-Ons",
    question: "Would you like to complete a short movement screening to maximise your results?",
    type: "single_choice",
    required: true,
    options: [
      { id: "yes", label: "Yes" },
      { id: "maybe_later", label: "Maybe later" },
      { id: "no", label: "No" }
    ]
  }
];

