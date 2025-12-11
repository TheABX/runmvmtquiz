import type { QuizAnswers, RunnerPersona, WeeklyPlan, Session, TrainingPlan } from './runmvmtTypes';
import type { AbilityTier } from './config/abilityTiers';
import { classifyAbilityTier } from './config/abilityTiers';
import { getVolumeConfig, buildBaseVolumeCurve } from './config/volumeCurves';
import type { Distance as VolumeDistance, GoalIntent as VolumeGoalIntent } from './config/volumeCurves';
import { applyModifiers } from './config/modifiers';
import { getPhaseForWeek, getPhaseDescription } from './config/phaseProgression';
import { LONG_RUN_TEMPLATES, getQualitySessionTemplate, getSecondaryQualitySession } from './config/sessionTemplates';
import type { TrainingPhase } from './config/phaseProgression';

// ============================================================================
// TYPES & CONFIGURATION
// ============================================================================

export type Distance = "5k" | "10k" | "half_marathon" | "marathon" | "50k" | "80k" | "100k_plus";
export type GoalIntent = "complete" | "comfortable" | "pb" | "race" | "unsure";

// Re-export AbilityTier for backward compatibility
export type { AbilityTier } from './config/abilityTiers';

interface VolumeBand {
  startMin: number;
  startMax: number;
  peakMin: number;
  peakMax: number;
}

type VolumeBandsConfig = Record<Distance, Record<GoalIntent, Record<AbilityTier, VolumeBand>>>;

// ============================================================================
// TRAINING VOLUME BANDS
// ============================================================================

const TRAINING_VOLUME_BANDS: VolumeBandsConfig = {
  "5k": {
    complete: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35 },
      lower_intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      upper_intermediate: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70 },
      advanced: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      competitive: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      elite: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120 },
    },
    comfortable: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35 },
      lower_intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      upper_intermediate: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70 },
      advanced: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      competitive: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      elite: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120 },
    },
    pb: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35 },
      lower_intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      upper_intermediate: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70 },
      advanced: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      competitive: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      elite: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120 },
    },
    race: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35 },
      lower_intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      upper_intermediate: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70 },
      advanced: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      competitive: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      elite: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120 },
    },
    unsure: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35 },
      lower_intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      upper_intermediate: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70 },
      advanced: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      competitive: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      elite: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120 },
    },
  },
  "10k": {
    complete: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40 },
      lower_intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55 },
      upper_intermediate: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75 },
      advanced: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      competitive: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    comfortable: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40 },
      lower_intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55 },
      upper_intermediate: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75 },
      advanced: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      competitive: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    pb: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40 },
      lower_intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55 },
      upper_intermediate: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75 },
      advanced: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      competitive: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    race: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40 },
      lower_intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55 },
      upper_intermediate: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75 },
      advanced: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      competitive: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    unsure: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40 },
      lower_intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55 },
      upper_intermediate: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75 },
      advanced: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      competitive: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
  },
  "half_marathon": {
    complete: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      lower_intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65 },
      upper_intermediate: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85 },
      advanced: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      competitive: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    comfortable: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      lower_intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65 },
      upper_intermediate: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85 },
      advanced: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      competitive: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    pb: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      lower_intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65 },
      upper_intermediate: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85 },
      advanced: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      competitive: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    race: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      lower_intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65 },
      upper_intermediate: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85 },
      advanced: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      competitive: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    unsure: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      lower_intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65 },
      upper_intermediate: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85 },
      advanced: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      competitive: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
  },
  "marathon": {
    complete: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60 },
      lower_intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80 },
      upper_intermediate: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150 },
    },
    comfortable: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60 },
      lower_intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80 },
      upper_intermediate: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150 },
    },
    pb: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60 },
      lower_intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80 },
      upper_intermediate: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150 },
    },
    race: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60 },
      lower_intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80 },
      upper_intermediate: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150 },
    },
    unsure: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60 },
      lower_intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80 },
      upper_intermediate: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150 },
    },
  },
  "50k": {
    complete: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70 },
      lower_intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      upper_intermediate: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      elite: { startMin: 70, startMax: 90, peakMin: 110, peakMax: 140 },
    },
    comfortable: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70 },
      lower_intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      upper_intermediate: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      elite: { startMin: 70, startMax: 90, peakMin: 110, peakMax: 140 },
    },
    pb: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70 },
      lower_intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      upper_intermediate: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      elite: { startMin: 70, startMax: 90, peakMin: 110, peakMax: 140 },
    },
    race: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70 },
      lower_intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      upper_intermediate: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      elite: { startMin: 70, startMax: 90, peakMin: 110, peakMax: 140 },
    },
    unsure: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70 },
      lower_intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      upper_intermediate: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      elite: { startMin: 70, startMax: 90, peakMin: 110, peakMax: 140 },
    },
  },
  "80k": {
    complete: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      lower_intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110 },
      upper_intermediate: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      advanced: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
    },
    comfortable: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      lower_intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110 },
      upper_intermediate: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      advanced: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
    },
    pb: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      lower_intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110 },
      upper_intermediate: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      advanced: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
    },
    race: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      lower_intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110 },
      upper_intermediate: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      advanced: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
    },
    unsure: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      lower_intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110 },
      upper_intermediate: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      advanced: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
    },
  },
  "100k_plus": {
    complete: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100 },
      lower_intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120 },
      upper_intermediate: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      advanced: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
      competitive: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      elite: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
    },
    comfortable: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100 },
      lower_intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120 },
      upper_intermediate: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      advanced: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
      competitive: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      elite: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
    },
    pb: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100 },
      lower_intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120 },
      upper_intermediate: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      advanced: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
      competitive: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      elite: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
    },
    race: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100 },
      lower_intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120 },
      upper_intermediate: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      advanced: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
      competitive: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      elite: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
    },
    unsure: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100 },
      lower_intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120 },
      upper_intermediate: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      advanced: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
      competitive: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      elite: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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

