import type { Distance } from '../runmvmtPlanGenerator';
import type { TrainingPhase } from './phaseProgression';
import type { AbilityTier } from './abilityTiers';

export interface SessionTemplate {
  type: string;
  description: string;
  durationKmOrMin: number;
  intensityHint: string;
  phase: TrainingPhase[];
  distance: Distance[];
  abilityTier?: AbilityTier[];
}

// Long Run Templates
export const LONG_RUN_TEMPLATES: Record<Distance, Record<TrainingPhase, SessionTemplate>> = {
  "5k": {
    foundation: {
      type: "Long Run",
      description: "Easy, conversational pace (RPE 3-4/10). You should be able to speak in full sentences. Focus on relaxed form, steady breathing, and time on feet. This builds aerobic base without adding stress.",
      durationKmOrMin: 10, // Will be adjusted
      intensityHint: "Easy",
      phase: ["foundation"],
      distance: ["5k"]
    },
    build: {
      type: "Long Run",
      description: "Easy, conversational pace (RPE 3-4/10). Build endurance gradually. Focus on consistent effort and good form throughout.",
      durationKmOrMin: 12,
      intensityHint: "Easy",
      phase: ["build"],
      distance: ["5k"]
    },
    peak: {
      type: "Long Run",
      description: "Easy long run (RPE 3-4/10). Maintain aerobic fitness while allowing recovery from quality sessions. Keep it relaxed.",
      durationKmOrMin: 14,
      intensityHint: "Easy",
      phase: ["peak"],
      distance: ["5k"]
    },
    taper: {
      type: "Long Run",
      description: "Shorter easy run (RPE 2-3/10). Maintain movement without adding fatigue. Very relaxed effort.",
      durationKmOrMin: 8,
      intensityHint: "Easy",
      phase: ["taper"],
      distance: ["5k"]
    }
  },
  "10k": {
    foundation: {
      type: "Long Run",
      description: "Easy, conversational pace (RPE 3-4/10). Build aerobic base. Focus on relaxed rhythm and consistent effort. You should finish feeling like you could run more.",
      durationKmOrMin: 14,
      intensityHint: "Easy",
      phase: ["foundation"],
      distance: ["10k"]
    },
    build: {
      type: "Long Run",
      description: "Easy long run (RPE 3-4/10). Gradually building distance. Focus on time on feet and aerobic development.",
      durationKmOrMin: 18,
      intensityHint: "Easy",
      phase: ["build"],
      distance: ["10k"]
    },
    peak: {
      type: "Long Run",
      description: "Easy long run (RPE 3-4/10). Maintain endurance while allowing recovery. Keep effort controlled.",
      durationKmOrMin: 20,
      intensityHint: "Easy",
      phase: ["peak"],
      distance: ["10k"]
    },
    taper: {
      type: "Long Run",
      description: "Shorter easy run (RPE 2-3/10). Maintain movement without fatigue. Very relaxed.",
      durationKmOrMin: 12,
      intensityHint: "Easy",
      phase: ["taper"],
      distance: ["10k"]
    }
  },
  "half_marathon": {
    foundation: {
      type: "Long Run",
      description: "Easy long run (RPE 3-4/10). Build endurance base. Focus on relaxed pace and consistent effort. You should finish feeling strong.",
      durationKmOrMin: 18,
      intensityHint: "Easy",
      phase: ["foundation"],
      distance: ["half_marathon"]
    },
    build: {
      type: "Long Run",
      description: "Easy long run (RPE 3-4/10). Gradually increasing distance. Build aerobic capacity and mental toughness.",
      durationKmOrMin: 21,
      intensityHint: "Easy",
      phase: ["build"],
      distance: ["half_marathon"]
    },
    peak: {
      type: "Long Run",
      description: "Long run with optional half-marathon pace segments. After 20 min easy, include 2-3 x 10 min at half-marathon effort with 3 min easy recovery. Finish easy. This sharpens race-specific fitness.",
      durationKmOrMin: 24,
      intensityHint: "Easy–Moderate (with HMP segments)",
      phase: ["peak"],
      distance: ["half_marathon"]
    },
    taper: {
      type: "Long Run",
      description: "Shorter easy run (RPE 2-3/10). Maintain fitness while allowing full recovery. Very relaxed effort.",
      durationKmOrMin: 16,
      intensityHint: "Easy",
      phase: ["taper"],
      distance: ["half_marathon"]
    }
  },
  "marathon": {
    foundation: {
      type: "Long Run",
      description: "Easy long run (RPE 3-4/10). Build endurance base gradually. Focus on time on feet and aerobic development. Keep it conversational.",
      durationKmOrMin: 28,
      intensityHint: "Easy",
      phase: ["foundation"],
      distance: ["marathon"]
    },
    build: {
      type: "Long Run",
      description: "Easy long run (RPE 3-4/10). Gradually building distance. Focus on consistent effort and good form. Practice fuelling if needed.",
      durationKmOrMin: 32,
      intensityHint: "Easy",
      phase: ["build"],
      distance: ["marathon"]
    },
    peak: {
      type: "Long Run",
      description: "Long run with marathon-pace blocks. Start with 15-20 min easy warm-up, then include 2-3 blocks of 10-15 min at marathon pace with 5 min easy recovery between. Finish with easy cooldown. This builds race-specific fitness and pacing confidence.",
      durationKmOrMin: 35,
      intensityHint: "Easy–Moderate (with MP blocks)",
      phase: ["peak"],
      distance: ["marathon"]
    },
    taper: {
      type: "Long Run",
      description: "Shorter easy run (RPE 2-3/10). Maintain movement without adding fatigue. Very relaxed effort.",
      durationKmOrMin: 20,
      intensityHint: "Easy",
      phase: ["taper"],
      distance: ["marathon"]
    }
  },
  "50k": {
    foundation: {
      type: "Long Run",
      description: "Easy long run (RPE 3-4/10). Focus on time on feet and building endurance. Start easy and stay controlled. Practice fuelling and hydration.",
      durationKmOrMin: 28,
      intensityHint: "Easy",
      phase: ["foundation"],
      distance: ["50k"]
    },
    build: {
      type: "Long Run",
      description: "Long run at easy to moderate effort (RPE 4-5/10). Build endurance and time on feet. Focus on terrain-specific adaptation if on trails. Practice race-day nutrition.",
      durationKmOrMin: 36,
      intensityHint: "Easy–Moderate",
      phase: ["build"],
      distance: ["50k"]
    },
    peak: {
      type: "Long Run",
      description: "Long run at easy to moderate effort (RPE 4-5/10). Focus on time on feet, terrain-specific adaptation, and fuelling practice. Start easy and stay controlled — the goal is duration, not pace.",
      durationKmOrMin: 40,
      intensityHint: "Easy–Moderate",
      phase: ["peak"],
      distance: ["50k"]
    },
    taper: {
      type: "Long Run",
      description: "Shorter easy run (RPE 2-3/10). Maintain movement while allowing full recovery. Very relaxed effort.",
      durationKmOrMin: 24,
      intensityHint: "Easy",
      phase: ["taper"],
      distance: ["50k"]
    }
  },
  "80k": {
    foundation: {
      type: "Long Run",
      description: "Easy long run (RPE 3-4/10). Focus on time on feet and building endurance base. Practice fuelling and terrain-specific movement.",
      durationKmOrMin: 36,
      intensityHint: "Easy",
      phase: ["foundation"],
      distance: ["80k"]
    },
    build: {
      type: "Long Run",
      description: "Long run at easy to moderate effort (RPE 4-5/10). Build endurance and mental toughness. Focus on consistent effort and fuelling strategy.",
      durationKmOrMin: 45,
      intensityHint: "Easy–Moderate",
      phase: ["build"],
      distance: ["80k"]
    },
    peak: {
      type: "Long Run",
      description: "Long run at easy to moderate effort (RPE 4-5/10). Focus on time on feet, terrain adaptation, and race-day simulation. Practice your complete fuelling and pacing strategy.",
      durationKmOrMin: 52,
      intensityHint: "Easy–Moderate",
      phase: ["peak"],
      distance: ["80k"]
    },
    taper: {
      type: "Long Run",
      description: "Shorter easy run (RPE 2-3/10). Maintain movement while allowing full recovery.",
      durationKmOrMin: 32,
      intensityHint: "Easy",
      phase: ["taper"],
      distance: ["80k"]
    }
  },
  "100k_plus": {
    foundation: {
      type: "Long Run",
      description: "Easy long run (RPE 3-4/10). Focus on time on feet and building endurance. Practice fuelling, hydration, and terrain-specific movement.",
      durationKmOrMin: 40,
      intensityHint: "Easy",
      phase: ["foundation"],
      distance: ["100k_plus"]
    },
    build: {
      type: "Long Run",
      description: "Long run at easy to moderate effort (RPE 4-5/10). Build endurance and mental resilience. Focus on consistent effort and complete fuelling strategy.",
      durationKmOrMin: 50,
      intensityHint: "Easy–Moderate",
      phase: ["build"],
      distance: ["100k_plus"]
    },
    peak: {
      type: "Long Run",
      description: "Long run at easy to moderate effort (RPE 4-5/10). Focus on time on feet, terrain adaptation, and race-day simulation. Practice your complete strategy — pacing, fuelling, mental approach.",
      durationKmOrMin: 60,
      intensityHint: "Easy–Moderate",
      phase: ["peak"],
      distance: ["100k_plus"]
    },
    taper: {
      type: "Long Run",
      description: "Shorter easy run (RPE 2-3/10). Maintain movement while allowing full recovery.",
      durationKmOrMin: 36,
      intensityHint: "Easy",
      phase: ["taper"],
      distance: ["100k_plus"]
    }
  }
};

