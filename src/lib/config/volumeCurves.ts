// Forward declare types to avoid circular dependency
export type Distance = "5k" | "10k" | "half_marathon" | "marathon" | "50k" | "80k" | "100k_plus";
export type GoalIntent = "complete" | "comfortable" | "pb" | "race" | "unsure";
import type { AbilityTier } from './abilityTiers';
import type { RunnerPersona } from '../runmvmtTypes';

export interface VolumeConfig {
  startKm: number;
  peakKm: number;
  longRunPeakKm: number;
}

export interface VolumeCurveConfig {
  distance: Distance;
  goalIntent: GoalIntent;
  abilityTier: AbilityTier;
  startKm: number;
  peakKm: number;
  longRunPeakKm: number;
}

// Base volume configurations by distance, goal, and ability tier
const BASE_VOLUME_CONFIGS: Record<Distance, Record<GoalIntent, Record<AbilityTier, { startMin: number; startMax: number; peakMin: number; peakMax: number; longRunPeakMin: number; longRunPeakMax: number }>>> = {
  "5k": {
    complete: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35, longRunPeakMin: 8, longRunPeakMax: 10 },
      lower_intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50, longRunPeakMin: 10, longRunPeakMax: 12 },
      upper_intermediate: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70, longRunPeakMin: 12, longRunPeakMax: 16 },
      advanced: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90, longRunPeakMin: 12, longRunPeakMax: 16 },
      competitive: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120, longRunPeakMin: 18, longRunPeakMax: 20 },
      elite: { startMin: 80, startMax: 120, peakMin: 100, peakMax: 150, longRunPeakMin: 20, longRunPeakMax: 25 }
    },
    comfortable: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35, longRunPeakMin: 8, longRunPeakMax: 10 },
      lower_intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50, longRunPeakMin: 10, longRunPeakMax: 12 },
      upper_intermediate: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70, longRunPeakMin: 12, longRunPeakMax: 16 },
      advanced: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90, longRunPeakMin: 12, longRunPeakMax: 16 },
      competitive: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120, longRunPeakMin: 18, longRunPeakMax: 20 },
      elite: { startMin: 80, startMax: 120, peakMin: 100, peakMax: 150, longRunPeakMin: 20, longRunPeakMax: 25 }
    },
    pb: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35, longRunPeakMin: 8, longRunPeakMax: 10 },
      lower_intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50, longRunPeakMin: 10, longRunPeakMax: 12 },
      upper_intermediate: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70, longRunPeakMin: 12, longRunPeakMax: 16 },
      advanced: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90, longRunPeakMin: 12, longRunPeakMax: 16 },
      competitive: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120, longRunPeakMin: 18, longRunPeakMax: 20 },
      elite: { startMin: 80, startMax: 120, peakMin: 100, peakMax: 150, longRunPeakMin: 20, longRunPeakMax: 25 }
    },
    race: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35, longRunPeakMin: 8, longRunPeakMax: 10 },
      lower_intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50, longRunPeakMin: 10, longRunPeakMax: 12 },
      upper_intermediate: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70, longRunPeakMin: 12, longRunPeakMax: 16 },
      advanced: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90, longRunPeakMin: 12, longRunPeakMax: 16 },
      competitive: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120, longRunPeakMin: 18, longRunPeakMax: 20 },
      elite: { startMin: 80, startMax: 120, peakMin: 100, peakMax: 150, longRunPeakMin: 20, longRunPeakMax: 25 }
    },
    unsure: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35, longRunPeakMin: 8, longRunPeakMax: 10 },
      lower_intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50, longRunPeakMin: 10, longRunPeakMax: 12 },
      upper_intermediate: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70, longRunPeakMin: 12, longRunPeakMax: 16 },
      advanced: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90, longRunPeakMin: 12, longRunPeakMax: 16 },
      competitive: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120, longRunPeakMin: 18, longRunPeakMax: 20 },
      elite: { startMin: 80, startMax: 120, peakMin: 100, peakMax: 150, longRunPeakMin: 20, longRunPeakMax: 25 }
    }
  },
  "10k": {
    complete: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40, longRunPeakMin: 12, longRunPeakMax: 14 },
      lower_intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55, longRunPeakMin: 14, longRunPeakMax: 18 },
      upper_intermediate: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75, longRunPeakMin: 16, longRunPeakMax: 22 },
      advanced: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110, longRunPeakMin: 16, longRunPeakMax: 22 },
      competitive: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140, longRunPeakMin: 22, longRunPeakMax: 26 },
      elite: { startMin: 90, startMax: 130, peakMin: 120, peakMax: 160, longRunPeakMin: 24, longRunPeakMax: 30 }
    },
    comfortable: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40, longRunPeakMin: 12, longRunPeakMax: 14 },
      lower_intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55, longRunPeakMin: 14, longRunPeakMax: 18 },
      upper_intermediate: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75, longRunPeakMin: 16, longRunPeakMax: 22 },
      advanced: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110, longRunPeakMin: 16, longRunPeakMax: 22 },
      competitive: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140, longRunPeakMin: 22, longRunPeakMax: 26 },
      elite: { startMin: 90, startMax: 130, peakMin: 120, peakMax: 160, longRunPeakMin: 24, longRunPeakMax: 30 }
    },
    pb: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40, longRunPeakMin: 12, longRunPeakMax: 14 },
      lower_intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55, longRunPeakMin: 14, longRunPeakMax: 18 },
      upper_intermediate: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75, longRunPeakMin: 16, longRunPeakMax: 22 },
      advanced: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110, longRunPeakMin: 16, longRunPeakMax: 22 },
      competitive: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140, longRunPeakMin: 22, longRunPeakMax: 26 },
      elite: { startMin: 90, startMax: 130, peakMin: 120, peakMax: 160, longRunPeakMin: 24, longRunPeakMax: 30 }
    },
    race: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40, longRunPeakMin: 12, longRunPeakMax: 14 },
      lower_intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55, longRunPeakMin: 14, longRunPeakMax: 18 },
      upper_intermediate: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75, longRunPeakMin: 16, longRunPeakMax: 22 },
      advanced: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110, longRunPeakMin: 16, longRunPeakMax: 22 },
      competitive: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140, longRunPeakMin: 22, longRunPeakMax: 26 },
      elite: { startMin: 90, startMax: 130, peakMin: 120, peakMax: 160, longRunPeakMin: 24, longRunPeakMax: 30 }
    },
    unsure: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40, longRunPeakMin: 12, longRunPeakMax: 14 },
      lower_intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55, longRunPeakMin: 14, longRunPeakMax: 18 },
      upper_intermediate: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75, longRunPeakMin: 16, longRunPeakMax: 22 },
      advanced: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110, longRunPeakMin: 16, longRunPeakMax: 22 },
      competitive: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140, longRunPeakMin: 22, longRunPeakMax: 26 },
      elite: { startMin: 90, startMax: 130, peakMin: 120, peakMax: 160, longRunPeakMin: 24, longRunPeakMax: 30 }
    }
  },
  "half_marathon": {
    complete: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50, longRunPeakMin: 16, longRunPeakMax: 18 },
      lower_intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65, longRunPeakMin: 18, longRunPeakMax: 21 },
      upper_intermediate: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85, longRunPeakMin: 21, longRunPeakMax: 24 },
      advanced: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100, longRunPeakMin: 22, longRunPeakMax: 26 },
      competitive: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140, longRunPeakMin: 24, longRunPeakMax: 28 },
      elite: { startMin: 90, startMax: 130, peakMin: 120, peakMax: 160, longRunPeakMin: 26, longRunPeakMax: 32 }
    },
    comfortable: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50, longRunPeakMin: 16, longRunPeakMax: 18 },
      lower_intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65, longRunPeakMin: 18, longRunPeakMax: 21 },
      upper_intermediate: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85, longRunPeakMin: 21, longRunPeakMax: 24 },
      advanced: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100, longRunPeakMin: 22, longRunPeakMax: 26 },
      competitive: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140, longRunPeakMin: 24, longRunPeakMax: 28 },
      elite: { startMin: 90, startMax: 130, peakMin: 120, peakMax: 160, longRunPeakMin: 26, longRunPeakMax: 32 }
    },
    pb: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50, longRunPeakMin: 16, longRunPeakMax: 18 },
      lower_intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65, longRunPeakMin: 18, longRunPeakMax: 21 },
      upper_intermediate: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85, longRunPeakMin: 21, longRunPeakMax: 24 },
      advanced: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100, longRunPeakMin: 22, longRunPeakMax: 26 },
      competitive: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140, longRunPeakMin: 24, longRunPeakMax: 28 },
      elite: { startMin: 90, startMax: 130, peakMin: 120, peakMax: 160, longRunPeakMin: 26, longRunPeakMax: 32 }
    },
    race: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50, longRunPeakMin: 16, longRunPeakMax: 18 },
      lower_intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65, longRunPeakMin: 18, longRunPeakMax: 21 },
      upper_intermediate: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85, longRunPeakMin: 21, longRunPeakMax: 24 },
      advanced: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100, longRunPeakMin: 22, longRunPeakMax: 26 },
      competitive: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140, longRunPeakMin: 24, longRunPeakMax: 28 },
      elite: { startMin: 90, startMax: 130, peakMin: 120, peakMax: 160, longRunPeakMin: 26, longRunPeakMax: 32 }
    },
    unsure: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50, longRunPeakMin: 16, longRunPeakMax: 18 },
      lower_intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65, longRunPeakMin: 18, longRunPeakMax: 21 },
      upper_intermediate: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85, longRunPeakMin: 21, longRunPeakMax: 24 },
      advanced: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100, longRunPeakMin: 22, longRunPeakMax: 26 },
      competitive: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140, longRunPeakMin: 24, longRunPeakMax: 28 },
      elite: { startMin: 90, startMax: 130, peakMin: 120, peakMax: 160, longRunPeakMin: 26, longRunPeakMax: 32 }
    }
  },
  "marathon": {
    complete: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60, longRunPeakMin: 28, longRunPeakMax: 32 },
      lower_intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80, longRunPeakMin: 30, longRunPeakMax: 34 },
      upper_intermediate: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105, longRunPeakMin: 32, longRunPeakMax: 36 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130, longRunPeakMin: 34, longRunPeakMax: 38 },
      competitive: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150, longRunPeakMin: 36, longRunPeakMax: 40 },
      elite: { startMin: 110, startMax: 150, peakMin: 140, peakMax: 180, longRunPeakMin: 38, longRunPeakMax: 42 }
    },
    comfortable: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60, longRunPeakMin: 28, longRunPeakMax: 32 },
      lower_intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80, longRunPeakMin: 30, longRunPeakMax: 34 },
      upper_intermediate: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105, longRunPeakMin: 32, longRunPeakMax: 36 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130, longRunPeakMin: 34, longRunPeakMax: 38 },
      competitive: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150, longRunPeakMin: 36, longRunPeakMax: 40 },
      elite: { startMin: 110, startMax: 150, peakMin: 140, peakMax: 180, longRunPeakMin: 38, longRunPeakMax: 42 }
    },
    pb: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60, longRunPeakMin: 28, longRunPeakMax: 32 },
      lower_intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80, longRunPeakMin: 30, longRunPeakMax: 34 },
      upper_intermediate: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105, longRunPeakMin: 32, longRunPeakMax: 36 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130, longRunPeakMin: 34, longRunPeakMax: 38 },
      competitive: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150, longRunPeakMin: 36, longRunPeakMax: 40 },
      elite: { startMin: 110, startMax: 150, peakMin: 140, peakMax: 180, longRunPeakMin: 38, longRunPeakMax: 42 }
    },
    race: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60, longRunPeakMin: 28, longRunPeakMax: 32 },
      lower_intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80, longRunPeakMin: 30, longRunPeakMax: 34 },
      upper_intermediate: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105, longRunPeakMin: 32, longRunPeakMax: 36 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130, longRunPeakMin: 34, longRunPeakMax: 38 },
      competitive: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150, longRunPeakMin: 36, longRunPeakMax: 40 },
      elite: { startMin: 110, startMax: 150, peakMin: 140, peakMax: 180, longRunPeakMin: 38, longRunPeakMax: 42 }
    },
    unsure: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60, longRunPeakMin: 28, longRunPeakMax: 32 },
      lower_intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80, longRunPeakMin: 30, longRunPeakMax: 34 },
      upper_intermediate: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105, longRunPeakMin: 32, longRunPeakMax: 36 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130, longRunPeakMin: 34, longRunPeakMax: 38 },
      competitive: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150, longRunPeakMin: 36, longRunPeakMax: 40 },
      elite: { startMin: 110, startMax: 150, peakMin: 140, peakMax: 180, longRunPeakMin: 38, longRunPeakMax: 42 }
    }
  },
  "50k": {
    complete: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70, longRunPeakMin: 24, longRunPeakMax: 32 },
      lower_intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90, longRunPeakMin: 28, longRunPeakMax: 36 },
      upper_intermediate: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110, longRunPeakMin: 32, longRunPeakMax: 40 },
      advanced: { startMin: 75, startMax: 95, peakMin: 100, peakMax: 130, longRunPeakMin: 36, longRunPeakMax: 44 },
      competitive: { startMin: 90, startMax: 110, peakMin: 120, peakMax: 150, longRunPeakMin: 40, longRunPeakMax: 48 },
      elite: { startMin: 110, startMax: 140, peakMin: 140, peakMax: 180, longRunPeakMin: 44, longRunPeakMax: 52 }
    },
    comfortable: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70, longRunPeakMin: 24, longRunPeakMax: 32 },
      lower_intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90, longRunPeakMin: 28, longRunPeakMax: 36 },
      upper_intermediate: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110, longRunPeakMin: 32, longRunPeakMax: 40 },
      advanced: { startMin: 75, startMax: 95, peakMin: 100, peakMax: 130, longRunPeakMin: 36, longRunPeakMax: 44 },
      competitive: { startMin: 90, startMax: 110, peakMin: 120, peakMax: 150, longRunPeakMin: 40, longRunPeakMax: 48 },
      elite: { startMin: 110, startMax: 140, peakMin: 140, peakMax: 180, longRunPeakMin: 44, longRunPeakMax: 52 }
    },
    pb: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70, longRunPeakMin: 24, longRunPeakMax: 32 },
      lower_intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90, longRunPeakMin: 28, longRunPeakMax: 36 },
      upper_intermediate: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110, longRunPeakMin: 32, longRunPeakMax: 40 },
      advanced: { startMin: 75, startMax: 95, peakMin: 100, peakMax: 130, longRunPeakMin: 36, longRunPeakMax: 44 },
      competitive: { startMin: 90, startMax: 110, peakMin: 120, peakMax: 150, longRunPeakMin: 40, longRunPeakMax: 48 },
      elite: { startMin: 110, startMax: 140, peakMin: 140, peakMax: 180, longRunPeakMin: 44, longRunPeakMax: 52 }
    },
    race: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70, longRunPeakMin: 24, longRunPeakMax: 32 },
      lower_intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90, longRunPeakMin: 28, longRunPeakMax: 36 },
      upper_intermediate: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110, longRunPeakMin: 32, longRunPeakMax: 40 },
      advanced: { startMin: 75, startMax: 95, peakMin: 100, peakMax: 130, longRunPeakMin: 36, longRunPeakMax: 44 },
      competitive: { startMin: 90, startMax: 110, peakMin: 120, peakMax: 150, longRunPeakMin: 40, longRunPeakMax: 48 },
      elite: { startMin: 110, startMax: 140, peakMin: 140, peakMax: 180, longRunPeakMin: 44, longRunPeakMax: 52 }
    },
    unsure: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70, longRunPeakMin: 24, longRunPeakMax: 32 },
      lower_intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90, longRunPeakMin: 28, longRunPeakMax: 36 },
      upper_intermediate: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110, longRunPeakMin: 32, longRunPeakMax: 40 },
      advanced: { startMin: 75, startMax: 95, peakMin: 100, peakMax: 130, longRunPeakMin: 36, longRunPeakMax: 44 },
      competitive: { startMin: 90, startMax: 110, peakMin: 120, peakMax: 150, longRunPeakMin: 40, longRunPeakMax: 48 },
      elite: { startMin: 110, startMax: 140, peakMin: 140, peakMax: 180, longRunPeakMin: 44, longRunPeakMax: 52 }
    }
  },
  "80k": {
    complete: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90, longRunPeakMin: 32, longRunPeakMax: 40 },
      lower_intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110, longRunPeakMin: 36, longRunPeakMax: 45 },
      upper_intermediate: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130, longRunPeakMin: 40, longRunPeakMax: 52 },
      advanced: { startMin: 85, startMax: 110, peakMin: 120, peakMax: 150, longRunPeakMin: 45, longRunPeakMax: 55 },
      competitive: { startMin: 100, startMax: 130, peakMin: 140, peakMax: 170, longRunPeakMin: 50, longRunPeakMax: 60 },
      elite: { startMin: 120, startMax: 150, peakMin: 160, peakMax: 200, longRunPeakMin: 55, longRunPeakMax: 65 }
    },
    comfortable: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90, longRunPeakMin: 32, longRunPeakMax: 40 },
      lower_intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110, longRunPeakMin: 36, longRunPeakMax: 45 },
      upper_intermediate: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130, longRunPeakMin: 40, longRunPeakMax: 52 },
      advanced: { startMin: 85, startMax: 110, peakMin: 120, peakMax: 150, longRunPeakMin: 45, longRunPeakMax: 55 },
      competitive: { startMin: 100, startMax: 130, peakMin: 140, peakMax: 170, longRunPeakMin: 50, longRunPeakMax: 60 },
      elite: { startMin: 120, startMax: 150, peakMin: 160, peakMax: 200, longRunPeakMin: 55, longRunPeakMax: 65 }
    },
    pb: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90, longRunPeakMin: 32, longRunPeakMax: 40 },
      lower_intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110, longRunPeakMin: 36, longRunPeakMax: 45 },
      upper_intermediate: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130, longRunPeakMin: 40, longRunPeakMax: 52 },
      advanced: { startMin: 85, startMax: 110, peakMin: 120, peakMax: 150, longRunPeakMin: 45, longRunPeakMax: 55 },
      competitive: { startMin: 100, startMax: 130, peakMin: 140, peakMax: 170, longRunPeakMin: 50, longRunPeakMax: 60 },
      elite: { startMin: 120, startMax: 150, peakMin: 160, peakMax: 200, longRunPeakMin: 55, longRunPeakMax: 65 }
    },
    race: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90, longRunPeakMin: 32, longRunPeakMax: 40 },
      lower_intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110, longRunPeakMin: 36, longRunPeakMax: 45 },
      upper_intermediate: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130, longRunPeakMin: 40, longRunPeakMax: 52 },
      advanced: { startMin: 85, startMax: 110, peakMin: 120, peakMax: 150, longRunPeakMin: 45, longRunPeakMax: 55 },
      competitive: { startMin: 100, startMax: 130, peakMin: 140, peakMax: 170, longRunPeakMin: 50, longRunPeakMax: 60 },
      elite: { startMin: 120, startMax: 150, peakMin: 160, peakMax: 200, longRunPeakMin: 55, longRunPeakMax: 65 }
    },
    unsure: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90, longRunPeakMin: 32, longRunPeakMax: 40 },
      lower_intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110, longRunPeakMin: 36, longRunPeakMax: 45 },
      upper_intermediate: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130, longRunPeakMin: 40, longRunPeakMax: 52 },
      advanced: { startMin: 85, startMax: 110, peakMin: 120, peakMax: 150, longRunPeakMin: 45, longRunPeakMax: 55 },
      competitive: { startMin: 100, startMax: 130, peakMin: 140, peakMax: 170, longRunPeakMin: 50, longRunPeakMax: 60 },
      elite: { startMin: 120, startMax: 150, peakMin: 160, peakMax: 200, longRunPeakMin: 55, longRunPeakMax: 65 }
    }
  },
  "100k_plus": {
    complete: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100, longRunPeakMin: 36, longRunPeakMax: 45 },
      lower_intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120, longRunPeakMin: 40, longRunPeakMax: 52 },
      upper_intermediate: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140, longRunPeakMin: 45, longRunPeakMax: 60 },
      advanced: { startMin: 90, startMax: 120, peakMin: 130, peakMax: 160, longRunPeakMin: 50, longRunPeakMax: 60 },
      competitive: { startMin: 110, startMax: 140, peakMin: 150, peakMax: 180, longRunPeakMin: 55, longRunPeakMax: 65 },
      elite: { startMin: 130, startMax: 170, peakMin: 170, peakMax: 220, longRunPeakMin: 60, longRunPeakMax: 70 }
    },
    comfortable: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100, longRunPeakMin: 36, longRunPeakMax: 45 },
      lower_intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120, longRunPeakMin: 40, longRunPeakMax: 52 },
      upper_intermediate: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140, longRunPeakMin: 45, longRunPeakMax: 60 },
      advanced: { startMin: 90, startMax: 120, peakMin: 130, peakMax: 160, longRunPeakMin: 50, longRunPeakMax: 60 },
      competitive: { startMin: 110, startMax: 140, peakMin: 150, peakMax: 180, longRunPeakMin: 55, longRunPeakMax: 65 },
      elite: { startMin: 130, startMax: 170, peakMin: 170, peakMax: 220, longRunPeakMin: 60, longRunPeakMax: 70 }
    },
    pb: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100, longRunPeakMin: 36, longRunPeakMax: 45 },
      lower_intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120, longRunPeakMin: 40, longRunPeakMax: 52 },
      upper_intermediate: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140, longRunPeakMin: 45, longRunPeakMax: 60 },
      advanced: { startMin: 90, startMax: 120, peakMin: 130, peakMax: 160, longRunPeakMin: 50, longRunPeakMax: 60 },
      competitive: { startMin: 110, startMax: 140, peakMin: 150, peakMax: 180, longRunPeakMin: 55, longRunPeakMax: 65 },
      elite: { startMin: 130, startMax: 170, peakMin: 170, peakMax: 220, longRunPeakMin: 60, longRunPeakMax: 70 }
    },
    race: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100, longRunPeakMin: 36, longRunPeakMax: 45 },
      lower_intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120, longRunPeakMin: 40, longRunPeakMax: 52 },
      upper_intermediate: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140, longRunPeakMin: 45, longRunPeakMax: 60 },
      advanced: { startMin: 90, startMax: 120, peakMin: 130, peakMax: 160, longRunPeakMin: 50, longRunPeakMax: 60 },
      competitive: { startMin: 110, startMax: 140, peakMin: 150, peakMax: 180, longRunPeakMin: 55, longRunPeakMax: 65 },
      elite: { startMin: 130, startMax: 170, peakMin: 170, peakMax: 220, longRunPeakMin: 60, longRunPeakMax: 70 }
    },
    unsure: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100, longRunPeakMin: 36, longRunPeakMax: 45 },
      lower_intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120, longRunPeakMin: 40, longRunPeakMax: 52 },
      upper_intermediate: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140, longRunPeakMin: 45, longRunPeakMax: 60 },
      advanced: { startMin: 90, startMax: 120, peakMin: 130, peakMax: 160, longRunPeakMin: 50, longRunPeakMax: 60 },
      competitive: { startMin: 110, startMax: 140, peakMin: 150, peakMax: 180, longRunPeakMin: 55, longRunPeakMax: 65 },
      elite: { startMin: 130, startMax: 170, peakMin: 170, peakMax: 220, longRunPeakMin: 60, longRunPeakMax: 70 }
    }
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