// Use new ability tier classification from config
function mapToAbilityTier(answers: QuizAnswers, persona: RunnerPersona): AbilityTier {
  return classifyAbilityTier(answers, persona.id);
}

function mapGoalTypeToIntent(goalType: string): GoalIntent {
  switch (goalType) {
    case "complete": return "complete";
    case "comfortable": return "comfortable";
    case "pb": return "pb";
    case "race": return "race";
    default: return "comfortable"; // "unsure" maps to comfortable
  }
}

// ============================================================================
// START & PEAK KM SELECTION
// ============================================================================

function chooseStartAndPeak(
  distance: Distance,
  intent: GoalIntent,
  persona: RunnerPersona,
  currentKmBucket: string
): { startKm: number; peakKm: number; abilityTier: AbilityTier } {
  const currentKmEstimate = estimateCurrentKmFromBucket(currentKmBucket);
  // Note: This function is legacy and may not be used. If called, it needs answers parameter.
  // For now, using a default tier to prevent build errors
  const abilityTier: AbilityTier = 'beginner';
  const band = TRAINING_VOLUME_BANDS[distance][intent][abilityTier];

  // START KM RULES
  let startKm: number;
  
  if (persona.id === "beginner_low_mileage" || persona.id === "returning_from_injury") {
    startKm = Math.max(currentKmEstimate, band.startMin);
    // Max +20% jump into week 1
    const maxStart = currentKmEstimate * 1.20;
    startKm = Math.min(startKm, maxStart);
    startKm = Math.max(startKm, band.startMin);
    startKm = Math.min(startKm, band.startMax);
  } else if (persona.id === "intermediate_builder") {
    startKm = Math.max(band.startMin, Math.min(currentKmEstimate, band.startMax));
  } else {
    // high_mileage_racer / elite
    startKm = Math.max(band.startMin, Math.min(currentKmEstimate * 1.10, band.startMax));
  }

  // PEAK KM RULES
  const bandRange = band.peakMax - band.peakMin;
  let peakKm: number;

  if (persona.id === "beginner_low_mileage" || persona.id === "returning_from_injury") {
    peakKm = band.peakMin + bandRange * 0.25;
  } else if (persona.id === "intermediate_builder") {
    peakKm = band.peakMin + bandRange * 0.5; // midpoint
  } else {
    // high_mileage_racer / elite
    peakKm = band.peakMin + bandRange * 0.75;
  }

  // Hard-cap marathon and ultra peaks around 150km
  if ((distance === "marathon" || distance === "50k" || distance === "80k" || distance === "100k_plus") && peakKm > 150) {
    peakKm = 150;
  }

  return {
    startKm: Math.round(startKm),
    peakKm: Math.round(peakKm),
    abilityTier
  };
}

