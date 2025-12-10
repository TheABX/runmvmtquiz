import type { QuizAnswers } from '../runmvmtTypes';

export interface VolumeModifier {
  volumeMultiplier: number;
  maxQualitySessionsReduction?: number;
  recoveryDaysIncrease?: number;
  description: string;
}

export interface LifestyleModifier extends VolumeModifier {
  id: string;
  label: string;
}

export const LIFESTYLE_MODIFIERS: Record<string, LifestyleModifier> = {
  desk: {
    id: "desk",
    label: "Lots of sitting / office work",
    volumeMultiplier: 1.0, // No reduction, but note about movement
    description: "Sitting most of the day - running helps counteract stiffness. Focus on good posture and post-run mobility."
  },
  mixed: {
    id: "mixed",
    label: "Mix of movement and desk work",
    volumeMultiplier: 1.0,
    description: "Balanced lifestyle - standard training approach applies."
  },
  active_job: {
    id: "active_job",
    label: "Active job (on your feet all day)",
    volumeMultiplier: 0.90, // 10% reduction
    maxQualitySessionsReduction: 0, // Keep quality but reduce volume
    description: "Already on your feet a lot - total life load is higher. Prioritize recovery and don't push through fatigue."
  },
  heavy_labour: {
    id: "heavy_labour",
    label: "Heavy labour / physically demanding work",
    volumeMultiplier: 0.85, // 15% reduction
    maxQualitySessionsReduction: 1, // Reduce quality sessions
    description: "Physically demanding work adds significant load. Reduce training volume and intensity to account for work stress."
  },
  parent_low_sleep: {
    id: "parent_low_sleep",
    label: "Parent with limited sleep",
    volumeMultiplier: 0.80, // 20% reduction
    maxQualitySessionsReduction: 1,
    recoveryDaysIncrease: 1,
    description: "Limited sleep affects recovery significantly. Reduce volume, prioritize sleep, and be flexible with training."
  },
  other_mix: {
    id: "other_mix",
    label: "A mix of the above",
    volumeMultiplier: 0.95, // Slight reduction
    description: "Mixed lifestyle factors - apply moderate adjustments."
  }
};

export const RECOVERY_MODIFIERS: Record<string, VolumeModifier> = {
  fast: {
    volumeMultiplier: 1.05, // Can handle slightly more
    description: "Fast recovery - you can handle higher training loads. Still prioritize rest days."
  },
  normal: {
    volumeMultiplier: 1.0,
    description: "Normal recovery - standard training approach."
  },
  sore: {
    volumeMultiplier: 0.90, // 10% reduction
    maxQualitySessionsReduction: 0, // Keep structure but reduce volume
    description: "Get sore easily - take extra time to warm up and cool down. Reduce volume if soreness persists."
  },
  burnt_out: {
    volumeMultiplier: 0.75, // 25% reduction
    maxQualitySessionsReduction: 1,
    recoveryDaysIncrease: 1,
    description: "Constantly tired or burnt out - significant volume reduction needed. Prioritize rest and recovery."
  }
};

export const INJURY_MODIFIERS: Record<string, VolumeModifier> = {
  none: {
    volumeMultiplier: 1.0,
    description: "No recent injuries - standard progression applies."
  },
  minor: {
    volumeMultiplier: 0.95, // Slight reduction
    description: "Minor niggles - be cautious with progression. Monitor and address issues early."
  },
  current: {
    volumeMultiplier: 0.70, // 30% reduction
    maxQualitySessionsReduction: 2, // No quality sessions initially
    description: "Currently injured - significant volume reduction. Focus on recovery and gradual return."
  },
  recurring: {
    volumeMultiplier: 0.80, // 20% reduction
    maxQualitySessionsReduction: 1,
    description: "Recurring injury issues - conservative progression with extra down-weeks. Prioritize strength work."
  }
};

export function applyModifiers(
  baseVolume: number,
  answers: QuizAnswers
): {
  adjustedVolume: number;
  maxQualitySessions: number;
  recoveryGuidance: string[];
} {
  const lifestyle = (answers["lifestyle"] as string) || "mixed";
  const recoveryFeel = (answers["recovery_feel"] as string) || "normal";
  const injuryStatus = (answers["injury_status"] as string) || "none";
  
  const lifestyleMod = LIFESTYLE_MODIFIERS[lifestyle] || LIFESTYLE_MODIFIERS.mixed;
  const recoveryMod = RECOVERY_MODIFIERS[recoveryFeel] || RECOVERY_MODIFIERS.normal;
  const injuryMod = INJURY_MODIFIERS[injuryStatus] || INJURY_MODIFIERS.none;
  
  // Apply multipliers (multiplicative)
  let adjustedVolume = baseVolume;
  adjustedVolume *= lifestyleMod.volumeMultiplier;
  adjustedVolume *= recoveryMod.volumeMultiplier;
  adjustedVolume *= injuryMod.volumeMultiplier;
  
  // Calculate quality session reduction
  let maxQualitySessions = 2; // Default
  if (lifestyleMod.maxQualitySessionsReduction) {
    maxQualitySessions -= lifestyleMod.maxQualitySessionsReduction;
  }
  if (recoveryMod.maxQualitySessionsReduction) {
    maxQualitySessions -= recoveryMod.maxQualitySessionsReduction;
  }
  if (injuryMod.maxQualitySessionsReduction) {
    maxQualitySessions -= injuryMod.maxQualitySessionsReduction;
  }
  maxQualitySessions = Math.max(0, maxQualitySessions);
  
  // Collect guidance
  const recoveryGuidance: string[] = [];
  if (lifestyleMod.description) recoveryGuidance.push(lifestyleMod.description);
  if (recoveryMod.description && recoveryFeel !== "normal") recoveryGuidance.push(recoveryMod.description);
  if (injuryMod.description && injuryStatus !== "none") recoveryGuidance.push(injuryMod.description);
  
  return {
    adjustedVolume: Math.round(adjustedVolume),
    maxQualitySessions,
    recoveryGuidance
  };
}


