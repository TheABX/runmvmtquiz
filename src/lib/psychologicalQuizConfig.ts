import type { QuizQuestion } from './runmvmtTypes';

export const PSYCHOLOGICAL_QUESTIONS: QuizQuestion[] = [
  {
    id: "main_challenge",
    section: "Mindset Assessment",
    question: "When it comes to running, what's the biggest mental challenge you feel right now?",
    type: "single_choice",
    required: true,
    options: [
      { id: "performance_anxiety", label: "Performance anxiety before sessions or races" },
      { id: "negative_self_talk", label: "Negative self-talk or overthinking when it gets hard" },
      { id: "pacing_anxiety", label: "Judging myself too early / pacing anxiety" },
      { id: "bad_sessions", label: "Getting upset or thrown off by bad sessions" },
      { id: "motivation", label: "Motivation / consistency is my main struggle" },
      { id: "none", label: "None of these feel major for me" }
    ]
  },
  {
    id: "uncomfortable_response",
    section: "Mindset Assessment",
    question: "When things start to feel uncomfortable, what's the first thing your mind usually does?",
    type: "single_choice",
    required: true,
    options: [
      { id: "panic", label: "Panic or tighten up mentally" },
      { id: "doubt", label: "Start doubting myself or assuming I can't hold it" },
      { id: "overthink", label: "Overthink pace, splits, or how long is left" },
      { id: "bad_day", label: "Tell myself I'm having a bad day" },
      { id: "compare", label: "Compare myself to others or past performances" },
      { id: "settle", label: "Nothing major happens — I usually just settle into it" }
    ]
  },
  {
    id: "bad_session_response",
    section: "Mindset Assessment",
    question: "How do you usually respond to bad sessions or days where the run doesn't go to plan?",
    type: "single_choice",
    required: true,
    options: [
      { id: "frustrated", label: "I get frustrated and think it means I'm going backwards" },
      { id: "doubt_fitness", label: "I doubt my fitness for the next few days" },
      { id: "analyse", label: "I analyse everything and overthink what went wrong" },
      { id: "affects_me", label: "I brush it off eventually but it affects me at first" },
      { id: "doesnt_affect", label: "It doesn't affect me much" },
      { id: "rarely_bad", label: "I rarely have 'bad session' reactions" }
    ]
  },
  {
    id: "pre_run_state",
    section: "Mindset Assessment",
    question: "Before key sessions or races, which of these best describes you?",
    type: "single_choice",
    required: true,
    options: [
      { id: "nervous", label: "I get nervous and feel pressure to perform" },
      { id: "think_pace", label: "I think a lot about hitting the right pace or outcome" },
      { id: "worry_flat", label: "I worry about feeling heavy or flat" },
      { id: "excited_tense", label: "I feel excited but maybe a bit tense" },
      { id: "calm", label: "I stay calm and just get into it" },
      { id: "no_reaction", label: "I don't really have a pre-run emotional reaction" }
    ]
  }
];

// Logic to determine which section to show
export const getMindsetSection = (answers: Record<string, any>): string => {
  const mainChallenge = answers.main_challenge;
  
  if (mainChallenge === "performance_anxiety") return "performance_anxiety";
  if (mainChallenge === "negative_self_talk") return "negative_self_talk";
  if (mainChallenge === "pacing_anxiety") return "pacing_anxiety";
  if (mainChallenge === "bad_sessions") return "bad_sessions";
  if (mainChallenge === "motivation") {
    // Redirect motivation to overthinking or pacing based on Q2
    const uncomfortable = answers.uncomfortable_response;
    if (uncomfortable === "overthink" || uncomfortable === "doubt") return "negative_self_talk";
    return "pacing_anxiety";
  }
  
  // If "none", use Q2 to determine
  const uncomfortable = answers.uncomfortable_response;
  if (uncomfortable === "panic" || uncomfortable === "doubt") return "negative_self_talk";
  if (uncomfortable === "overthink") return "pacing_anxiety";
  return "performance_anxiety";
};

// Get personalized intro line
export const getPersonalizedIntro = (answers: Record<string, any>, section: string): string => {
  if (section === "performance_anxiety") {
    const preRun = answers.pre_run_state;
    if (preRun === "nervous") return "It sounds like you feel pressure before key sessions or races — that's extremely common, even in elite athletes.";
    if (preRun === "think_pace") return "You mentioned you think a lot about outcomes before you start — this creates that nervous energy.";
    if (preRun === "worry_flat") return "A lot of runners worry about how they'll feel before they even start — it's not a sign of weakness, just your body switching into 'protect' mode.";
    if (preRun === "excited_tense") return "It looks like you feel that mix of excitement and tension — very normal before important runs.";
    return "Even when you feel mostly calm, those small nerves before a run are extremely common.";
  }
  
  if (section === "negative_self_talk") {
    const uncomfortable = answers.uncomfortable_response;
    if (uncomfortable === "panic") return "It looks like your mind gets a bit loud when things get tough — that's something almost every runner deals with.";
    if (uncomfortable === "doubt") return "You mentioned that you tend to doubt yourself during sessions, which is a very normal response to rising effort.";
    if (uncomfortable === "overthink") return "Your answers show you're aware of how your thoughts affect your running — that awareness alone is a strength.";
    if (uncomfortable === "bad_day") return "You mentioned assuming the worst early — this is a common pattern runners can learn to manage.";
    return "It seems like comparison creeps in when things feel tough — you're definitely not alone there.";
  }
  
  if (section === "pacing_anxiety") {
    const preRun = answers.pre_run_state;
    if (preRun === "think_pace" || preRun === "nervous") return "It sounds like you often judge your run early or stress about whether you can hold the pace — this is one of the most common patterns in running.";
    if (preRun === "worry_flat") return "Many runners misread the first few minutes of a run and assume something is wrong — your answers suggest you've felt this too.";
    return "You mentioned feeling unsure early in your runs — that's completely normal, and it's actually physiological, not mental.";
  }
  
  if (section === "bad_sessions") {
    const badSession = answers.bad_session_response;
    if (badSession === "frustrated") return "It seems like bad sessions hit you hard mentally — that's incredibly common for runners who care about improving.";
    if (badSession === "doubt_fitness") return "You mentioned doubting your fitness after off days — this happens to most runners.";
    if (badSession === "analyse") return "Your answers show you think a lot about what went wrong — totally normal.";
    return "It hits you at first but settles — that's a sign you care about improvement.";
  }
  
  return "Based on your answers, here are some practical strategies that will help.";
};

// Get strength based on answers
export const getStrength = (answers: Record<string, any>): string => {
  const preRun = answers.pre_run_state;
  const uncomfortable = answers.uncomfortable_response;
  const badSession = answers.bad_session_response;
  
  if (preRun === "calm") return "calmness";
  if (uncomfortable === "settle") return "resilience";
  if (badSession === "doesnt_affect" || badSession === "rarely_bad") return "emotional recovery";
  if (answers.main_challenge === "motivation") return "awareness";
  return "determination";
};

// Get section title
export const getSectionTitle = (section: string): string => {
  switch (section) {
    case "performance_anxiety":
      return "Performance Anxiety";
    case "negative_self_talk":
      return "Negative Self-Talk & Overthinking";
    case "pacing_anxiety":
      return "Pacing Anxiety (The 2km Rule)";
    case "bad_sessions":
      return "Emotional Recovery From Bad Sessions";
    default:
      return "High-Performance Mindset";
  }
};