// ============================================================================
// WEEKLY VOLUME CURVE (12 WEEKS)
// ============================================================================

export function buildWeeklyVolumeCurve(
  distance: Distance,
  intent: GoalIntent,
  persona: RunnerPersona,
  currentKmBucket: string,
  answers: QuizAnswers,
  injuryStatus?: string
): number[] {
  // Use new config system
  const abilityTier = classifyAbilityTier(answers, persona.id);
  const volumeConfig = getVolumeConfig(
    distance as VolumeDistance,
    intent as VolumeGoalIntent,
    abilityTier,
    currentKmBucket,
    persona.id
  );
  
  // Apply modifiers
  const { adjustedVolume: adjustedStartKm } = applyModifiers(volumeConfig.startKm, answers);
  const { adjustedVolume: adjustedPeakKm } = applyModifiers(volumeConfig.peakKm, answers);
  
  const volumes: number[] = [];

  for (let week = 1; week <= 12; week++) {
    const phase = getPhaseForWeek(week, answers["goal_type"] as string) as TrainingPhase;
    const weekKm = buildBaseVolumeCurve(adjustedStartKm, adjustedPeakKm, week, phase, injuryStatus);
    volumes.push(weekKm);
  }

  return volumes;
}

// ============================================================================
// LONG RUN PRESCRIPTION BY DISTANCE
// ============================================================================

function prescribeLongRunKm(
  weekNumber: number,
  weeklyKm: number,
  distance: Distance,
  abilityTier: AbilityTier,
  previousLongRunKm?: number
): number {
  // Base percentage of weekly km
  let longRunPercent: number;
  if (distance === "5k") {
    longRunPercent = 0.25; // 20-30%
  } else if (distance === "10k" || distance === "half_marathon") {
    longRunPercent = 0.30; // 25-35%
  } else {
    longRunPercent = 0.33; // 30-35% for marathon/ultra
  }

  let longRunKm = weeklyKm * longRunPercent;

  // Distance-specific ranges - map new ability tiers to ranges
  const ranges: Record<Distance, Record<AbilityTier, [number, number]>> = {
    "5k": {
      beginner: [8, 10],
      lower_intermediate: [10, 12],
      upper_intermediate: [12, 14],
      advanced: [12, 16],
      competitive: [12, 16],
      elite: [18, 20],
    },
    "10k": {
      beginner: [12, 14],
      lower_intermediate: [14, 18],
      upper_intermediate: [16, 20],
      advanced: [16, 22],
      competitive: [16, 22],
      elite: [22, 26],
    },
    "half_marathon": {
      beginner: [16, 18],
      lower_intermediate: [18, 21],
      upper_intermediate: [20, 23],
      advanced: [21, 24],
      competitive: [22, 26],
      elite: [22, 26],
    },
    "marathon": {
      beginner: [28, 32],
      lower_intermediate: [30, 34],
      upper_intermediate: [32, 35],
      advanced: [32, 36],
      competitive: [34, 38],
      elite: [34, 38],
    },
    "50k": {
      beginner: [24, 32],
      lower_intermediate: [28, 36],
      upper_intermediate: [32, 38],
      advanced: [32, 40],
      competitive: [36, 44],
      elite: [36, 44],
    },
    "80k": {
      beginner: [32, 40],
      lower_intermediate: [36, 45],
      upper_intermediate: [40, 48],
      advanced: [40, 52],
      competitive: [45, 55],
      elite: [45, 55],
    },
    "100k_plus": {
      beginner: [36, 45],
      lower_intermediate: [40, 52],
      upper_intermediate: [45, 56],
      advanced: [45, 60],
      competitive: [50, 60],
      elite: [50, 60],
    },
  };

  const [minLongRun, maxLongRun] = ranges[distance][abilityTier];
  longRunKm = Math.max(minLongRun, Math.min(longRunKm, maxLongRun));

  // Taper adjustments
  if (weekNumber >= 11) {
    if (distance === "marathon") {
      if (weekNumber === 11) {
        longRunKm = Math.min(longRunKm, 22);
      } else {
        longRunKm = Math.min(longRunKm, 16);
      }
    } else {
      longRunKm = longRunKm * 0.6; // Reduce long run more in taper
    }
  }

  // Down-week adjustments (if previous exists and this is a down week)
  if (previousLongRunKm && weekNumber > 1) {
    const weekBeforeKm = previousLongRunKm;
    // No jump >20% in long run itself
    const maxJump = weekBeforeKm * 1.20;
    longRunKm = Math.min(longRunKm, maxJump);
  }

  // Never exceed 60% of weekly km
  longRunKm = Math.min(longRunKm, weeklyKm * 0.60);

  return Math.round(longRunKm);
}