// Quality Session Templates by Distance and Phase
export function getQualitySessionTemplate(
  distance: Distance,
  phase: TrainingPhase,
  weekNumber: number,
  abilityTier: AbilityTier
): SessionTemplate {
  // 5k/10k sessions
  if (distance === "5k" || distance === "10k") {
    if (phase === "foundation" || weekNumber < 5) {
      return {
        type: "Tempo / Threshold",
        description: distance === "5k" 
          ? "15-25 min continuous tempo at comfortably hard effort (RPE 6-7/10). You should be able to say 2-3 words at a time. Start conservatively and build into it. This improves your lactate threshold — the pace you can sustain for 20-30 minutes."
          : "20-30 min continuous tempo at threshold pace (RPE 6-7/10). This is comfortably hard — not all-out, but definitely not easy. Focus on even effort throughout. This builds the fitness you need for sustained 10k effort.",
        durationKmOrMin: 8,
        intensityHint: "Moderate–Hard",
        phase: ["foundation", "build"],
        distance: [distance]
      };
    } else {
      return {
        type: "Intervals",
        description: distance === "5k"
          ? "8 x 400m or 6 x 800m at 5k race pace with full recovery (2-3 min walk/jog). These intervals improve speed and efficiency. Focus on smooth, controlled pace — not all-out sprinting."
          : "6 x 1km or 5 x 1.2km at 10k race pace with 90 sec-2 min recovery. These intervals build race-specific fitness. Start slightly conservative and finish strong.",
        durationKmOrMin: 8,
        intensityHint: "Hard",
        phase: ["build", "peak"],
        distance: [distance]
      };
    }
  }
  
  // Half marathon sessions
  if (distance === "half_marathon") {
    if (phase === "foundation" || weekNumber < 5) {
      return {
        type: "Threshold Intervals",
        description: "4-6 x 5 min at threshold pace (comfortably hard, RPE 6-7/10) with 1 min easy recovery. These intervals build sustained power without the stress of continuous tempo. Focus on consistent effort across all intervals.",
        durationKmOrMin: 8,
        intensityHint: "Moderate–Hard",
        phase: ["foundation", "build"],
        distance: ["half_marathon"]
      };
    } else {
      return {
        type: "Continuous Tempo",
        description: "20-40 min continuous tempo at half-marathon effort (RPE 6-7/10). This is your race pace — sustainable but challenging. Start conservatively and build into it. This is the key session for half-marathon fitness.",
        durationKmOrMin: 10,
        intensityHint: "Moderate–Hard",
        phase: ["build", "peak"],
        distance: ["half_marathon"]
      };
    }
  }
  
  // Marathon sessions
  if (distance === "marathon") {
    if (phase === "foundation" || weekNumber < 5) {
      return {
        type: "Threshold Work",
        description: "Continuous tempo or cruise intervals at threshold pace (RPE 6-7/10). Option 1: 20-30 min continuous. Option 2: 3-4 x 8-10 min with 2 min recovery. This builds the aerobic power you need for marathon pace.",
        durationKmOrMin: 10,
        intensityHint: "Moderate–Hard",
        phase: ["foundation", "build"],
        distance: ["marathon"]
      };
    } else {
      if (weekNumber >= 7 && weekNumber <= 9) {
        return {
          type: "Marathon Pace",
          description: "Marathon-pace blocks: 3-4 x 15-20 min at goal marathon pace with 3-4 min easy recovery. This is race-specific training. Practice your race-day pacing and fuelling. Start conservatively — marathon pace should feel controlled.",
          durationKmOrMin: 12,
          intensityHint: "Moderate (Marathon Pace)",
          phase: ["peak"],
          distance: ["marathon"]
        };
      } else {
        return {
          type: "Marathon Pace",
          description: "Marathon-pace work: 2-3 x 10-15 min at goal marathon pace with 3-4 min easy recovery. This builds race-specific fitness and pacing confidence. Focus on smooth, controlled effort.",
          durationKmOrMin: 10,
          intensityHint: "Moderate (Marathon Pace)",
          phase: ["build", "peak"],
          distance: ["marathon"]
        };
      }
    }
  }
  
  // Ultra sessions
  return {
    type: "Steady Effort",
    description: "Longer steady aerobic effort (RPE 5-6/10). Keep it controlled and sustainable — you should finish feeling strong. This builds the endurance base crucial for ultra-distance events. Focus on time on feet and consistent effort.",
    durationKmOrMin: 10,
    intensityHint: "Moderate",
    phase: ["foundation", "build", "peak"],
    distance: ["50k", "80k", "100k_plus"]
  };
}