export function getVolumeConfig(
  distance: Distance,
  goalIntent: GoalIntent,
  abilityTier: AbilityTier,
  currentKmBucket: string,
  personaId: string
): VolumeConfig {
  const config = BASE_VOLUME_CONFIGS[distance][goalIntent][abilityTier];
  const currentKm = estimateCurrentKmFromBucket(currentKmBucket);
  
  // Determine start km based on current fitness and persona
  let startKm: number;
  
  if (personaId === "beginner_low_mileage" || personaId === "returning_from_injury") {
    // Start at current or minimum, but don't jump more than 20%
    startKm = Math.max(currentKm, config.startMin);
    const maxStart = currentKm * 1.20;
    startKm = Math.min(startKm, maxStart);
    startKm = Math.max(startKm, config.startMin);
    startKm = Math.min(startKm, config.startMax);
  } else if (personaId === "time_poor_3_day") {
    // Time-poor: start conservatively
    startKm = Math.max(config.startMin, Math.min(currentKm, config.startMax));
  } else if (personaId === "intermediate_builder") {
    // Intermediate: start at current or slightly above
    startKm = Math.max(config.startMin, Math.min(currentKm * 1.10, config.startMax));
  } else {
    // Advanced/elite: can start higher
    startKm = Math.max(config.startMin, Math.min(currentKm * 1.15, config.startMax));
  }
  
  // Determine peak km based on ability tier and goal
  let peakKm: number;
  const peakRange = config.peakMax - config.peakMin;
  
  if (personaId === "beginner_low_mileage" || personaId === "returning_from_injury") {
    peakKm = config.peakMin + peakRange * 0.25; // Lower end
  } else if (personaId === "intermediate_builder") {
    peakKm = config.peakMin + peakRange * 0.50; // Midpoint
  } else if (personaId === "time_poor_3_day") {
    peakKm = config.peakMin + peakRange * 0.40; // Slightly lower
  } else {
    peakKm = config.peakMin + peakRange * 0.75; // Higher end
    if (abilityTier === "elite") {
      // Elite can push closer to max, but respect current base
      peakKm = Math.min(config.peakMax, Math.max(peakKm, currentKm * 1.20));
    }
  }
  
  // Long run peak
  const longRunRange = config.longRunPeakMax - config.longRunPeakMin;
  const longRunPeakKm = config.longRunPeakMin + longRunRange * 0.60; // Slightly conservative
  
  // Hard cap for marathon/ultra
  if ((distance === "marathon" || distance === "50k" || distance === "80k" || distance === "100k_plus") && peakKm > 150) {
    peakKm = 150;
  }
  
  return {
    startKm: Math.round(startKm),
    peakKm: Math.round(peakKm),
    longRunPeakKm: Math.round(longRunPeakKm)
  };
}