// ============================================================================
// HELPER FUNCTIONS FOR ENHANCED SESSION DESCRIPTIONS
// ============================================================================

function getRecoveryGuidance(lifestyle: string, recoveryFeel: string): string {
  if (lifestyle === "parent_low_sleep" || recoveryFeel === "burnt_out") {
    return "Prioritise sleep and gentle movement. If you're tired, shorten or skip this session.";
  }
  if (lifestyle === "heavy_labour" || lifestyle === "active_job") {
    return "You're already on your feet a lot — listen to your body and don't push through fatigue.";
  }
  if (recoveryFeel === "sore") {
    return "Take extra time to warm up and cool down. If soreness persists, reduce intensity.";
  }
  if (lifestyle === "desk") {
    return "Since you sit most of the day, this run helps counteract stiffness. Focus on good posture.";
  }
  return "";
}

function getSurfaceGuidance(surface: string, courseProfile: string): string {
  if (surface === "trail" || surface === "mixed") {
    if (courseProfile === "mountain") {
      return "Include hills and technical terrain. Focus on time on feet rather than pace.";
    }
    if (courseProfile === "rolling") {
      return "Mix of flat and hilly sections. Practice varying effort on climbs and descents.";
    }
    return "Trail running builds strength naturally. Focus on smooth, efficient movement.";
  }
  if (surface === "treadmill") {
    return "Consider adding 1-2% incline to simulate outdoor conditions. Focus on consistent effort.";
  }
  if (courseProfile === "mountain" && surface === "road") {
    return "If your race is hilly but you train on roads, add hill repeats or treadmill incline work.";
  }
  return "";
}

function getStrengthNote(strengthTraining: string): string {
  if (strengthTraining === "yes_consistent") {
    return "Continue your strength work. Schedule it on easy run days or after quality sessions.";
  }
  if (strengthTraining === "yes_inconsistent") {
    return "Try to maintain 1-2 strength sessions per week. Focus on runner-specific movements.";
  }
  if (strengthTraining === "no_but_open") {
    return "Consider adding 1-2 short strength sessions per week. Start with bodyweight exercises.";
  }
  return "";
}

function generateLongRunDescription(
  distance: Distance,
  weekNumber: number,
  longRunKm: number,
  surface: string,
  courseProfile: string,
  lifestyle: string,
  recoveryFeel: string
): string {
  const surfaceGuidance = getSurfaceGuidance(surface, courseProfile);
  const recoveryGuidance = getRecoveryGuidance(lifestyle, recoveryFeel);
  
  let baseDesc = "";
  
  if (distance === "marathon" && weekNumber >= 7 && weekNumber <= 10) {
    baseDesc = `Long run with marathon-pace blocks. Start with 15-20 min easy warm-up, then include 2-3 blocks of 10-15 min at marathon pace with 5 min easy recovery between. Finish with easy cooldown. This builds race-specific fitness and pacing confidence.`;
  } else if (distance === "5k" || distance === "10k") {
    baseDesc = `Long run at easy, conversational pace (RPE 3-4/10). You should be able to speak in full sentences. Focus on relaxed form, steady breathing, and time on feet. This builds aerobic base without adding stress.`;
  } else if (distance === "half_marathon") {
    if (weekNumber >= 8 && weekNumber <= 10) {
      baseDesc = `Long run with optional half-marathon pace segments. After 20 min easy, include 2-3 x 10 min at half-marathon effort with 3 min easy recovery. Finish easy. This sharpens race-specific fitness.`;
    } else {
      baseDesc = `Long run at easy effort (RPE 3-4/10). Focus on building endurance and aerobic capacity. Keep it conversational — you should finish feeling like you could run more.`;
    }
  } else if (distance === "50k" || distance === "80k" || distance === "100k_plus") {
    baseDesc = `Long run at easy to moderate effort. Focus on time on feet, terrain-specific adaptation, and fuelling practice. Start easy and stay controlled — the goal is duration, not pace. Practice your race-day nutrition strategy.`;
  } else {
    baseDesc = `Long run at easy, conversational pace. Build endurance gradually. Focus on relaxed rhythm, steady breathing, and enjoying the process.`;
  }
  
  const parts = [baseDesc];
  if (surfaceGuidance) parts.push(surfaceGuidance);
  if (recoveryGuidance) parts.push(recoveryGuidance);
  
  return parts.join(" ");
}