// Secondary quality session (for 2 quality session weeks)
export function getSecondaryQualitySession(
  distance: Distance,
  phase: TrainingPhase,
  weekNumber: number
): SessionTemplate {
  if (distance === "50k" || distance === "80k" || distance === "100k_plus") {
    return {
      type: "Long Steady",
      description: "Extended steady effort at moderate intensity (RPE 5-6/10). This is longer than tempo but harder than easy. Builds aerobic capacity and mental toughness for ultra events. Stay controlled throughout.",
      durationKmOrMin: 12,
      intensityHint: "Moderate",
      phase: ["build", "peak"],
      distance: [distance]
    };
  } else {
    if (phase === "foundation" || weekNumber < 5) {
      return {
        type: "Strides / Leg Speed",
        description: "4-8 x 20-30 sec fast strides at the end of an easy run. Focus on quick, light turnover and good form. Full recovery between each (walk back to start). This improves running economy and leg speed without adding stress.",
        durationKmOrMin: 6,
        intensityHint: "Moderate",
        phase: ["foundation", "build"],
        distance: ["5k", "10k", "half_marathon", "marathon"]
      };
    } else {
      return {
        type: "Intervals / Hills",
        description: "Shorter intervals or hill reps for leg speed and power. 5-6 x 60-90 sec at hard effort with full recovery. Builds race-specific speed and strength.",
        durationKmOrMin: 6,
        intensityHint: "Hard",
        phase: ["build", "peak"],
        distance: ["5k", "10k", "half_marathon", "marathon"]
      };
    }
  }
}


