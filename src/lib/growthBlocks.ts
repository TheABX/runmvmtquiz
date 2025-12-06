import type { Scores } from './types';

export type GrowthBlock = {
  title: string;
  actions: string[];
};

export const growthBlocks: Record<string, GrowthBlock> = {
  highAnxiety: {
    title: "Soften Anxiety & Overthinking",
    actions: [
      "Pause before texting: wait 15–30 minutes when you feel triggered, then respond from a calmer state.",
      "Limit checking their socials to once per day maximum.",
      "Once a week, journal: 'What story am I telling myself vs. what I actually know?'",
      "Practice the 5-4-3-2-1 grounding technique when you feel anxious: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
    ]
  },
  lowFrame: {
    title: "Strengthen Self-Respect & Boundaries",
    actions: [
      "Write a list of 5 non-negotiables in dating and keep it in your notes. Review it weekly.",
      "If someone repeatedly flakes, communicate it once clearly instead of chasing: 'I notice plans keep changing. Let me know when you're ready to commit to something.'",
      "Once a week, ask: 'Did I lower my standards to keep this connection?' Be honest with yourself.",
      "Practice saying no to one thing per week that doesn't align with your values, even if it's small.",
    ]
  },
  lowDirection: {
    title: "Clarify Life Direction & Purpose",
    actions: [
      "Write down 3 things you want your life to look like in 12 months. Be specific.",
      "Block 2 hours a week as 'non-negotiable progress time' toward one goal.",
      "Check in weekly: 'Does this person fit the life I'm building, or distract from it?'",
      "Create a vision board or written description of your ideal relationship dynamic.",
    ]
  },
  highNeuroticism: {
    title: "Stabilise Emotional Reactivity",
    actions: [
      "When you feel emotionally triggered, take 3 deep breaths before responding to anything.",
      "Keep a 'reaction log' for one week: note when you overreacted and what triggered it.",
      "Practice daily: 10 minutes of meditation or breathing exercises to build emotional regulation.",
      "Before making dating decisions when emotional, wait 24 hours and reassess.",
    ]
  },
  highAvoidance: {
    title: "Open Up to Emotional Connection",
    actions: [
      "Practice sharing one genuine feeling per week with someone you trust (friend, family, or date).",
      "When you feel like pulling away, pause and ask: 'What am I actually afraid of here?'",
      "Commit to staying present during one difficult conversation per week instead of shutting down.",
      "Write down 3 things you appreciate about someone you're dating, and share one of them.",
    ]
  },
  lowConscientiousness: {
    title: "Build Consistency & Reliability",
    actions: [
      "If you say you'll call or plan something, put it in your calendar immediately and set a reminder.",
      "Follow through on one small commitment per day, even if it's just to yourself.",
      "Before making plans, check your calendar first. Only commit to what you can actually do.",
      "Send a quick 'running 10 min late' text if needed. Small communication builds big trust.",
    ]
  },
  lowLeadership: {
    title: "Develop Leadership in Relationships",
    actions: [
      "Take the lead in planning one date per week. Have 2-3 options ready and present them confidently.",
      "Practice making decisions without asking for permission: 'I was thinking we could try X. Sound good?'",
      "Lead conversations by asking deeper questions: 'What's something you're excited about right now?'",
      "Take responsibility for your part in any conflict instead of deflecting or avoiding.",
    ]
  },
};

export function buildPlanBlocks(scores: Scores): GrowthBlock[] {
  const plan: GrowthBlock[] = [];

  if (scores.anxiety > 3.5) plan.push(growthBlocks.highAnxiety);
  if (scores.selfFrame < 3) plan.push(growthBlocks.lowFrame);
  if (scores.goalOrientation < 3) plan.push(growthBlocks.lowDirection);
  if (scores.neuroticism > 3.5) plan.push(growthBlocks.highNeuroticism);
  if (scores.avoidance > 3.5) plan.push(growthBlocks.highAvoidance);
  if (scores.conscientiousness < 3) plan.push(growthBlocks.lowConscientiousness);
  if (scores.transformational < 3) plan.push(growthBlocks.lowLeadership);

  // Prioritize: frame and anxiety are usually most impactful
  const priorityOrder = ['lowFrame', 'highAnxiety', 'highNeuroticism', 'lowDirection', 'highAvoidance', 'lowConscientiousness', 'lowLeadership'];
  const sorted = plan.sort((a, b) => {
    const aKey = Object.keys(growthBlocks).find(key => growthBlocks[key] === a) || '';
    const bKey = Object.keys(growthBlocks).find(key => growthBlocks[key] === b) || '';
    return priorityOrder.indexOf(aKey) - priorityOrder.indexOf(bKey);
  });

  return sorted.slice(0, 3); // Top 3 focus areas
}


