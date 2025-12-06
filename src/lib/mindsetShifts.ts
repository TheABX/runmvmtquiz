import type { Scores } from './types';

export type MindsetShift = {
  old: string;
  new: string;
};

export const mindsetShiftsByCategory: Record<string, MindsetShift[]> = {
  anxiety: [
    {
      old: "I need reassurance to feel safe.",
      new: "My emotional security comes from me first."
    },
    {
      old: "If they don't reply fast, something's wrong.",
      new: "Silence is neutral — behaviour over time tells the truth."
    },
    {
      old: "I need to keep them interested.",
      new: "The right person stays because of connection, not performance."
    },
    {
      old: "I don't want to lose them.",
      new: "If I'm scared to lose them, I might be ignoring their ability to show up."
    },
    {
      old: "Rejection means I wasn't enough.",
      new: "Rejection means misalignment — not inadequacy."
    },
    {
      old: "If I don't act, they'll forget about me.",
      new: "If connection is real, space doesn't erase it."
    },
    {
      old: "I have to prove my value.",
      new: "My presence already carries value — I don't need to oversell."
    },
    {
      old: "They pulled back — I must fix it.",
      new: "If someone pulls away, I observe — not chase."
    },
    {
      old: "I'll wait to see if they like me.",
      new: "I'm evaluating whether I like how they show up."
    },
    {
      old: "I need answers now.",
      new: "Patience protects me from fantasy and reveals truth."
    },
    {
      old: "I must prevent losing them.",
      new: "If they're right for me, I don't need to hold them tightly."
    },
    {
      old: "Their response determines my emotional state.",
      new: "I regulate myself — not according to someone's availability."
    },
  ],
  avoidance: [
    {
      old: "Connection threatens my freedom.",
      new: "Closeness isn't confinement — it's expansion."
    },
    {
      old: "Emotions are messy.",
      new: "Emotions are information — not danger."
    },
    {
      old: "If I open up, I'll lose control.",
      new: "Vulnerability is clarity — not weakness."
    },
    {
      old: "People are unpredictable — avoid risk.",
      new: "Connection requires tolerance for uncertainty."
    },
    {
      old: "Space keeps things safe.",
      new: "Balanced closeness builds trust — not overwhelm."
    },
    {
      old: "I'll wait until I know for sure before engaging.",
      new: "Understanding comes from participating, not analysing from a distance."
    },
    {
      old: "I don't need anyone.",
      new: "Interdependence isn't dependence — it's maturity."
    },
    {
      old: "I'll handle it alone.",
      new: "Letting people in is strength — not burden."
    },
    {
      old: "Deep relationships cost too much.",
      new: "Meaningful relationships also give deeply."
    },
    {
      old: "I shouldn't rely on others.",
      new: "Healthy connection includes mutual reliance."
    },
    {
      old: "Keeping emotions neutral keeps me safe.",
      new: "Emotional honesty builds trust — even when imperfect."
    },
    {
      old: "If someone gets close, I might lose myself.",
      new: "I can be close AND maintain who I am."
    },
  ],
  neuroticism: [
    {
      old: "My feelings are facts.",
      new: "My feelings are signals — not instructions."
    },
    {
      old: "If I feel anxious, something's wrong.",
      new: "Anxiety can be conditioning — not reality."
    },
    {
      old: "I need to respond immediately.",
      new: "Pausing helps me respond rather than react."
    },
    {
      old: "Everything feels urgent.",
      new: "Urgency is a stress response — not guidance."
    },
    {
      old: "If I feel uncomfortable, something bad is happening.",
      new: "Growth often feels uncomfortable at first."
    },
    {
      old: "I can't handle uncertainty.",
      new: "I can tolerate uncertainty and remain grounded."
    },
    {
      old: "I need clarity now.",
      new: "Clarity comes from allowing time, not forcing answers."
    },
    {
      old: "Avoid discomfort.",
      new: "Discomfort is a teacher — not a threat."
    },
    {
      old: "My mind is spiralling — I must act.",
      new: "When my mind spirals, I slow down, breathe, and stay steady."
    },
    {
      old: "Something feels off — fix it.",
      new: "I observe before acting — not panic before thinking."
    },
    {
      old: "This is too much.",
      new: "I can handle difficult emotions and remain calm."
    },
    {
      old: "Strong feelings equal strong meaning.",
      new: "Intensity doesn't equal truth."
    },
  ],
  conscientiousness: [
    {
      old: "I'll start when I feel ready.",
      new: "Action creates readiness — not waiting."
    },
    {
      old: "If I can't do it perfectly, I won't do it.",
      new: "Progress beats perfection every time."
    },
    {
      old: "Consistency is hard.",
      new: "Consistency is a skill — and skills improve with practice."
    },
    {
      old: "I need motivation first.",
      new: "Discipline starts where motivation ends."
    },
    {
      old: "Missing a day means failure.",
      new: "Missing a day means recommitment — not quitting."
    },
    {
      old: "I should already know this.",
      new: "Mastery happens through repetition, not expectation."
    },
    {
      old: "I have to feel inspired.",
      new: "Identity sustains habits when motivation fades."
    },
    {
      old: "Improvement should be obvious.",
      new: "Growth compounds quietly over time."
    },
    {
      old: "This is overwhelming.",
      new: "One small step is enough today."
    },
    {
      old: "It's too late to change.",
      new: "It's the perfect time — because I'm aware now."
    },
    {
      old: "I don't want to fail.",
      new: "Trying and adjusting is progress — avoiding isn't."
    },
    {
      old: "Good habits are restrictive.",
      new: "Good habits create freedom."
    },
  ],
  transformational: [
    {
      old: "Others must approve first.",
      new: "Leadership isn't about permission — it's about alignment."
    },
    {
      old: "I wait for opportunities.",
      new: "I create opportunities."
    },
    {
      old: "I'm not ready yet.",
      new: "Growth happens through stepping forward, not waiting."
    },
    {
      old: "I need certainty before acting.",
      new: "Direction becomes clear once action begins."
    },
    {
      old: "I don't want to take up space.",
      new: "Taking space teaches others I belong."
    },
    {
      old: "What if I fail?",
      new: "Failure is data — not identity."
    },
    {
      old: "I need someone to lead.",
      new: "I can lead when needed — calmly and confidently."
    },
    {
      old: "Playing small protects me.",
      new: "Playing small is self-betrayal."
    },
    {
      old: "I'm replaceable.",
      new: "My presence is unique — no one can replicate it."
    },
    {
      old: "I must avoid mistakes.",
      new: "Mistakes shape mastery."
    },
    {
      old: "Someone else will go first.",
      new: "I volunteer — courage is going first."
    },
    {
      old: "I'll hold back until I'm perfect.",
      new: "I grow through doing, not waiting."
    },
  ],
  selfFrame: [
    {
      old: "I'll tolerate this because I like them.",
      new: "If it costs my peace or dignity, it's too expensive."
    },
    {
      old: "I need to keep them happy.",
      new: "A relationship is mutual — not one-sided effort."
    },
    {
      old: "I hope they choose me.",
      new: "I'm also choosing who aligns with my standards."
    },
    {
      old: "I'm scared to speak up.",
      new: "Honesty protects connection — silence protects insecurity."
    },
    {
      old: "Maybe I'm asking for too much.",
      new: "Someone aligned will call it normal, not demanding."
    },
    {
      old: "Red flags will disappear with time.",
      new: "Red flags become relationship fractures."
    },
    {
      old: "Better something than nothing.",
      new: "I'd rather wait for alignment than settle for confusion."
    },
    {
      old: "I can't enforce boundaries.",
      new: "Boundaries are how I protect my wellbeing."
    },
    {
      old: "I'll prove I'm good enough.",
      new: "I show up authentically — the right person resonates."
    },
    {
      old: "If I lose them, I failed.",
      new: "If they walk away from honesty and standards, I win."
    },
    {
      old: "I'm lucky they're interested.",
      new: "It's mutual opportunity — not hierarchy."
    },
    {
      old: "Their opinion defines my worth.",
      new: "My worth is inherent — not negotiated."
    },
  ],
  goalOrientation: [
    {
      old: "Dating is the centre of my life.",
      new: "Dating is an extension — not the foundation — of my life."
    },
    {
      old: "Once I find the right person, life will feel meaningful.",
      new: "My life becomes meaningful because of how I live it — not who joins it."
    },
    {
      old: "I need connection to feel whole.",
      new: "Connection amplifies a life that is already whole."
    },
    {
      old: "I'll wait for motivation.",
      new: "Clarity comes from movement."
    },
    {
      old: "I'm behind.",
      new: "I'm exactly where growth has brought me."
    },
    {
      old: "My life must look like others.",
      new: "My path doesn't need to match anyone's timeline."
    },
    {
      old: "I don't know my future yet.",
      new: "I build it by showing up intentionally each day."
    },
    {
      old: "I need someone to complete the story.",
      new: "I'm writing the story — others choose whether they join."
    },
    {
      old: "Success is far away.",
      new: "Success is built through daily alignment."
    },
    {
      old: "I'm stuck.",
      new: "I'm in a transition phase — not a dead end."
    },
    {
      old: "I need the perfect plan first.",
      new: "Momentum creates clarity — not waiting."
    },
    {
      old: "My life is happening to me.",
      new: "I'm the author — not a passenger."
    },
  ],
};

