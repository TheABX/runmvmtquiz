import type { QuizAnswers } from '../runmvmtTypes';

// Compatibility: Map old tier names to new ones
export type AbilityTier = "beginner" | "lower_intermediate" | "upper_intermediate" | "advanced" | "competitive" | "elite";

// Legacy compatibility - map old "intermediate" to new system
export type LegacyAbilityTier = "beginner" | "intermediate" | "advanced" | "competitive" | "elite";

export function mapLegacyTier(legacyTier: LegacyAbilityTier): AbilityTier {
  if (legacyTier === "intermediate") {
    return "lower_intermediate"; // Default to lower, can be refined based on context
  }
  return legacyTier as AbilityTier;
}

export interface AbilityTierConfig {
  id: AbilityTier;
  label: string;
  weeklyKmRange: [number, number];
  longestRunRange: [number, number];
  maxQualitySessionsPerWeek: number;
  typicalDaysPerWeek: number[];
  description: string;
}

export const ABILITY_TIERS: Record<AbilityTier, AbilityTierConfig> = {
  beginner: {
    id: "beginner",
    label: "Beginner",
    weeklyKmRange: [0, 25],
    longestRunRange: [5, 10],
    maxQualitySessionsPerWeek: 1,
    typicalDaysPerWeek: [3, 4],
    description: "New to running or very low base. Focus on consistency and gradual progression."
  },
  lower_intermediate: {
    id: "lower_intermediate",
    label: "Lower Intermediate",
    weeklyKmRange: [25, 40],
    longestRunRange: [10, 15],
    maxQualitySessionsPerWeek: 1,
    typicalDaysPerWeek: [3, 4, 5],
    description: "Some running experience. Can handle regular training with gradual increases."
  },
  upper_intermediate: {
    id: "upper_intermediate",
    label: "Upper Intermediate",
    weeklyKmRange: [40, 60],
    longestRunRange: [15, 25],
    maxQualitySessionsPerWeek: 2,
    typicalDaysPerWeek: [4, 5, 6],
    description: "Regular runner with solid base. Ready for structured training and quality sessions."
  },
  advanced: {
    id: "advanced",
    label: "Advanced",
    weeklyKmRange: [60, 90],
    longestRunRange: [25, 35],
    maxQualitySessionsPerWeek: 2,
    typicalDaysPerWeek: [5, 6],
    description: "Experienced runner with high training volume. Can handle demanding sessions."
  },
  competitive: {
    id: "competitive",
    label: "Competitive",
    weeklyKmRange: [90, 120],
    longestRunRange: [30, 40],
    maxQualitySessionsPerWeek: 2,
    typicalDaysPerWeek: [6, 7],
    description: "High-volume runner chasing performance. Structured training with multiple quality sessions."
  },
  elite: {
    id: "elite",
    label: "Elite",
    weeklyKmRange: [120, 200],
    longestRunRange: [35, 50],
    maxQualitySessionsPerWeek: 3,
    typicalDaysPerWeek: [6, 7],
    description: "Elite-level volume and training. Multiple quality sessions and high weekly mileage."
  }
};

function estimateCurrentKmFromBucket(bucket: string): number {
  switch (bucket) {
    case "<10": return 8;
    case "10_30": return 20;
    case "30_50": return 40;
    case "50_80": return 60;
    case "80_120": return 90;
    case "120_plus": return 130;
    default: return 20;
  }
}

function estimateLongestRunFromBucket(bucket: string): number {
  switch (bucket) {
    case "<5": return 4;
    case "5_10": return 7;
    case "10_21": return 15;
    case "21_30": return 25;
    case "30_50": return 40;
    case "50_plus": return 50;
    default: return 7;
  }
}

export function classifyAbilityTier(
  answers: QuizAnswers,
  personaId: string
): AbilityTier {
  const currentKmBucket = answers["current_weekly_km"] as string;
  const longestRunBucket = answers["longest_run"] as string;
  const currentRunsPerWeek = answers["current_runs_per_week"] as string;
  const injuryStatus = answers["injury_status"] as string;
  
  const currentKm = estimateCurrentKmFromBucket(currentKmBucket);
  const longestRun = estimateLongestRunFromBucket(longestRunBucket);
  
  // Injury overrides - cap tier even if volume is high
  if (injuryStatus === "current" || injuryStatus === "recurring") {
    if (currentKm >= 80) return "advanced";
    if (currentKm >= 50) return "upper_intermediate";
    if (currentKm >= 25) return "lower_intermediate";
    return "beginner";
  }
  
  // Time-poor persona caps at upper_intermediate
  if (personaId === "time_poor_3_day") {
    if (currentKm >= 50) return "upper_intermediate";
    if (currentKm >= 30) return "lower_intermediate";
    return "beginner";
  }
  
  // Primary classification based on weekly km and longest run
  if (currentKm < 25 || longestRun < 10) {
    return "beginner";
  }
  
  if (currentKm < 40 || longestRun < 15) {
    return "lower_intermediate";
  }
  
  if (currentKm < 60 || longestRun < 25) {
    // Check frequency - if running 5-6+ times per week, might be upper intermediate
    if (currentRunsPerWeek === "5_6" || currentRunsPerWeek === "7_plus") {
      return "upper_intermediate";
    }
    return "lower_intermediate";
  }
  
  if (currentKm < 90 || longestRun < 30) {
    return "upper_intermediate";
  }
  
  if (currentKm < 120 || longestRun < 35) {
    return "advanced";
  }
  
  if (currentKm < 150) {
    return "competitive";
  }
  
  return "elite";
}

