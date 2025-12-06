export type Scores = {
  anxiety: number;          // Q1–Q5
  avoidance: number;        // Q6–Q10
  neuroticism: number;      // Q11–Q13
  conscientiousness: number;// Q14–Q16
  transformational: number; // Q17–Q19
  selfFrame: number;        // Q20–Q22
  goalOrientation: number;  // Q23–Q25
};

export type Level = "low" | "medium" | "high";

export type AttachmentStyle = 
  | "secure"
  | "anxious_preoccupied"
  | "dismissive_avoidant"
  | "fearful_avoidant";

