import type { QuizAnswers, Distance } from './runmvmtTypes';

export interface Insight {
  category: string;
  text: string;
}

function getRecommendedMileageForDistance(distance: Distance, goalType: string): number {
  // Rough recommendations based on distance and goal
  const recommendations: Record<Distance, Record<string, number>> = {
    "5k": { complete: 25, comfortable: 30, pb: 40, race: 50, unsure: 30 },
    "10k": { complete: 35, comfortable: 40, pb: 50, race: 60, unsure: 40 },
    "half_marathon": { complete: 45, comfortable: 50, pb: 65, race: 75, unsure: 50 },
    "marathon": { complete: 60, comfortable: 70, pb: 90, race: 100, unsure: 70 },
    "50k": { complete: 70, comfortable: 80, pb: 100, race: 110, unsure: 80 },
    "80k": { complete: 85, comfortable: 95, pb: 115, race: 125, unsure: 95 },
    "100k_plus": { complete: 100, comfortable: 110, pb: 130, race: 140, unsure: 110 },
  };
  
  const goalKey = goalType || "unsure";
  return recommendations[distance]?.[goalKey] || 50;
}

function estimateCurrentKmFromBucket(bucket: string): number {
  switch (bucket) {
    case "<10": return 8;
    case "10_30": return 20;
    case "30_50": return 40;
    case "50_80": return 60;
    case "80_120": return 90;
    case "120_plus": return 130;
    default: return 20;
  }
}