function generateQualitySessionDescription(
  distance: Distance,
  weekNumber: number,
  sessionType: string,
  surface: string,
  courseProfile: string,
  sessionPrefs: string[]
): string {
  let desc = "";
  
  if (sessionType === "Tempo / Threshold") {
    if (distance === "5k") {
      desc = `15-25 min continuous tempo at comfortably hard effort (RPE 6-7/10). You should be able to say 2-3 words at a time. Start conservatively and build into it. This improves your lactate threshold — the pace you can sustain for 20-30 minutes.`;
    } else if (distance === "10k") {
      desc = `20-30 min continuous tempo at threshold pace (RPE 6-7/10). This is comfortably hard — not all-out, but definitely not easy. Focus on even effort throughout. This builds the fitness you need for sustained 10k effort.`;
    }
    
    if (courseProfile === "rolling" || courseProfile === "mountain") {
      desc += " If on hills, adjust effort — maintain RPE rather than pace.";
    }
  } else if (sessionType === "Intervals") {
    if (distance === "5k") {
      desc = `8 x 400m or 6 x 800m at 5k race pace with full recovery (2-3 min walk/jog). These intervals improve speed and efficiency. Focus on smooth, controlled pace — not all-out sprinting.`;
    } else if (distance === "10k") {
      desc = `6 x 1km or 5 x 1.2km at 10k race pace with 90 sec-2 min recovery. These intervals build race-specific fitness. Start slightly conservative and finish strong.`;
    }
    
    if (sessionPrefs && sessionPrefs.includes("hills") && (courseProfile === "rolling" || courseProfile === "mountain")) {
      desc += " Consider hill intervals instead: 6-8 x 60-90 sec uphill at hard effort with jog-down recovery.";
    }
  } else if (sessionType === "Threshold Intervals") {
    desc = `4-6 x 5 min at threshold pace (comfortably hard, RPE 6-7/10) with 1 min easy recovery. These intervals build sustained power without the stress of continuous tempo. Focus on consistent effort across all intervals.`;
  } else if (sessionType === "Continuous Tempo") {
    desc = `20-40 min continuous tempo at half-marathon effort (RPE 6-7/10). This is your race pace — sustainable but challenging. Start conservatively and build into it. This is the key session for half-marathon fitness.`;
  } else if (sessionType === "Threshold Work") {
    desc = `Continuous tempo or cruise intervals at threshold pace (RPE 6-7/10). Option 1: 20-30 min continuous. Option 2: 3-4 x 8-10 min with 2 min recovery. This builds the aerobic power you need for marathon pace.`;
  } else if (sessionType === "Marathon Pace") {
    if (weekNumber >= 7 && weekNumber <= 9) {
      desc = `Marathon-pace blocks: 3-4 x 15-20 min at goal marathon pace with 3-4 min easy recovery. This is race-specific training. Practice your race-day pacing and fuelling. Start conservatively — marathon pace should feel controlled.`;
    } else {
      desc = `Marathon-pace work: 2-3 x 10-15 min at goal marathon pace with 3-4 min easy recovery. This builds race-specific fitness and pacing confidence. Focus on smooth, controlled effort.`;
    }
  } else if (sessionType === "Steady Effort") {
    desc = `Longer steady aerobic effort (RPE 5-6/10). Keep it controlled and sustainable — you should finish feeling strong. This builds the endurance base crucial for ultra-distance events. Focus on time on feet and consistent effort.`;
  } else if (sessionType === "Long Steady") {
    desc = `Extended steady effort at moderate intensity (RPE 5-6/10). This is longer than tempo but harder than easy. Builds aerobic capacity and mental toughness for ultra events. Stay controlled throughout.`;
  } else if (sessionType === "Strides / Leg Speed") {
    desc = `4-8 x 20-30 sec fast strides at the end of an easy run. Focus on quick, light turnover and good form. Full recovery between each (walk back to start). This improves running economy and leg speed without adding stress.`;
  }
  
  if (surface === "trail" && (sessionType.includes("Tempo") || sessionType.includes("Intervals"))) {
    desc += " On trails, focus on effort rather than pace — terrain will vary your pace naturally.";
  }
  
  return desc;
}

