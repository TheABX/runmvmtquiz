import type { QuizQuestion } from './runmvmtTypes';

export const NUTRITION_QUESTIONS: QuizQuestion[] = [
  // SECTION 1 — Baseline Profile
  {
    id: "biological_sex",
    section: "Baseline",
    question: "What is your biological sex?",
    type: "single_choice",
    required: true,
    options: [
      { id: "male", label: "Male" },
      { id: "female", label: "Female" },
      { id: "prefer_not_to_say", label: "Prefer not to say" }
    ]
  },
  {
    id: "age",
    section: "Baseline",
    question: "What is your age?",
    type: "number",
    required: true,
    placeholder: "e.g. 32"
  },
  {
    id: "weight_kg",
    section: "Baseline",
    question: "What is your current weight (kg)?",
    type: "number",
    required: true,
    placeholder: "e.g. 70"
  },
  {
    id: "height_cm",
    section: "Baseline",
    question: "What is your height (cm)?",
    type: "number",
    required: true,
    placeholder: "e.g. 175"
  },
  {
    id: "knows_body_fat",
    section: "Baseline",
    question: "Do you know your current body fat %?",
    type: "single_choice",
    required: true,
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" }
    ]
  },
  {
    id: "body_fat_percent",
    section: "Baseline",
    question: "What is your current body fat %?",
    type: "number",
    required: false,
    placeholder: "e.g. 15"
  },
  
  // SECTION 2 — Goals
  {
    id: "nutrition_goal",
    section: "Goals",
    question: "Which best describes your current focus?",
    type: "single_choice",
    required: true,
    options: [
      { id: "maintain", label: "Maintain weight + fuel performance" },
      { id: "lose_fat", label: "Improve body composition (lose fat)" },
      { id: "gain_muscle", label: "Build lean muscle" },
      { id: "performance", label: "Prioritise race performance over aesthetics" }
    ]
  },
  
  // SECTION 3 — Eating Style + Preferences
  {
    id: "dietary_preference",
    section: "Preferences",
    question: "Do you follow a specific diet?",
    type: "single_choice",
    required: true,
    options: [
      { id: "standard", label: "Standard / No restrictions" },
      { id: "vegetarian", label: "Vegetarian" },
      { id: "vegan", label: "Vegan" },
      { id: "pescatarian", label: "Pescatarian" },
      { id: "low_fodmap", label: "Low-FODMAP" },
      { id: "gluten_free", label: "Gluten-free" },
      { id: "dairy_free", label: "Dairy-free" },
      { id: "paleo", label: "Paleo-ish / whole food approach" }
    ]
  },
  {
    id: "allergies_intolerances",
    section: "Preferences",
    question: "Any allergies or intolerances? (optional)",
    type: "text",
    required: false,
    placeholder: "e.g. Nuts, shellfish, or leave blank"
  },
  {
    id: "disliked_foods",
    section: "Preferences",
    question: "Any foods you dislike and don't want included? (optional)",
    type: "text",
    required: false,
    placeholder: "e.g. Mushrooms, olives, or leave blank"
  },
  {
    id: "fueling_preference",
    section: "Preferences",
    question: "Do you prefer mostly:",
    type: "single_choice",
    required: true,
    options: [
      { id: "whole_food", label: "Whole food fueling" },
      { id: "mixed", label: "Mix of natural + running products" },
      { id: "sports_nutrition", label: "Running gels/sports nutrition OK" }
    ]
  },
  
  // SECTION 4 — Meal Structure & Behaviour
  {
    id: "training_time",
    section: "Lifestyle",
    question: "When do you typically train?",
    type: "single_choice",
    required: true,
    options: [
      { id: "morning", label: "Morning" },
      { id: "midday", label: "Midday" },
      { id: "afternoon", label: "Afternoon" },
      { id: "evening", label: "Evening" },
      { id: "mixed", label: "Mixed / varies" }
    ]
  },
  {
    id: "meals_per_day",
    section: "Lifestyle",
    question: "How many meals/snacks do you prefer per day?",
    type: "single_choice",
    required: true,
    options: [
      { id: "2", label: "2 big meals" },
      { id: "3", label: "3 standard" },
      { id: "4_5", label: "4–5 smaller meals/snacks" }
    ]
  },
  {
    id: "tracking_habits",
    section: "Lifestyle",
    question: "Do you currently track calories/macros?",
    type: "single_choice",
    required: true,
    options: [
      { id: "strictly", label: "Yes strictly" },
      { id: "loosely", label: "Yes loosely" },
      { id: "no", label: "No" }
    ]
  },
  {
    id: "alcohol_consumption",
    section: "Lifestyle",
    question: "Do you drink alcohol?",
    type: "single_choice",
    required: true,
    options: [
      { id: "no", label: "No" },
      { id: "occasionally", label: "Occasionally" },
      { id: "weekly", label: "Yes weekly" }
    ]
  },
  {
    id: "caffeine_tolerance",
    section: "Lifestyle",
    question: "Do you consume caffeine?",
    type: "single_choice",
    required: true,
    options: [
      { id: "high_tolerance", label: "Yes, high tolerance" },
      { id: "sensitive", label: "Yes, but sensitive" },
      { id: "no_caffeine", label: "No" }
    ]
  },
  
  // SECTION 5 — Hydration & Fueling Status
  {
    id: "current_fueling_products",
    section: "Fueling",
    question: "Do you regularly use:",
    type: "multi_choice",
    required: false,
    options: [
      { id: "electrolytes", label: "Electrolytes" },
      { id: "salt_tablets", label: "Salt tablets" },
      { id: "gels", label: "Gels during long runs" },
      { id: "carb_drinks", label: "Carb drinks" }
    ]
  }
];