export function generateInsights(answers: QuizAnswers): Insight[] {
  const insights: Insight[] = [];
  const usedCategories = new Set<string>();

  // 1) Current Weekly Mileage Insight
  const currentKmBucket = answers["current_weekly_km"] as string;
  if (currentKmBucket && !usedCategories.has("mileage")) {
    const currentKm = estimateCurrentKmFromBucket(currentKmBucket);
    const distance = answers["goal_distance"] as Distance;
    const goalType = answers["goal_type"] as string || "unsure";
    const recommended = getRecommendedMileageForDistance(distance, goalType);
    const percentage = Math.round((currentKm / recommended) * 100);

    if (currentKm < recommended * 0.8) {
      insights.push({
        category: "mileage",
        text: `Based on your current weekly mileage, you're training at about ${percentage}% of what's typical for your ${distance === "5k" ? "5km" : distance === "10k" ? "10km" : distance === "half_marathon" ? "half marathon" : distance === "marathon" ? "marathon" : distance === "50k" ? "50km ultra" : distance === "80k" ? "80km ultra" : "100km+ ultra"} goal. That means your biggest gains won't come from running faster — they'll come from gently increasing total volume over time.`
      });
      usedCategories.add("mileage");
    } else if (currentKm >= recommended) {
      insights.push({
        category: "mileage",
        text: "Your current mileage already sits in the range most runners never reach. From here, improvement comes not from *more running*, but from *better structure, pacing discipline, and recovery strategy*."
      });
      usedCategories.add("mileage");
    }
  }

  // 2) Goal Distance Insight
  const goalDistance = answers["goal_distance"] as Distance;
  if (goalDistance && !usedCategories.has("goal_distance")) {
    let text = "";
    if (goalDistance === "5k" || goalDistance === "10k") {
      text = "Shorter races hurt in a fun way — they're basically sustained threshold efforts. The key isn't endurance… it's **efficiency and pace control**.";
    } else if (goalDistance === "half_marathon") {
      text = "The half marathon is unique — fast enough to feel like a race, long enough to require strategy. Training your **threshold pace** is where the breakthrough happens.";
    } else if (goalDistance === "marathon") {
      text = "Most people think marathons are about fitness — really, they're about **fatigue management and pacing discipline**.";
    } else if (goalDistance === "50k" || goalDistance === "80k" || goalDistance === "100k_plus") {
      text = "Ultras reward patience and durability more than speed. The win comes from **fuel timing, mental pacing, and long run strategy**.";
    }
    
    if (text) {
      insights.push({ category: "goal_distance", text });
      usedCategories.add("goal_distance");
    }
  }

  // 3) Recent Race Time / Pace Insight
  const recentRaceTime = answers["recent_race_time"] as string;
  if (recentRaceTime && recentRaceTime.trim() && recentRaceTime.toLowerCase() !== "none" && !usedCategories.has("race_time")) {
    insights.push({
      category: "race_time",
      text: `Based on your reported time (${recentRaceTime}), you're likely capable of more than you think once trained. Most people underestimate how close they are to a breakthrough when pacing aligns with physiology.`
    });
    usedCategories.add("race_time");
  }

  // 4) Injury Status Insight
  const injuryStatus = answers["injury_status"] as string;
  if (injuryStatus && !usedCategories.has("injury")) {
    if (injuryStatus === "current" || injuryStatus === "recurring") {
      insights.push({
        category: "injury",
        text: "Your injuries suggest your cardiovascular fitness isn't the limitation — tissue load tolerance is. Smart progression and strength work matter more than adding speed."
      });
    } else if (injuryStatus === "none") {
      insights.push({
        category: "injury",
        text: "Your lack of recent injuries means your body adapts well — which usually points to consistency potential. Your limiter is almost certainly **training structure**, not durability."
      });
    }
    usedCategories.add("injury");
  }

  // 5) Training Frequency Insight
  const preferredDays = answers["preferred_days_per_week"] as string;
  if (preferredDays && !usedCategories.has("frequency")) {
    const daysCount = preferredDays === "2_3" ? 3
      : preferredDays === "3_4" ? 4
      : preferredDays === "4_5" ? 5
      : preferredDays === "5_6" ? 6
      : 7;

    if (daysCount <= 3) {
      insights.push({
        category: "frequency",
        text: `With ${daysCount} running days per week, consistency and well-timed intensity are your biggest levers — not mileage.`
      });
    } else if (daysCount >= 4 && daysCount <= 6) {
      insights.push({
        category: "frequency",
        text: "You're in the sweet spot — enough frequency to build fitness, but not so much that you're constantly managing fatigue."
      });
    } else if (daysCount >= 6) {
      insights.push({
        category: "frequency",
        text: "Your frequency looks similar to competitive or elite runners. Progress for you comes from structure, not effort."
      });
    }
    usedCategories.add("frequency");
  }

  // 6) Lifestyle Load Insight
  const lifestyle = answers["lifestyle"] as string;
  if (lifestyle && !usedCategories.has("lifestyle")) {
    if (lifestyle === "active_job" || lifestyle === "heavy_labour") {
      insights.push({
        category: "lifestyle",
        text: "Because you're on your feet a lot, your fatigue comes from **total life load**, not just running. Prioritising recovery will unlock gains."
      });
    } else if (lifestyle === "desk") {
      insights.push({
        category: "lifestyle",
        text: "Because you sit most of the day, your aerobic system will adapt faster than your tissues — pacing and gradual load increase are key."
      });
    }
    usedCategories.add("lifestyle");
  }

  // 7) Training Style Preference
  const sessionPrefs = answers["session_preferences"] as string[];
  if (sessionPrefs && Array.isArray(sessionPrefs) && sessionPrefs.length > 0 && !usedCategories.has("style")) {
    if (sessionPrefs.includes("intervals")) {
      insights.push({
        category: "style",
        text: "You enjoy intensity — but the real breakthrough will come from pairing speed with slow aerobic running."
      });
    } else if (sessionPrefs.includes("easy")) {
      insights.push({
        category: "style",
        text: "You lean naturally into aerobic training — which is exactly how elite runners structure 80–90% of their training."
      });
    } else if (sessionPrefs.includes("variety")) {
      insights.push({
        category: "style",
        text: "Variety-driven runners respond well to structured training blocks — predictability builds performance."
      });
    }
    usedCategories.add("style");
  }

  // 8) Surface / Terrain Insight
  const surface = answers["main_surface"] as string;
  if (surface && !usedCategories.has("surface")) {
    if (surface === "trail") {
      insights.push({
        category: "surface",
        text: "Trail runners naturally develop strength and stability — your improvement lever is running economy and pacing consistency."
      });
    } else if (surface === "road") {
      insights.push({
        category: "surface",
        text: "Road running allows pace precision — which makes structured progression extremely effective for you."
      });
    }
    usedCategories.add("surface");
  }

  // 9) Strength Training Insight
  const strength = answers["strength_training"] as string;
  if (strength && !usedCategories.has("strength")) {
    if (strength === "yes_consistent" || strength === "yes_inconsistent") {
      insights.push({
        category: "strength",
        text: "Strength training is a huge asset — runners who lift tend to stay healthier and race stronger, especially late in long efforts."
      });
    } else if (strength === "no_but_open") {
      insights.push({
        category: "strength",
        text: "Adding even one short strength session per week can significantly reduce injury risk and improve efficiency."
      });
    } else if (strength === "no_not_interested") {
      insights.push({
        category: "strength",
        text: "It's optional — but runners who skip strength often hit plateaus sooner. Still — great running form and smart load progression go a long way."
      });
    }
    usedCategories.add("strength");
  }

  // 10) Fallback Insight (if we don't have 3 yet)
  if (insights.length < 3) {
    const fallbackText = "Consistency beats talent, perfect pacing beats motivation, and smart structure beats high effort. The next 12 weeks are going to change the way you think about training.";
    const needed = 3 - insights.length;
    for (let i = 0; i < needed; i++) {
      insights.push({
        category: "fallback",
        text: fallbackText
      });
    }
  }

  // Return exactly 3 insights
  return insights.slice(0, 3);
}
