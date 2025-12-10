export type TrainingPhase = "foundation" | "build" | "peak" | "taper";

export interface PhaseConfig {
  id: TrainingPhase;
  label: string;
  description: string;
  weekRanges: number[][];
  volumeTrend: "increasing" | "stable" | "decreasing";
  qualityFocus: string;
}

export const TRAINING_PHASES: Record<TrainingPhase, PhaseConfig> = {
  foundation: {
    id: "foundation",
    label: "Foundation & Adaptation",
    description: "Building base fitness and establishing consistent training habits",
    weekRanges: [[1, 3]],
    volumeTrend: "increasing",
    qualityFocus: "Aerobic base building, minimal intensity"
  },
  build: {
    id: "build",
    label: "Progressive Build",
    description: "Increasing volume and introducing race-specific training",
    weekRanges: [[4, 7]],
    volumeTrend: "increasing",
    qualityFocus: "Threshold work and race-pace introduction"
  },
  peak: {
    id: "peak",
    label: "Peak Fitness & Race Prep",
    description: "Sharpening fitness and practicing race-specific efforts",
    weekRanges: [[8, 10]],
    volumeTrend: "stable",
    qualityFocus: "Race-specific pace work and sharpening"
  },
  taper: {
    id: "taper",
    label: "Taper & Race Readiness",
    description: "Reducing volume to ensure freshness for race day",
    weekRanges: [[11, 12]],
    volumeTrend: "decreasing",
    qualityFocus: "Maintain sharpness with reduced volume"
  }
};

export function getPhaseForWeek(weekNumber: number, goalType?: string): TrainingPhase {
  if (weekNumber <= 3) {
    return "foundation";
  } else if (weekNumber <= 7) {
    return "build";
  } else if (weekNumber <= 10) {
    return "peak";
  } else {
    // Weeks 11-12
    if (goalType === "unsure") {
      return "build"; // Light consolidation, not full taper
    }
    return "taper";
  }
}

export function getPhaseLabel(weekNumber: number, goalType?: string): string {
  const phase = getPhaseForWeek(weekNumber, goalType);
  return TRAINING_PHASES[phase].label;
}

export function getPhaseDescription(weekNumber: number, goalType?: string): string {
  const phase = getPhaseForWeek(weekNumber, goalType);
  const config = TRAINING_PHASES[phase];
  
  if (phase === "peak" && (goalType === "race" || goalType === "pb")) {
    return "Peak Fitness & Race Prep — Sharpening fitness and practicing race-specific efforts";
  } else if (phase === "taper" && goalType === "unsure") {
    return "Consolidation & Maintenance — Holding fitness while allowing recovery";
  }
  
  return config.description;
}