function generateEasyRunDescription(
  lifestyle: string,
  recoveryFeel: string,
  surface: string,
  weekNumber: number
): string {
  let desc = `Easy run at conversational pace (RPE 2-3/10). You should be able to speak in full sentences comfortably. Focus on relaxed form, steady breathing, and recovery.`;
  
  if (lifestyle === "desk") {
    desc += " Since you sit most of the day, this run helps counteract stiffness and improves circulation.";
  } else if (lifestyle === "parent_low_sleep" || recoveryFeel === "burnt_out") {
    desc += " If you're tired, it's okay to shorten this or make it a walk-run. Recovery is the priority.";
  } else if (recoveryFeel === "sore") {
    desc += " Take extra time to warm up. If soreness increases during the run, stop and rest.";
  }
  
  if (surface === "trail") {
    desc += " On trails, focus on smooth movement and enjoying the terrain. Pace is less important than time on feet.";
  }
  
  if (weekNumber >= 11) {
    desc += " During taper, these easy runs maintain fitness while allowing full recovery.";
  }
  
  return desc;
}

// ============================================================================
// WEEKLY STRUCTURE GENERATION
// ============================================================================

export function buildWeeklyStructure(
  weekNumber: number,
  totalKm: number,
  answers: QuizAnswers,
  persona: RunnerPersona,
  abilityTier: AbilityTier,
  distance: Distance,
  previousLongRunKm?: number
): WeeklyPlan {
  // Determine number of run days
  let daysCount: number;
  if (persona.id === "time_poor_3_day") {
    daysCount = 3;
  } else {
    const preferredDays = answers["preferred_days_per_week"] as string;
    daysCount = preferredDays === "2_3" ? 3
      : preferredDays === "3_4" ? 4
      : preferredDays === "4_5" ? 5
      : preferredDays === "5_6" ? 6
      : 6; // Cap at 6 for "6_7"
  }

  // Long run
  const longRunKm = prescribeLongRunKm(weekNumber, totalKm, distance, abilityTier, previousLongRunKm);

  // Determine quality sessions
  const injuryStatus = answers["injury_status"] as string;
  let qualitySessionsCount = 0;
  
  if (injuryStatus === "current" || (persona.id === "returning_from_injury" && weekNumber <= 2)) {
    qualitySessionsCount = 0;
  } else if (persona.id === "beginner_low_mileage" || persona.id === "returning_from_injury") {
    qualitySessionsCount = weekNumber <= 2 ? 0 : 1;
  } else if (persona.id === "intermediate_builder") {
    qualitySessionsCount = (distance === "5k" || distance === "10k" || distance === "half_marathon") && weekNumber >= 4 && weekNumber <= 8 ? 2 : 1;
  } else {
    // high_mileage_racer / elite
    if (distance === "5k" || distance === "10k" || distance === "half_marathon" || distance === "marathon") {
      qualitySessionsCount = 2;
    } else {
      // Ultras: usually 1, sometimes 2 (second is longer steady, not very hard)
      qualitySessionsCount = weekNumber >= 6 && weekNumber <= 9 ? 2 : 1;
    }
  }

  // Extract quiz answers for personalization
  const lifestyle = (answers["lifestyle"] as string) || "mixed";
  const recoveryFeel = (answers["recovery_feel"] as string) || "normal";
  const sessionPrefs = (answers["session_preferences"] as string[]) || [];
  const surface = (answers["main_surface"] as string) || "road";
  const courseProfile = (answers["course_profile"] as string) || "flat";
  const strengthTraining = (answers["strength_training"] as string) || "no_not_interested";

  const sessions: Session[] = [];

  // Long run on Sunday - use new template system
  const phase = getPhaseForWeek(weekNumber, answers["goal_type"] as string) as TrainingPhase;
  const longRunTemplate = LONG_RUN_TEMPLATES[distance][phase];
  
  // Enhance template description with personalization
  let longRunDesc = longRunTemplate.description;
  const surfaceGuidance = getSurfaceGuidance(surface, courseProfile);
  const recoveryGuidance = getRecoveryGuidance(lifestyle, recoveryFeel);
  
  if (surfaceGuidance) {
    longRunDesc += ` ${surfaceGuidance}`;
  }
  if (recoveryGuidance) {
    longRunDesc += ` ${recoveryGuidance}`;
  }
  
  // Adjust intensity based on phase and distance
  let longRunIntensity = longRunTemplate.intensityHint;
  if (distance === "marathon" && weekNumber >= 7 && weekNumber <= 10) {
    longRunIntensity = "Easy–Moderate (with MP blocks)";
  } else if (distance === "half_marathon" && weekNumber >= 8 && weekNumber <= 10) {
    longRunIntensity = "Easy–Moderate (with HMP segments)";
  }
  
  sessions.push({
    day: "Sun",
    type: "Long Run",
    description: longRunDesc,
    durationKmOrMin: longRunKm, // Use calculated long run km, not template default
    intensityHint: longRunIntensity
  });

  // Quality sessions
  const qualityKm = qualitySessionsCount * 8; // Approximate 8km per quality session
  const remainingKm = totalKm - longRunKm - qualityKm;
  const easyRunDays = daysCount - 1 - qualitySessionsCount;
  const easyKmPerRun = easyRunDays > 0 ? Math.round(remainingKm / easyRunDays) : 0;

  if (qualitySessionsCount >= 1) {
    const primaryQualityDay = weekNumber % 2 === 0 ? "Tue" : "Wed";
    const phase = getPhaseForWeek(weekNumber, answers["goal_type"] as string) as TrainingPhase;
    
    // Use new session template system
    const qualityTemplate = getQualitySessionTemplate(distance, phase, weekNumber, abilityTier);
    
    // Check if user prefers hills and course is hilly - override if applicable
    const prefersHills = sessionPrefs.includes("hills");
    const isHillyCourse = courseProfile === "rolling" || courseProfile === "mountain";
    
    let qualityType = qualityTemplate.type;
    let qualityDesc = qualityTemplate.description;
    
    // Override for hill preferences on hilly courses
    if (prefersHills && isHillyCourse && weekNumber >= 6 && (distance === "5k" || distance === "10k" || distance === "half_marathon")) {
      if (qualityType === "Intervals") {
        qualityType = "Hill Intervals";
        qualityDesc = `6-8 x 60-90 sec uphill at hard effort (RPE 7-8/10) with jog-down recovery. These build power and strength for hilly courses. Focus on strong, controlled effort up the hill.`;
      }
    }
    
    // Add surface-specific guidance
    if (surface === "trail" && (qualityType.includes("Tempo") || qualityType.includes("Intervals"))) {
      qualityDesc += " On trails, focus on effort rather than pace — terrain will vary your pace naturally.";
    }
    
    // Adjust intensity hint based on recovery and lifestyle
    let intensityHint = qualityTemplate.intensityHint;
    if (recoveryFeel === "sore" || recoveryFeel === "burnt_out" || lifestyle === "parent_low_sleep") {
      intensityHint = "Moderate (listen to your body)";
    }

    sessions.push({
      day: primaryQualityDay,
      type: qualityType,
      description: qualityDesc,
      durationKmOrMin: qualityTemplate.durationKmOrMin,
      intensityHint: intensityHint
    });

    if (qualitySessionsCount === 2) {
      const secondaryDay = primaryQualityDay === "Tue" ? "Thu" : "Sat";
      const phase = getPhaseForWeek(weekNumber, answers["goal_type"] as string) as TrainingPhase;
      
      // Use new session template system for secondary quality session
      const secondaryTemplate = getSecondaryQualitySession(distance, phase, weekNumber);
      
      let secondaryType = secondaryTemplate.type;
      let secondaryDesc = secondaryTemplate.description;
      
      // Override for hill preferences
      const prefersHills = sessionPrefs.includes("hills");
      const isHillyCourse = courseProfile === "rolling" || courseProfile === "mountain";
      
      if (prefersHills && isHillyCourse && secondaryType === "Intervals / Hills") {
        secondaryType = "Hill Reps";
        secondaryDesc = `6-8 x 60-90 sec uphill at hard effort (RPE 7-8/10) with jog-down recovery. Builds power and strength. Focus on strong, controlled effort.`;
      }
      
      sessions.push({
        day: secondaryDay,
        type: secondaryType,
        description: secondaryDesc,
        durationKmOrMin: secondaryTemplate.durationKmOrMin,
        intensityHint: secondaryTemplate.intensityHint
      });
    }
  }

  // Easy runs fill remaining days
  const easyDaysOrder = ["Mon", "Wed", "Thu", "Fri", "Sat"].filter(
    d => !sessions.some(s => s.day === d)
  );

  for (let i = 0; i < easyRunDays && i < easyDaysOrder.length; i++) {
    const easyDesc = generateEasyRunDescription(lifestyle, recoveryFeel, surface, weekNumber);
    
    // Add strength training note to one easy run if applicable
    let finalEasyDesc = easyDesc;
    if (i === 0 && strengthTraining !== "no_not_interested") {
      const strengthNote = getStrengthNote(strengthTraining);
      if (strengthNote) {
        finalEasyDesc += ` ${strengthNote}`;
      }
    }
    
    sessions.push({
      day: easyDaysOrder[i],
      type: "Easy Run",
      description: finalEasyDesc,
      durationKmOrMin: easyKmPerRun,
      intensityHint: "Easy"
    });
  }

  // Enhanced focus labels using new phase system
  const goalType = answers["goal_type"] as string;
  const focus = getPhaseDescription(weekNumber, goalType);

  return {
    week: weekNumber,
    targetKm: totalKm,
    keySessions: sessions,
    focus
  };
}

