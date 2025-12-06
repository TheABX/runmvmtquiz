import type { Scores } from './types';
import { classifyLevel, classifyAttachment } from './scoring';
import { 
  attachmentFeedback, 
  neuroticismFeedback, 
  conscientiousnessFeedback,
  transformationalFeedback,
  selfFrameFeedback,
  goalOrientationFeedback
} from './feedbackContent';

export function buildProfile(scores: Scores) {
  const attachmentType = classifyAttachment(scores);
  const neuroticismLevel = classifyLevel(scores.neuroticism);
  const conscientiousnessLevel = classifyLevel(scores.conscientiousness);
  const leadershipLevel = classifyLevel(scores.transformational);
  const frameLevel = classifyLevel(scores.selfFrame);
  const lifeDirLevel = classifyLevel(scores.goalOrientation);

  return {
    attachment: attachmentFeedback[attachmentType],
    neuroticism: neuroticismFeedback[neuroticismLevel],
    conscientiousness: conscientiousnessFeedback[conscientiousnessLevel],
    leadership: transformationalFeedback[leadershipLevel],
    frame: selfFrameFeedback[frameLevel],
    lifeDirection: goalOrientationFeedback[lifeDirLevel],
    scores: {
      anxiety: scores.anxiety,
      avoidance: scores.avoidance,
      neuroticism: scores.neuroticism,
      conscientiousness: scores.conscientiousness,
      transformational: scores.transformational,
      selfFrame: scores.selfFrame,
      goalOrientation: scores.goalOrientation,
    },
    levels: {
      anxiety: classifyLevel(scores.anxiety),
      avoidance: classifyLevel(scores.avoidance),
      neuroticism: neuroticismLevel,
      conscientiousness: conscientiousnessLevel,
      transformational: leadershipLevel,
      selfFrame: frameLevel,
      goalOrientation: lifeDirLevel,
    }
  };
}

