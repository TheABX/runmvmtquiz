import type { QuizAnswers, RunnerPersona, WeeklyPlan, Session, TrainingPlan } from './runmvmtTypes';

// ============================================================================
// TYPES & CONFIGURATION
// ============================================================================

export type AbilityTier = "beginner" | "intermediate" | "advanced" | "competitive" | "elite";
export type Distance = "5k" | "10k" | "half_marathon" | "marathon" | "50k" | "80k" | "100k_plus";
export type GoalIntent = "complete" | "comfortable" | "pb" | "race" | "unsure";

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
      intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      advanced: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70 },
      competitive: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      elite: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120 },
    },
    comfortable: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35 },
      intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      advanced: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70 },
      competitive: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      elite: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120 },
    },
    pb: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35 },
      intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      advanced: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70 },
      competitive: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      elite: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120 },
    },
    race: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35 },
      intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      advanced: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70 },
      competitive: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      elite: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120 },
    },
    unsure: {
      beginner: { startMin: 15, startMax: 25, peakMin: 25, peakMax: 35 },
      intermediate: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      advanced: { startMin: 35, startMax: 45, peakMin: 50, peakMax: 70 },
      competitive: { startMin: 45, startMax: 60, peakMin: 60, peakMax: 90 },
      elite: { startMin: 60, startMax: 90, peakMin: 80, peakMax: 120 },
    },
  },
  "10k": {
    complete: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40 },
      intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55 },
      advanced: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75 },
      competitive: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    comfortable: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40 },
      intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55 },
      advanced: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75 },
      competitive: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    pb: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40 },
      intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55 },
      advanced: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75 },
      competitive: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    race: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40 },
      intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55 },
      advanced: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75 },
      competitive: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    unsure: {
      beginner: { startMin: 20, startMax: 30, peakMin: 30, peakMax: 40 },
      intermediate: { startMin: 30, startMax: 40, peakMin: 40, peakMax: 55 },
      advanced: { startMin: 40, startMax: 55, peakMin: 55, peakMax: 75 },
      competitive: { startMin: 55, startMax: 75, peakMin: 75, peakMax: 110 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
  },
  "half_marathon": {
    complete: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65 },
      advanced: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85 },
      competitive: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    comfortable: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65 },
      advanced: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85 },
      competitive: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    pb: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65 },
      advanced: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85 },
      competitive: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    race: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65 },
      advanced: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85 },
      competitive: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
    unsure: {
      beginner: { startMin: 25, startMax: 35, peakMin: 35, peakMax: 50 },
      intermediate: { startMin: 35, startMax: 45, peakMin: 45, peakMax: 65 },
      advanced: { startMin: 45, startMax: 60, peakMin: 65, peakMax: 85 },
      competitive: { startMin: 60, startMax: 80, peakMin: 80, peakMax: 100 },
      elite: { startMin: 70, startMax: 100, peakMin: 100, peakMax: 140 },
    },
  },
  "marathon": {
    complete: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60 },
      intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80 },
      advanced: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150 },
    },
    comfortable: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60 },
      intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80 },
      advanced: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150 },
    },
    pb: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60 },
      intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80 },
      advanced: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150 },
    },
    race: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60 },
      intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80 },
      advanced: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150 },
    },
    unsure: {
      beginner: { startMin: 30, startMax: 45, peakMin: 45, peakMax: 60 },
      intermediate: { startMin: 40, startMax: 55, peakMin: 60, peakMax: 80 },
      advanced: { startMin: 55, startMax: 70, peakMin: 80, peakMax: 105 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 90, startMax: 120, peakMin: 120, peakMax: 150 },
    },
  },
  "50k": {
    complete: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70 },
      intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      advanced: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      competitive: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      elite: { startMin: 70, startMax: 90, peakMin: 110, peakMax: 140 },
    },
    comfortable: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70 },
      intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      advanced: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      competitive: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      elite: { startMin: 70, startMax: 90, peakMin: 110, peakMax: 140 },
    },
    pb: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70 },
      intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      advanced: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      competitive: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      elite: { startMin: 70, startMax: 90, peakMin: 110, peakMax: 140 },
    },
    race: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70 },
      intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      advanced: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      competitive: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      elite: { startMin: 70, startMax: 90, peakMin: 110, peakMax: 140 },
    },
    unsure: {
      beginner: { startMin: 35, startMax: 45, peakMin: 55, peakMax: 70 },
      intermediate: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      advanced: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      competitive: { startMin: 60, startMax: 75, peakMin: 85, peakMax: 110 },
      elite: { startMin: 70, startMax: 90, peakMin: 110, peakMax: 140 },
    },
  },
  "80k": {
    complete: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
    },
    comfortable: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
    },
    pb: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
    },
    race: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
    },
    unsure: {
      beginner: { startMin: 45, startMax: 60, peakMin: 70, peakMax: 90 },
      intermediate: { startMin: 55, startMax: 70, peakMin: 85, peakMax: 110 },
      advanced: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      competitive: { startMin: 70, startMax: 90, peakMin: 100, peakMax: 130 },
      elite: { startMin: 80, startMax: 100, peakMin: 120, peakMax: 150 },
    },
  },
  "100k_plus": {
    complete: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100 },
      intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120 },
      advanced: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      competitive: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      elite: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
    },
    comfortable: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100 },
      intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120 },
      advanced: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      competitive: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      elite: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
    },
    pb: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100 },
      intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120 },
      advanced: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      competitive: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      elite: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
    },
    race: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100 },
      intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120 },
      advanced: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      competitive: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
      elite: { startMin: 80, startMax: 110, peakMin: 130, peakMax: 160 },
    },
    unsure: {
      beginner: { startMin: 50, startMax: 65, peakMin: 80, peakMax: 100 },
      intermediate: { startMin: 60, startMax: 80, peakMin: 95, peakMax: 120 },
      advanced: { startMin: 75, startMax: 95, peakMin: 110, peakMax: 140 },
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

function mapToAbilityTier(persona: RunnerPersona, currentKmEstimate: number): AbilityTier {
  // Injury persona caps at advanced unless truly elite base
  if (persona.id === "returning_from_injury") {
    if (currentKmEstimate >= 110) return "competitive";
    if (currentKmEstimate >= 80) return "advanced";
    if (currentKmEstimate >= 50) return "intermediate";
    return "beginner";
  }

  // Primary mapping based on current km
  if (currentKmEstimate < 25) return "beginner";
  if (currentKmEstimate < 50) return "intermediate";
  if (currentKmEstimate < 80) return "advanced";
  if (currentKmEstimate < 110) return "competitive";
  return "elite";
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
  const abilityTier = mapToAbilityTier(persona, currentKmEstimate);
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
    if (abilityTier === "elite") {
      startKm = Math.min(startKm, currentKmEstimate * 1.10);
    }
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
    if (abilityTier === "elite") {
      peakKm = Math.min(band.peakMax, currentKmEstimate * 1.15);
    }
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
  injuryStatus?: string
): number[] {
  const { startKm, peakKm, abilityTier } = chooseStartAndPeak(distance, intent, persona, currentKmBucket);
  
  // Adjust peak for current injury
  let adjustedPeakKm = peakKm;
  if (injuryStatus === "current") {
    adjustedPeakKm = peakKm * 0.80;
  }

  const volumes: number[] = [];
  const maxIncreasePercent = (persona.id === "returning_from_injury" || persona.id === "beginner_low_mileage") ? 0.10 : 0.15;
  const isRecurringInjury = injuryStatus === "recurring";

  let currentKm = startKm;

  for (let week = 1; week <= 12; week++) {
    // WEEKS 1-3: Base / adaptation
    if (week <= 3) {
      const target = startKm + ((adjustedPeakKm - startKm) * 0.15 * week);
      const maxIncrease = currentKm * maxIncreasePercent;
      const step = Math.min(target - currentKm, maxIncrease);
      currentKm = Math.max(currentKm, currentKm + step);
    }
    // WEEKS 4-7: Build towards peak with down-week
    else if (week <= 7) {
      if (week === 5 || (isRecurringInjury && week % 3 === 0)) {
        // Down week
        currentKm = currentKm * 0.85;
      } else {
        const target = startKm + ((adjustedPeakKm - startKm) * (0.3 + (week - 4) * 0.15));
        const maxIncrease = currentKm * maxIncreasePercent;
        const step = Math.min(target - currentKm, maxIncrease);
        currentKm = Math.max(currentKm, currentKm + step);
      }
    }
    // WEEKS 8-10: Hold near peak
    else if (week <= 10) {
      if (week === 8) {
        currentKm = adjustedPeakKm * 0.95;
      } else if (week === 9) {
        currentKm = adjustedPeakKm;
      } else {
        // Week 10
        if (distance === "50k" || distance === "80k" || distance === "100k_plus") {
          // Ultra: allow one big week up to 1.1x peak if safe
          currentKm = Math.min(adjustedPeakKm * 1.10, currentKm * 1.15);
        } else {
          currentKm = adjustedPeakKm * 0.90;
        }
      }
    }
    // WEEKS 11-12: Taper
    else {
      const goalType = intent;
      if (goalType === "unsure") {
        // Light reduction only
        if (week === 11) {
          currentKm = adjustedPeakKm * 0.85;
        } else {
          currentKm = adjustedPeakKm * 0.75;
        }
      } else {
        // Race taper
        if (week === 11) {
          currentKm = adjustedPeakKm * 0.725; // 0.7-0.75
        } else {
          // Week 12
          if (distance === "5k" || distance === "10k") {
            currentKm = adjustedPeakKm * 0.50; // 0.45-0.55
          } else {
            currentKm = adjustedPeakKm * 0.55; // 0.5-0.6 for marathon/ultra
          }
        }
      }
    }

    // Safety clamp
    currentKm = Math.max(0, Math.round(currentKm));
    volumes.push(currentKm);
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

  // Distance-specific ranges
  const ranges: Record<Distance, Record<AbilityTier, [number, number]>> = {
    "5k": {
      beginner: [8, 10],
      intermediate: [10, 12],
      advanced: [12, 16],
      competitive: [12, 16],
      elite: [18, 20],
    },
    "10k": {
      beginner: [12, 14],
      intermediate: [14, 18],
      advanced: [16, 22],
      competitive: [16, 22],
      elite: [22, 26],
    },
    "half_marathon": {
      beginner: [16, 18],
      intermediate: [18, 21],
      advanced: [21, 24],
      competitive: [22, 26],
      elite: [22, 26],
    },
    "marathon": {
      beginner: [28, 32],
      intermediate: [30, 34],
      advanced: [32, 36],
      competitive: [34, 38],
      elite: [34, 38],
    },
    "50k": {
      beginner: [24, 32],
      intermediate: [28, 36],
      advanced: [32, 40],
      competitive: [36, 44],
      elite: [36, 44],
    },
    "80k": {
      beginner: [32, 40],
      intermediate: [36, 45],
      advanced: [40, 52],
      competitive: [45, 55],
      elite: [45, 55],
    },
    "100k_plus": {
      beginner: [36, 45],
      intermediate: [40, 52],
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

  const sessions: Session[] = [];

  // Long run on Sunday
  sessions.push({
    day: "Sun",
    type: "Long Run",
    description: distance === "marathon" && weekNumber >= 7 && weekNumber <= 10
      ? `Long run with marathon-pace blocks. Build endurance and race-specific fitness.`
      : distance === "50k" || distance === "80k" || distance === "100k_plus"
      ? `Long run at easy effort. Focus on time on feet and terrain-specific adaptation.`
      : `Long run at easy effort. Focus on relaxed rhythm and time on feet.`,
    durationKmOrMin: longRunKm,
    intensityHint: "Easy"
  });

  // Quality sessions
  const qualityKm = qualitySessionsCount * 8; // Approximate 8km per quality session
  const remainingKm = totalKm - longRunKm - qualityKm;
  const easyRunDays = daysCount - 1 - qualitySessionsCount;
  const easyKmPerRun = easyRunDays > 0 ? Math.round(remainingKm / easyRunDays) : 0;

  if (qualitySessionsCount >= 1) {
    const primaryQualityDay = weekNumber % 2 === 0 ? "Tue" : "Wed";
    let qualityType = "";
    let qualityDesc = "";

    if (distance === "5k" || distance === "10k") {
      if (weekNumber < 5) {
        qualityType = "Tempo / Threshold";
        qualityDesc = "15-25 min continuous tempo at comfortably hard pace.";
      } else {
        qualityType = "Intervals";
        qualityDesc = distance === "5k" 
          ? "8 x 400m or 6 x 800m at 5k pace with full recovery."
          : "6 x 1km or 5 x 1.2km at 10k pace with full recovery.";
      }
    } else if (distance === "half_marathon") {
      if (weekNumber < 5) {
        qualityType = "Threshold Intervals";
        qualityDesc = "4-6 x 5 min at threshold pace with 1 min recovery.";
      } else {
        qualityType = "Continuous Tempo";
        qualityDesc = "20-40 min continuous tempo at half marathon effort.";
      }
    } else if (distance === "marathon") {
      if (weekNumber < 5) {
        qualityType = "Threshold Work";
        qualityDesc = "Continuous tempo or cruise intervals at threshold pace.";
      } else {
        qualityType = "Marathon Pace";
        qualityDesc = "Marathon-pace blocks or steady-state intervals targeting race effort.";
      }
    } else {
      // Ultras
      qualityType = "Steady Effort";
      qualityDesc = "Longer steady aerobic effort. Keep it controlled and sustainable.";
    }

    sessions.push({
      day: primaryQualityDay,
      type: qualityType,
      description: qualityDesc,
      durationKmOrMin: 8,
      intensityHint: "Moderate–Hard"
    });

    if (qualitySessionsCount === 2) {
      const secondaryDay = primaryQualityDay === "Tue" ? "Thu" : "Sat";
      if (distance === "50k" || distance === "80k" || distance === "100k_plus") {
        sessions.push({
          day: secondaryDay,
          type: "Long Steady",
          description: "Extended steady effort. Focus on aerobic efficiency.",
          durationKmOrMin: 10,
          intensityHint: "Moderate"
        });
      } else {
        sessions.push({
          day: secondaryDay,
          type: weekNumber < 5 ? "Strides / Leg Speed" : "Intervals",
          description: weekNumber < 5
            ? "4-8 x 20s fast strides at end of easy run."
            : "Shorter intervals or hill reps for leg speed.",
          durationKmOrMin: 6,
          intensityHint: "Moderate"
        });
      }
    }
  }

  // Easy runs fill remaining days
  const easyDaysOrder = ["Mon", "Wed", "Thu", "Fri", "Sat"].filter(
    d => !sessions.some(s => s.day === d)
  );

  for (let i = 0; i < easyRunDays && i < easyDaysOrder.length; i++) {
    sessions.push({
      day: easyDaysOrder[i],
      type: "Easy Run",
      description: "Easy run at conversational pace. Focus on relaxed form and recovery.",
      durationKmOrMin: easyKmPerRun,
      intensityHint: "Easy"
    });
  }

  // Focus label
  let focus = "Solid aerobic development";
  if (weekNumber <= 3) {
    focus = "Base building & establishing consistency";
  } else if (weekNumber <= 7) {
    focus = "Building aerobic strength & specific fitness";
  } else if (weekNumber <= 10) {
    focus = "Race-specific sharpening";
  } else {
    focus = answers["goal_type"] === "unsure" ? "Consolidation block" : "Taper & freshness";
  }

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

  // Build weekly volume curve
  const weeklyKm = buildWeeklyVolumeCurve(distance, intent, persona, currentKmBucket, injuryStatus);

  // Determine ability tier once
  const currentKmEstimate = estimateCurrentKmFromBucket(currentKmBucket);
  const abilityTier = mapToAbilityTier(persona, currentKmEstimate);

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
  if (abilityTier === "elite" && currentKmEstimate >= 120) {
    notes.push("Elite volume — weeks built from your current 120km+ base; listen to your body.");
  }
  if (currentKmEstimate < 25 && (distance === "marathon" || distance === "50k" || distance === "80k" || distance === "100k_plus")) {
    notes.push("Introductory build block — focus on gradual progression and consistency.");
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
