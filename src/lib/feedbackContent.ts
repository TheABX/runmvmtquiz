import type { AttachmentStyle, Level } from './types';

export const attachmentFeedback: Record<AttachmentStyle, {
  title: string;
  body: string;
  growth: string;
}> = {
  secure: {
    title: "Your Attachment Profile: Secure",
    body: `Your results indicate a Secure Attachment Style. You tend to show up calm, open and comfortable in the early stages of dating. You're OK with closeness, but you don't cling. You can handle uncertainty without spiraling, and you're comfortable expressing your needs while respecting hers.`,
    growth: `While your foundation is strong, growth is always possible. Your work isn't about fixing big problems – it's about tightening the details and staying curious about her needs while leading clearly. Focus on deepening your emotional intelligence and refining your communication skills.`
  },
  anxious_preoccupied: {
    title: "Your Attachment Profile: Anxious-Preoccupied",
    body: `Your results point to an Anxious-Preoccupied Attachment Style. You crave closeness and reassurance, especially when you like someone. When she pulls back or replies slowly, your mind goes into overdrive. You may overthink messages, replay conversations, and seek constant validation that she's still interested. This can lead to chasing behavior that actually pushes her away.`,
    growth: `The core work for you is to develop secure self-soothing. Your work is learning to hold your ground when you feel unsure – regulating your anxiety so you don't flood her with energy or chase when you're triggered. Practice sitting with uncertainty without acting on it. Build your internal sense of worth so you don't need her validation to feel okay.`
  },
  dismissive_avoidant: {
    title: "Your Attachment Profile: Dismissive-Avoidant",
    body: `Your results suggest a Dismissive-Avoidant Attachment Style. You're comfortable on your own and don't like feeling boxed in. When a woman wants more closeness, you may pull back or bury yourself in distractions. You might lose interest when things get too serious, or you may struggle to be emotionally present even when you care. This can leave partners feeling confused and rejected.`,
    growth: `Your work is leaning into presence instead of escape – staying in the moment when things get emotionally real instead of armouring up. Practice allowing yourself to be vulnerable. Recognize that needing connection doesn't make you weak. Learn to communicate your feelings instead of shutting down.`
  },
  fearful_avoidant: {
    title: "Your Attachment Profile: Fearful-Avoidant",
    body: `Your results indicate a Fearful-Avoidant Attachment Style. You want deep connection but you're also wary of it. You might get close quickly then suddenly pull back, leaving women feeling confused. You experience both the anxiety of wanting closeness and the fear of being hurt, creating a push-pull dynamic that's hard for partners to navigate.`,
    growth: `Your work is calming the internal chaos – noticing your swings from 'all in' to 'shut down' and choosing smaller, steadier steps. Practice consistency over intensity. Learn to recognize when you're triggered and pause before reacting. Build trust gradually rather than rushing in or running away.`
  }
};

export const neuroticismFeedback: Record<Level, string> = {
  low: "Emotional Stability is a Strength. Your low Neuroticism score suggests you generally stay emotionally steady when things are uncertain. You don't get thrown off easily by slow replies or mixed signals. This emotional steadiness is highly attractive and allows you to show up consistently, which builds trust and connection naturally.",
  medium: "Moderate Emotional Reactivity. Your score suggests you can handle some uncertainty, but you may still get triggered in certain situations. Learning to recognize your triggers will help you respond more intentionally rather than reacting from anxiety. Practice pausing before responding when you feel emotionally activated.",
  high: "High Emotional Volatility. Your high Neuroticism score indicates you can get thrown off easily by slow replies or mixed signals, which leads to anxious behaviour. Practice slowing down your responses when you feel triggered instead of reacting instantly. Build emotional regulation skills through mindfulness, breathing exercises, and self-soothing techniques. Your ability to stay calm under uncertainty is crucial for healthy dating."
};

export const conscientiousnessFeedback: Record<Level, string> = {
  low: "Opportunity for Structure and Reliability. You can come across as flaky or inconsistent, even when you care. If you say you'll call or plan something, lock it in and follow through. Reliability builds trust fast in dating. Start small – commit to one thing and do it consistently. This shows you're someone she can count on.",
  medium: "Balanced Approach to Structure. You follow through most of the time, but there's room to be more consistent. Reliability builds trust fast in dating. Focus on being more intentional about your commitments and following through on what you say. Small consistent actions build more trust than grand gestures.",
  high: "Reliability and Discipline are Key Assets. You follow through on what you say, which builds trust fast. This is a significant strength in building connection. Women notice when you're consistent and reliable – it shows you're serious and that she can count on you. Continue to honor your commitments and be someone she can trust."
};

export const transformationalFeedback: Record<Level, string> = {
  low: "Opportunity to Lead. You may struggle to take initiative in conversations and decisions. Leading confidently when dating shows you know what you want. Practice making decisions and taking the lead in planning dates. Women are attracted to men who know how to lead without being controlling. Start by leading in small ways – suggest a place, pick a time, guide the conversation.",
  medium: "Developing Leadership. You lead some of the time, but there's room to be more decisive. Women are attracted to men who know how to lead. Practice being more intentional about taking initiative. Don't wait for her to make all the decisions – step up and lead while still being open to her input.",
  high: "Strong Leadership in Connection. You lead conversations and decisions confidently when dating. This shows you know what you want and aren't afraid to go after it. Your ability to lead creates a sense of safety and direction that's highly attractive. Continue to lead with confidence while staying open to collaboration and her needs."
};

export const selfFrameFeedback: Record<Level, string> = {
  low: "Building Your Frame. You may struggle with boundaries and self-worth. Setting clear boundaries and sticking to them is crucial for healthy relationships. A strong frame shows you know your worth. Practice saying no when something doesn't feel right. Recognize that you deserve respect and don't need to earn someone's approval. Build your sense of self-worth independent of dating outcomes.",
  medium: "Developing Your Frame. You have some boundaries, but there's room to strengthen them. A strong frame shows you know your worth. Practice being clearer about what you will and won't accept. Don't compromise your values or boundaries to please someone. Your ability to hold your ground is attractive and shows self-respect.",
  high: "Strong Frame & Boundaries. You set clear boundaries and stick to them. You know your worth and aren't afraid to say no when something doesn't feel right. This self-respect is highly attractive and creates healthy relationship dynamics. Continue to honor your boundaries and recognize that you deserve high-quality connection."
};

export const goalOrientationFeedback: Record<Level, string> = {
  low: "Clarifying Your Direction. You may not be clear on what you want in a relationship. Knowing what you want and going after it is attractive. Take time to reflect on what you're actually looking for. Clarity about your goals and direction shows confidence and purpose, which is highly attractive to women.",
  medium: "Developing Clarity. You have some direction, but could be clearer. Women are attracted to men who know what they want. Spend time getting clear on your relationship goals and life direction. This clarity will help you attract the right people and make better decisions in dating.",
  high: "Clear Life Direction & Purpose. You know what you want in a relationship and you're actively pursuing it. This clarity is highly attractive. Your sense of purpose and direction shows you're not just drifting through life – you have goals and you're working toward them. This confidence and clarity is magnetic."
};