export function getMindsetShifts(scores: Scores): MindsetShift[] {
  const shifts: MindsetShift[] = [];
  const selectedCategories: string[] = [];

  // Select categories based on scores (prioritize areas needing work)
  if (scores.anxiety > 3.5) {
    selectedCategories.push('anxiety');
  }
  if (scores.avoidance > 3.5) {
    selectedCategories.push('avoidance');
  }
  if (scores.neuroticism > 3.5) {
    selectedCategories.push('neuroticism');
  }
  if (scores.conscientiousness < 3) {
    selectedCategories.push('conscientiousness');
  }
  if (scores.transformational < 3) {
    selectedCategories.push('transformational');
  }
  if (scores.selfFrame < 3) {
    selectedCategories.push('selfFrame');
  }
  if (scores.goalOrientation < 3) {
    selectedCategories.push('goalOrientation');
  }

  // If no specific issues, select top 3 areas (lowest or highest scores)
  if (selectedCategories.length === 0) {
    const allScores = [
      { key: 'anxiety', value: scores.anxiety, isHigh: true },
      { key: 'avoidance', value: scores.avoidance, isHigh: true },
      { key: 'neuroticism', value: scores.neuroticism, isHigh: true },
      { key: 'conscientiousness', value: scores.conscientiousness, isHigh: false },
      { key: 'transformational', value: scores.transformational, isHigh: false },
      { key: 'selfFrame', value: scores.selfFrame, isHigh: false },
      { key: 'goalOrientation', value: scores.goalOrientation, isHigh: false },
    ];

    // Sort by how far from ideal (3.0)
    const sorted = allScores.sort((a, b) => {
      const aDistance = Math.abs(a.value - 3.0);
      const bDistance = Math.abs(b.value - 3.0);
      return bDistance - aDistance;
    });

    selectedCategories.push(...sorted.slice(0, 3).map(s => s.key));
  }

  // Get 2-3 shifts from each selected category
  selectedCategories.slice(0, 3).forEach(category => {
    const categoryShifts = mindsetShiftsByCategory[category] || [];
    // Randomly select 2-3 shifts from each category for variety
    const shuffled = [...categoryShifts].sort(() => 0.5 - Math.random());
    shifts.push(...shuffled.slice(0, 3));
  });

  // Limit to 6-8 total shifts
  return shifts.slice(0, 8);
}


