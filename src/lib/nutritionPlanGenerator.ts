// Nutrition Plan Generator
// Calculates BMR, TDEE, macros, and generates meal suggestions based on:
// - User's body metrics (age, weight, height, biological sex, body fat %)
// - Training load from 12-week plan
// - Nutrition goals and dietary preferences

export interface NutritionData {
  biological_sex: string | null;
  age: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  body_fat_percent: number | null;
  nutrition_goal: string | null;
  dietary_preference: string | null;
  allergies_intolerances: string | null;
  disliked_foods: string | null;
  fueling_preference: string | null;
  training_time: string | null;
  meals_per_day: string | null;
  tracking_habits: string | null;
  alcohol_consumption: string | null;
  caffeine_tolerance: string | null;
  current_fueling_products: string[] | null;
}

export interface TrainingLoadData {
  averageWeeklyKm: number;
  peakWeeklyKm: number;
  trainingDaysPerWeek: number;
}

export interface NutritionPlan {
  // Calorie targets
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  dailyCalories: number; // Target daily calories
  
  // Macro targets (grams per day)
  protein: number;
  carbs: number;
  fats: number;
  
  // Macro percentages
  proteinPercent: number;
  carbsPercent: number;
  fatsPercent: number;
  
  // Meal suggestions
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
  preWorkout: string[];
  postWorkout: string[];
  
  // Guidelines
  hydrationGuidelines: string[];
  fuelingGuidelines: string[];
  mealTimingGuidelines: string[];
}

/**
 * Calculate BMR using Mifflin-St Jeor Equation
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  biologicalSex: string
): number {
  // Convert height to meters
  const heightM = heightCm / 100;
  
  // Mifflin-St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  
  // Add gender-specific constant
  if (biologicalSex === "male") {
    bmr += 5;
  } else if (biologicalSex === "female") {
    bmr -= 161;
  } else {
    // Prefer not to say - use average
    bmr -= 78;
  }
  
  return Math.round(bmr);
}

/**
 * Calculate TDEE based on BMR and activity level
 */
export function calculateTDEE(
  bmr: number,
  trainingLoad: TrainingLoadData
): number {
  // Activity multipliers based on training load
  const avgKm = trainingLoad.averageWeeklyKm;
  const trainingDays = trainingLoad.trainingDaysPerWeek;
  
  let activityMultiplier = 1.2; // Sedentary baseline
  
  if (avgKm < 20) {
    activityMultiplier = trainingDays <= 3 ? 1.375 : 1.4; // Lightly active
  } else if (avgKm < 40) {
    activityMultiplier = trainingDays <= 4 ? 1.5 : 1.6; // Moderately active
  } else if (avgKm < 60) {
    activityMultiplier = trainingDays <= 5 ? 1.7 : 1.75; // Very active
  } else {
    activityMultiplier = 1.9; // Extremely active
  }
  
  return Math.round(bmr * activityMultiplier);
}

/**
 * Adjust calories based on nutrition goal
 */
export function adjustCaloriesForGoal(
  tdee: number,
  nutritionGoal: string,
  weightKg: number
): number {
  switch (nutritionGoal) {
    case "lose_fat":
      // Deficit of 300-500 calories
      return Math.max(tdee - 400, tdee * 0.85); // At least 15% deficit
    case "gain_muscle":
      // Surplus of 200-400 calories
      return tdee + 300;
    case "performance":
      // Slight surplus for performance
      return tdee + 100;
    case "maintain":
    default:
      return tdee;
  }
}

/**
 * Calculate macro targets
 */
