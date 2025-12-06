export type QuestionType =
  | "single_choice"
  | "multi_choice"
  | "number"
  | "text"
  | "date"
  | "time_duration";

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  section: string;
  question: string;
  type: QuestionType;
  options?: QuizOption[];
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

export type AnswerValue = string | number | string[] | null;

export type Distance = "5k" | "10k" | "half_marathon" | "marathon" | "50k" | "80k" | "100k_plus";

export interface QuizAnswers {
  [questionId: string]: AnswerValue;
}

export interface RunnerPersona {
  id: string;
  label: string;
  description: string;
}

export interface Session {
  day: string;
  type: string;
  description: string;
  durationKmOrMin?: number;
  intensityHint?: string;
}

export interface WeeklyPlan {
  week: number;
  targetKm: number;
  keySessions: Session[];
  focus: string;
}

export interface TrainingPlan {
  distance: string;
  goal: string;
  durationWeeks: number;
  weeklyStructure: WeeklyPlan[];
  persona: RunnerPersona;
  notes: string[];
}

export interface TrainingPlanPdfData {
  name?: string;
  distanceLabel: string;
  goalLabel: string;
  personaLabel: string;
  personaDescription: string;
  keyHighlights: string[];
  weeklyPlans: WeeklyPlan[];
  strengthGuidelines: string[];
  recoveryGuidelines: string[];
  fuellingNotes: string[];
  runMvmtBranding: {
    logoUrl?: string;
    tagline: string;
    coachNote: string;
  };
}


