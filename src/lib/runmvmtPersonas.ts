import type { RunnerPersona, QuizAnswers } from './runmvmtTypes';

export const RUNNER_PERSONAS: RunnerPersona[] = [
  {
    id: "beginner_low_mileage",
    label: "Beginner — Low Mileage",
    description:
      "Newer to running or coming from a low base. Plan focuses on gradual progression, consistency and staying injury-free."
  },
  {
    id: "intermediate_builder",
    label: "Intermediate — Building Fitness",
    description:
      "Has some running history and can handle regular training. Plan balances speed, endurance and smart progression."
  },
  {
    id: "high_mileage_racer",
    label: "Advanced — High Mileage / Racer",
    description:
      "Experienced runner chasing performance or PBs. Plan includes demanding sessions, higher weekly volume and specific race prep."
  },
  {
    id: "returning_from_injury",
    label: "Returning from Injury",
    description:
      "Recent or recurring injury. Plan emphasises conservative progression, strength work and monitoring niggles."
  },
  {
    id: "time_poor_3_day",
    label: "Time-Poor 3-Day Runner",
    description:
      "Limited days available to train. Plan focuses on quality over quantity with key sessions each week."
  },
  {
    id: "ultra_trail_runner",
    label: "Ultra / Trail Focused",
    description:
      "Targeting long trail or ultra events. Plan emphasises long runs, hill strength and time-on-feet."
  }
];

export function classifyPersona(answers: QuizAnswers): RunnerPersona {
  const distance = answers["goal_distance"] as string;
  const currentKm = answers["current_weekly_km"] as string;
  const injury = answers["injury_status"] as string;
  const preferredDays = answers["preferred_days_per_week"] as string;
  const surface = answers["main_surface"] as string;

  // Injury first
  if (injury === "current" || injury === "recurring") {
    return RUNNER_PERSONAS.find(p => p.id === "returning_from_injury")!;
  }

  // Time-poor
  if (preferredDays === "2_3") {
    return RUNNER_PERSONAS.find(p => p.id === "time_poor_3_day")!;
  }

  // Ultra / trail
  if (["50k", "80k", "100k_plus"].includes(distance) || surface === "trail") {
    return RUNNER_PERSONAS.find(p => p.id === "ultra_trail_runner")!;
  }

  // Beginner vs intermediate vs advanced based on currentKm
  if (["<10", "10_30"].includes(currentKm)) {
    return RUNNER_PERSONAS.find(p => p.id === "beginner_low_mileage")!;
  }

  if (["30_50", "50_80"].includes(currentKm)) {
    return RUNNER_PERSONAS.find(p => p.id === "intermediate_builder")!;
  }

  // Big dogs
  return RUNNER_PERSONAS.find(p => p.id === "high_mileage_racer")!;
}