export function calculateMacros(
  dailyCalories: number,
  nutritionGoal: string,
  weightKg: number
): { protein: number; carbs: number; fats: number; proteinPercent: number; carbsPercent: number; fatsPercent: number } {
  // Protein: 1.6-2.2g per kg bodyweight for athletes
  const proteinPerKg = nutritionGoal === "gain_muscle" ? 2.0 : 1.8;
  const protein = Math.round(weightKg * proteinPerKg);
  const proteinCalories = protein * 4;
  const proteinPercent = (proteinCalories / dailyCalories) * 100;
  
  // Fats: 20-30% of calories
  const fatsPercent = nutritionGoal === "lose_fat" ? 25 : 28;
  const fatsCalories = (dailyCalories * fatsPercent) / 100;
  const fats = Math.round(fatsCalories / 9);
  const actualFatsPercent = (fatsCalories / dailyCalories) * 100;
  
  // Carbs: Remaining calories
  const carbsCalories = dailyCalories - proteinCalories - fatsCalories;
  const carbs = Math.round(carbsCalories / 4);
  const carbsPercent = (carbsCalories / dailyCalories) * 100;
  
  return {
    protein,
    carbs,
    fats,
    proteinPercent: Math.round(proteinPercent * 10) / 10,
    carbsPercent: Math.round(carbsPercent * 10) / 10,
    fatsPercent: Math.round(actualFatsPercent * 10) / 10,
  };
}

/**
 * Generate meal suggestions based on preferences
 */
export function generateMealSuggestions(
  nutritionData: NutritionData,
  macros: { protein: number; carbs: number; fats: number }
): {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
  preWorkout: string[];
  postWorkout: string[];
} {
  const dietaryPref = nutritionData.dietary_preference || "standard";
  const fuelingPref = nutritionData.fueling_preference || "mixed";
  const trainingTime = nutritionData.training_time || "morning";
  
  // Base meal templates
  const standardMeals = {
    breakfast: [
      "Oatmeal with berries, banana, and Greek yogurt",
      "Scrambled eggs with whole grain toast and avocado",
      "Smoothie bowl with protein powder, granola, and fruit",
      "Greek yogurt parfait with granola and mixed berries",
    ],
    lunch: [
      "Grilled chicken salad with quinoa and mixed vegetables",
      "Salmon with sweet potato and steamed broccoli",
      "Turkey and vegetable wrap with hummus",
      "Lentil soup with whole grain bread",
    ],
    dinner: [
      "Grilled fish with brown rice and roasted vegetables",
      "Lean beef stir-fry with noodles and vegetables",
      "Chicken and vegetable curry with basmati rice",
      "Pasta with lean meat sauce and side salad",
    ],
    snacks: [
      "Apple with almond butter",
      "Greek yogurt with berries",
      "Trail mix (nuts, seeds, dried fruit)",
      "Protein smoothie",
    ],
  };
  
  // Adjust for dietary preferences
  let meals = { ...standardMeals };
  
  if (dietaryPref === "vegetarian") {
    meals.breakfast = meals.breakfast.map(m => m.replace(/chicken|turkey|beef|fish|salmon/g, "tofu/tempeh"));
    meals.lunch = [
      "Chickpea salad with quinoa and vegetables",
      "Tofu stir-fry with brown rice",
      "Lentil curry with vegetables",
      "Vegetable wrap with hummus",
    ];
    meals.dinner = [
      "Vegetarian curry with rice",
      "Stuffed bell peppers with quinoa",
      "Vegetable pasta with marinara",
      "Tofu and vegetable stir-fry",
    ];
  } else if (dietaryPref === "vegan") {
    meals.breakfast = [
      "Oatmeal with berries and plant-based milk",
      "Avocado toast on whole grain bread",
      "Smoothie bowl with plant protein and fruit",
      "Chia pudding with fruit and nuts",
    ];
    meals.lunch = [
      "Chickpea salad with quinoa",
      "Lentil soup with whole grain bread",
      "Vegetable wrap with hummus",
      "Buddha bowl with grains and vegetables",
    ];
    meals.dinner = [
      "Vegetable curry with rice",
      "Lentil pasta with marinara",
      "Stuffed bell peppers",
      "Tofu stir-fry with vegetables",
    ];
    meals.snacks = [
      "Apple with almond butter",
      "Trail mix",
      "Hummus with vegetables",
      "Plant-based protein smoothie",
    ];
  }
  
  // Pre-workout suggestions
  const preWorkout = trainingTime === "morning"
    ? ["Banana with a small coffee", "Toast with honey", "Small smoothie"]
    : ["Banana", "Energy bar", "Small portion of oats"];
  
  // Post-workout suggestions
  const postWorkout = fuelingPref === "whole_food"
    ? ["Greek yogurt with berries", "Chocolate milk", "Banana with nut butter"]
    : ["Protein shake", "Recovery drink", "Greek yogurt with granola"];
  
  return {
    breakfast: meals.breakfast,
    lunch: meals.lunch,
    dinner: meals.dinner,
    snacks: meals.snacks,
    preWorkout,
    postWorkout,
  };
}