// ============================================================================
// MAIN TRAINING PLAN BUILDER
// ============================================================================

export function generateTrainingPlan(answers: QuizAnswers, persona: RunnerPersona): TrainingPlan {
  const distance = answers["goal_distance"] as string as Distance;
  const goalType = answers["goal_type"] as string;
  const intent = mapGoalTypeToIntent(goalType);
  const currentKmBucket = answers["current_weekly_km"] as string;
  const injuryStatus = answers["injury_status"] as string;

  // Determine ability tier once (needed for volume curve and later use)
  const currentKmEstimate = estimateCurrentKmFromBucket(currentKmBucket);
  const abilityTier = mapToAbilityTier(answers, persona);
  
  // Build weekly volume curve using new config system
  const weeklyKm = buildWeeklyVolumeCurve(distance, intent, persona, currentKmBucket, answers, injuryStatus);

  // Build weekly plans
  const weeklyPlans: WeeklyPlan[] = [];
  let previousLongRunKm: number | undefined;

  for (let week = 1; week <= 12; week++) {
    const weeklyPlan = buildWeeklyStructure(
      week,
      weeklyKm[week - 1],
      answers,
      persona,
      abilityTier,
      distance,
      previousLongRunKm
    );
    weeklyPlans.push(weeklyPlan);
    
    // Track long run for next week's progression
    const longRunSession = weeklyPlan.keySessions.find(s => s.type === "Long Run");
    if (longRunSession && longRunSession.durationKmOrMin) {
      previousLongRunKm = longRunSession.durationKmOrMin;
    }
  }

  // Build notes
  const notes: string[] = [];
  if (persona.id === "returning_from_injury" || injuryStatus === "current" || injuryStatus === "recurring") {
    notes.push("Returning from injury — plan uses extra down-weeks and reduced intensity.");
  }
  if (persona.id === "time_poor_3_day") {
    notes.push("Time-poor schedule — 3 key sessions per week.");
  }
  // currentKmEstimate is already defined above, no need to redefine
  if (abilityTier === "elite" && currentKmEstimate >= 120) {
    notes.push("Elite volume — weeks built from your current 120km+ base; listen to your body.");
  }
  if (currentKmEstimate < 25 && (distance === "marathon" || distance === "50k" || distance === "80k" || distance === "100k_plus")) {
    notes.push("Introductory build block — focus on gradual progression and consistency.");
  }
  
  // Add modifier-based notes
  const { recoveryGuidance } = applyModifiers(100, answers); // Dummy value, just getting guidance
  if (recoveryGuidance.length > 0) {
    notes.push(...recoveryGuidance);
  }

  return {
    distance,
    goal: goalType,
    durationWeeks: 12,
    weeklyStructure: weeklyPlans,
    persona,
    notes
  };
}
