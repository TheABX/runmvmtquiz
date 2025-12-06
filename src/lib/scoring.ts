import type { Scores, Level, AttachmentStyle } from './types';

// Calculate 7 subscale scores from answers
export function calculateScores(answers: Array<{ id: number; value: number }>): Scores {
  // Group questions by subscale based on content
  // Anxiety: Questions about insecurity, fear, validation seeking
  const anxietyQuestions = [12, 14, 15, 16]; // Q12: avoid dating, Q14: chase validation, Q15: stay in bad situations, Q16: earn approval
  
  // Avoidance: Questions about losing interest, repeating cycles, emotional distance
  const avoidanceQuestions = [11, 13, 22, 23]; // Q11: lose interest, Q13: repeat cycles, Q22: emotionally open (reverse), Q23: safe expressing (reverse)
  
  // Neuroticism: Questions about emotional understanding and stability
  const neuroticismQuestions = [3, 7, 8, 19]; // Q3: understand emotions (reverse), Q7: stay relaxed (reverse), Q8: feel secure (reverse), Q19: stay calm (reverse)
  
  // Conscientiousness: Questions about consistency, boundaries, communication
  const conscientiousnessQuestions = [5, 18, 25]; // Q5: show up consistently, Q18: set boundaries, Q25: communicate honestly
  
  // Transformational/Leadership: Questions about leading, purpose
  const transformationalQuestions = [17, 21]; // Q17: lead confidently, Q21: prioritise mission
  
  // SelfFrame: Questions about confidence, worth, boundaries
  const selfFrameQuestions = [1, 9, 20, 24]; // Q1: feel confident, Q9: worthy of connection, Q20: say no, Q24: recognize healthy vs toxic
  
  // GoalOrientation: Questions about knowing what you want, attracting, expressing, deserving
  const goalOrientationQuestions = [2, 4, 6, 10, 26, 27]; // Q2: know what I want, Q4: attract type I want, Q6: confident approaching, Q10: express myself, Q26: deserve relationship, Q27: ready to grow
  
  // Questions that need reverse scoring (6 - value)
  // These are questions where higher agreement = lower score on the trait
  // For anxiety: none (all are positive indicators of anxiety)
  // For avoidance: 22, 23 (being open/expressive = lower avoidance)
  // For neuroticism: 3, 7, 8, 19 (understanding/staying calm = lower neuroticism)
  const reverseScored = [22, 23, 3, 7, 8, 19];
  
  function averageQuestions(questionIds: number[]): number {
    const relevantAnswers = answers
      .filter(a => questionIds.includes(a.id))
      .map(a => {
        // Reverse score if needed
        return reverseScored.includes(a.id) ? 6 - a.value : a.value;
      });
    
    if (relevantAnswers.length === 0) return 0;
    const sum = relevantAnswers.reduce((acc, val) => acc + val, 0);
    return sum / relevantAnswers.length;
  }
  
  return {
    anxiety: averageQuestions(anxietyQuestions),
    avoidance: averageQuestions(avoidanceQuestions),
    neuroticism: averageQuestions(neuroticismQuestions),
    conscientiousness: averageQuestions(conscientiousnessQuestions),
    transformational: averageQuestions(transformationalQuestions),
    selfFrame: averageQuestions(selfFrameQuestions),
    goalOrientation: averageQuestions(goalOrientationQuestions),
  };
}

// Classify level: Low (1.0–2.5), Medium (2.6–3.5), High (3.6–5.0)
export function classifyLevel(score: number): Level {
  if (score <= 2.5) return "low";
  if (score <= 3.5) return "medium";
  return "high";
}

// Classify attachment style from anxiety + avoidance scores
export function classifyAttachment(scores: Scores): AttachmentStyle {
  const { anxiety, avoidance } = scores;
  
  if (anxiety <= 2.5 && avoidance <= 2.5) return "secure";
  if (anxiety >= 3.6 && avoidance <= 2.5) return "anxious_preoccupied";
  if (anxiety <= 2.5 && avoidance >= 3.6) return "dismissive_avoidant";
  if (anxiety >= 3.6 && avoidance >= 3.6) return "fearful_avoidant";
  
  // Handle mid-range cases
  if (anxiety > 2.5 && anxiety < 3.6 && avoidance <= 2.5) return "anxious_preoccupied";
  if (anxiety <= 2.5 && avoidance > 2.5 && avoidance < 3.6) return "dismissive_avoidant";
  
  return "fearful_avoidant";
}