export function buildBaseVolumeCurve(
  startKm: number,
  peakKm: number,
  weekNumber: number,
  phase: "foundation" | "build" | "peak" | "taper",
  injuryStatus?: string
): number {
  const isRecurringInjury = injuryStatus === "recurring";
  const isCurrentInjury = injuryStatus === "current";
  
  // Adjust peak for current injury
  let adjustedPeakKm = peakKm;
  if (isCurrentInjury) {
    adjustedPeakKm = peakKm * 0.75;
  }
  
  if (phase === "foundation") {
    // Weeks 1-3: Gradual build from start
    const progress = (weekNumber - 1) / 3; // 0 to 1
    const target = startKm + (adjustedPeakKm - startKm) * 0.20 * progress;
    return Math.round(target);
  } else if (phase === "build") {
    // Weeks 4-7: Build toward peak with down-week
    if (weekNumber === 5 || (isRecurringInjury && weekNumber === 4)) {
      // Down week
      const previousWeek = buildBaseVolumeCurve(startKm, peakKm, weekNumber - 1, "build", injuryStatus);
      return Math.round(previousWeek * 0.85);
    } else {
      const progress = (weekNumber - 4) / 4; // 0 to 0.75
      const target = startKm + (adjustedPeakKm - startKm) * (0.30 + progress * 0.30);
      return Math.round(target);
    }
  } else if (phase === "peak") {
    // Weeks 8-10: Hold near peak
    if (weekNumber === 8) {
      return Math.round(adjustedPeakKm * 0.95);
    } else if (weekNumber === 9) {
      return Math.round(adjustedPeakKm);
    } else {
      // Week 10 - slight reduction or hold
      return Math.round(adjustedPeakKm * 0.92);
    }
  } else {
    // Taper: Weeks 11-12
    if (weekNumber === 11) {
      return Math.round(adjustedPeakKm * 0.70);
    } else {
      // Week 12 - race week
      return Math.round(adjustedPeakKm * 0.50);
    }
  }
}