/**
 * Generate hydration and fueling guidelines
 */
export function generateGuidelines(
  nutritionData: NutritionData,
  trainingLoad: TrainingLoadData
): {
  hydrationGuidelines: string[];
  fuelingGuidelines: string[];
  mealTimingGuidelines: string[];
} {
  const trainingTime = nutritionData.training_time || "morning";
  const avgKm = trainingLoad.averageWeeklyKm;
  
  const hydrationGuidelines = [
    "Aim for 35-40ml per kg bodyweight daily (e.g., 70kg = 2.5-2.8L)",
    "Drink 500ml water 2-3 hours before training",
    "During runs >60 minutes, aim for 150-250ml every 15-20 minutes",
    "Post-run: replace 150% of fluid lost (weigh before/after to estimate)",
  ];
  
  const fuelingGuidelines = avgKm > 40
    ? [
        "For long runs >90 minutes, consume 30-60g carbs per hour",
        "Practice your race-day fueling strategy in training",
        "Aim for 1-1.2g carbs per kg bodyweight per hour during long runs",
      ]
    : [
        "For runs >75 minutes, consider 30-45g carbs per hour",
        "Most runs under 60 minutes don't require mid-run fueling",
        "Focus on pre and post-run nutrition for recovery",
      ];
  
  const mealTimingGuidelines = trainingTime === "morning"
    ? [
        "Eat a light breakfast 1-2 hours before morning training",
        "Have a substantial post-workout meal within 30-60 minutes",
        "Space meals evenly throughout the day",
      ]
    : trainingTime === "evening"
    ? [
        "Have a substantial lunch 3-4 hours before evening training",
        "Eat a light snack 1 hour before if needed",
        "Post-workout dinner should include protein and carbs",
      ]
    : [
        "Time meals around your training schedule",
        "Pre-workout: light meal 2-3 hours before, or snack 1 hour before",
        "Post-workout: meal within 30-60 minutes",
      ];
  
  return {
    hydrationGuidelines,
    fuelingGuidelines,
    mealTimingGuidelines,
  };
}

/**
 * Main function to generate complete nutrition plan
 */
export function generateNutritionPlan(
  nutritionData: NutritionData,
  trainingLoad: TrainingLoadData
): NutritionPlan {
  // Validate required data
  if (!nutritionData.weight_kg || !nutritionData.height_cm || !nutritionData.age || !nutritionData.biological_sex) {
    throw new Error("Missing required nutrition data: weight, height, age, or biological sex");
  }
  
  // Calculate BMR
  const bmr = calculateBMR(
    nutritionData.weight_kg,
    nutritionData.height_cm,
    nutritionData.age,
    nutritionData.biological_sex
  );
  
  // Calculate TDEE
  const tdee = calculateTDEE(bmr, trainingLoad);
  
  // Adjust for goal
  const dailyCalories = adjustCaloriesForGoal(
    tdee,
    nutritionData.nutrition_goal || "maintain",
    nutritionData.weight_kg
  );
  
  // Calculate macros
  const macros = calculateMacros(
    dailyCalories,
    nutritionData.nutrition_goal || "maintain",
    nutritionData.weight_kg
  );
  
  // Generate meal suggestions
  const meals = generateMealSuggestions(nutritionData, macros);
  
  // Generate guidelines
  const guidelines = generateGuidelines(nutritionData, trainingLoad);
  
  return {
    bmr,
    tdee,
    dailyCalories,
    ...macros,
    ...meals,
    ...guidelines,
  };
}


