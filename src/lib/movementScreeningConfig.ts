export interface MovementTest {
  id: string
  name: string
  whatItTests: string
  instructions: string[]
  scoring: {
    score2: string
    score1: string
    score0: string
  }
  hasLeftRight: boolean
}

export const MOVEMENT_TESTS: MovementTest[] = [
  {
    id: "test1_single_leg_squat",
    name: "Single-Leg Squat",
    whatItTests: "Hip stability, knee tracking, ankle control",
    instructions: [
      "Stand on one leg",
      "Put your arms straight out in front",
      "Slowly bend your knee and drop into a small squat",
      "Go as low as YOU can while staying balanced",
      "Return to standing",
      "Do 5 reps per leg"
    ],
    scoring: {
      score2: "Knee stays straight, no wobble, balanced, smooth",
      score1: "A bit shaky, knee drifts in slightly, depth limited",
      score0: "Very wobbly, knee collapses inward, can't stay balanced, pain"
    },
    hasLeftRight: true
  },
  {
    id: "test2_ankle_mobility",
    name: "Ankle Mobility (Knee to Wall)",
    whatItTests: "Calf/Achilles flexibility needed for proper running mechanics",
    instructions: [
      "Sit in a half-kneeling position facing a wall",
      "Place one foot on the floor with toes ~5–10cm from the wall",
      "Keeping your heel flat, try to touch your knee to the wall",
      "If the heel lifts, move closer",
      "If it's easy, move slightly back"
    ],
    scoring: {
      score2: "Knee touches wall without heel lifting",
      score1: "Knee touches wall only when very close (minimal range)",
      score0: "Heel lifts OR knee can't touch the wall"
    },
    hasLeftRight: true
  },
  {
    id: "test3_calf_raise",
    name: "Single-Leg Calf Raise",
    whatItTests: "Calf strength (critical for running stride and injury prevention)",
    instructions: [
      "Stand on one leg near a wall for support",
      "Lift your heel as high as possible",
      "Lower slowly",
      "Repeat until your technique breaks down",
      "Count reps"
    ],
    scoring: {
      score2: "20+ reps, high heel, smooth tempo",
      score1: "10–19 reps OR heel height low",
      score0: "<10 reps OR poor control OR pain"
    },
    hasLeftRight: true
  },
  {
    id: "test4_hip_hinge",
    name: "Single-Leg Hip Hinge",
    whatItTests: "Glute and hamstring control + balance",
    instructions: [
      "Stand on one leg",
      "Keep a slight bend in your standing leg",
      "Lean forward and lift your opposite leg behind you",
      "Body and back leg move in one straight line",
      "Do 5 slow reps per leg"
    ],
    scoring: {
      score2: "Hips level, smooth movement, no twisting",
      score1: "Small wobble, hips rotate slightly",
      score0: "Major wobble, twisting, can't balance"
    },
    hasLeftRight: true
  },
  {
    id: "test5_side_plank",
    name: "Side Plank",
    whatItTests: "Lateral core strength and hip stability (huge for runners)",
    instructions: [
      "Lie on your side",
      "Elbow under shoulder",
      "Lift hips off the ground into a straight line",
      "Hold"
    ],
    scoring: {
      score2: "30+ seconds with no sag or twist",
      score1: "15–29 seconds OR slight dip",
      score0: "<15 seconds OR any hip pain"
    },
    hasLeftRight: true
  },
  {
    id: "test6_t_spine",
    name: "T-Spine Rotation",
    whatItTests: "Upper-back mobility for posture and breathing efficiency",
    instructions: [
      "Sit on heels OR half kneel",
      "Place one hand behind your head",
      "Rotate your elbow toward the ceiling",
      "Then rotate down toward the opposite elbow",
      "Do 5 reps per side"
    ],
    scoring: {
      score2: "Smooth rotation both ways, no restriction",
      score1: "Moderate stiffness, partial range",
      score0: "Very limited rotation OR pain"
    },
    hasLeftRight: true
  },
  {
    id: "test7_overhead_squat",
    name: "Overhead Squat",
    whatItTests: "Full-body mobility + stability",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Raise your arms overhead",
      "Squat as low as feels comfortable",
      "Keep arms overhead the whole time",
      "Do 5 reps"
    ],
    scoring: {
      score2: "Arms stay up, heels down, torso upright",
      score1: "Arms drop forward OR heels lift slightly",
      score0: "Major lean, heels lift fully, or can't squat to half depth"
    },
    hasLeftRight: false
  }
]

export const getPathway = (totalScore: number): string => {
  if (totalScore >= 12) return "Performance Pathway"
  if (totalScore >= 8) return "Balanced Strength Pathway"
  return "Foundation Pathway"
}

export const getPathwayDescription = (pathway: string): string => {
  switch (pathway) {
    case "Performance Pathway":
      return "You have great movement quality. You'll go into higher-level strength training."
    case "Balanced Strength Pathway":
      return "Some mobility or stability gaps. You'll build strength + fix gaps."
    case "Foundation Pathway":
      return "Movement quality is limited. You'll start with mobility + basic strength + stability."
    default:
      return ""
  }
}

