import type { TrainingPlan, QuizAnswers, RunnerPersona, TrainingPlanPdfData } from './runmvmtTypes';

export function buildPdfContent(
  plan: TrainingPlan,
  answers: QuizAnswers,
  persona: RunnerPersona
): TrainingPlanPdfData {
  const distanceMap: Record<string, string> = {
    "5k": "5km",
    "10k": "10km",
    "half_marathon": "Half Marathon",
    "marathon": "Marathon",
    "50k": "50km Ultra",
    "80k": "80km Ultra",
    "100k_plus": "100km+ Ultra"
  };

  const goalLabelMap: Record<string, string> = {
    complete: "Complete the distance",
    pb: "Chase a new PB",
    race: "Race competitively",
    comfortable: "Run it comfortably",
    unsure: "Structured training block"
  };

  const distance = plan.distance;
  const goal = (plan.goal || "unsure") as keyof typeof goalLabelMap;

  const keyHighlights: string[] = [
    `12-week ${distanceMap[distance]} program tailored to your current level and lifestyle.`,
    `Weekly volume progresses safely from your current load towards an ideal range for your goal.`,
    `Mixture of long runs, quality sessions and easy runs matched to your preferred training frequency.`,
    persona.id === "returning_from_injury"
      ? "Extra focus on controlled progress and keeping niggles in check."
      : "Includes progressive quality work to help you move the needle week by week."
  ];

  const strengthGuidelines: string[] = (() => {
    const strength = answers["strength_training"] as string;
    if (strength === "no_not_interested") {
      return [
        "Strength training is optional, but even 1–2 short bodyweight sessions per week can reduce injury risk.",
      ];
    }
    if (strength === "no_but_open") {
      return [
        "Start with 1–2x per week. Focus on basic movements: squats, hinges, calf raises, lunges and core work.",
        "Keep strength work away from your hardest run sessions where possible (e.g. Mon & Thu if long run is Sunday)."
      ];
    }
    return [
      "Continue 2–3x strength sessions per week, prioritising lower body strength, calf/foot strength and trunk stability.",
      "Avoid pushing to failure the day before long runs or key workouts."
    ];
  })();

  const recoveryGuidelines: string[] = [
    "Aim for consistent sleep (7–9 hours where possible).",
    "Use easy days as truly easy — you should finish feeling like you could do more.",
    "If you feel unusually fatigued for 3+ days, reduce volume by 20–30% for a week before building again."
  ];

  const fuellingNotes: string[] =
    distance === "5k" || distance === "10k"
      ? [
          "For most 5–10km runs, normal daily nutrition plus a light snack 1–2 hours before is enough.",
          "For long runs over 75 minutes, practise taking small amounts of carbs (e.g. gels, sports drink) and water."
        ]
      : [
          "For long runs >75–90 minutes, aim for 30–60g of carbs per hour and regular fluid intake.",
          "Practise your race-day fuelling strategy in training so there are no surprises on race day."
        ];

  return {
    name: undefined,
    distanceLabel: distanceMap[distance],
    goalLabel: goalLabelMap[goal],
    personaLabel: persona.label,
    personaDescription: persona.description,
    keyHighlights,
    weeklyPlans: plan.weeklyStructure,
    strengthGuidelines,
    recoveryGuidelines,
    fuellingNotes,
    runMvmtBranding: {
      logoUrl: undefined,
      tagline: "RUN MVMT — Move as one.",
      coachNote:
        "This plan is a framework, not a prison. If life gets busy, drop a session, don't drop the week. Consistency beats perfection."
    }
  };
}


