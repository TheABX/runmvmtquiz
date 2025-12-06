import type { Scores } from './types';

export function getGrowthPriorities(scores: Scores): string[] {
  const priorities: string[] = [];

  if (scores.selfFrame < 3) {
    priorities.push("Strengthening your frame & boundaries");
  }
  if (scores.neuroticism > 3.5) {
    priorities.push("Stabilising emotional reactivity");
  }
  if (scores.goalOrientation < 3) {
    priorities.push("Clarifying life direction & standards");
  }
  if (scores.anxiety > 3.5) {
    priorities.push("Reducing dating anxiety & overthinking");
  }
  if (scores.avoidance > 3.5) {
    priorities.push("Opening up to emotional connection");
  }
  if (scores.conscientiousness < 3) {
    priorities.push("Building consistency & reliability");
  }
  if (scores.transformational < 3) {
    priorities.push("Developing leadership in relationships");
  }

  return priorities.slice(0, 3);
}


