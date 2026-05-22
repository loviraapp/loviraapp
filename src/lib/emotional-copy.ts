import type {
  CoupleInsight,
  EnergyLevel,
  MoodId,
  PartnerCheckIn,
  SupportSuggestion,
} from "@/types/app";
import { getPrimaryMood } from "@/lib/mood";

export function getTodayHeadline(moods: MoodId[]): string {
  if (moods.length === 0) return "How is today feeling?";

  const primary = getPrimaryMood(moods);
  const headlines: Partial<Record<MoodId, string>> = {
    overwhelmed: "Today feels heavier",
    stressed: "Today has some weight to it",
    tired: "Today may need rest",
    low_energy: "Running a little low today",
    sensitive: "Today sits close to the heart",
    irritated: "Today has some friction",
    calm: "Today feels steady",
    hopeful: "Today has a little light",
    affectionate: "Today feels warm",
    quiet: "Today wants stillness",
  };

  return headlines[primary ?? moods[0]] ?? "Today is worth checking in on";
}

export function getHeroInsight(
  insight: CoupleInsight,
  myMoods: MoodId[],
  partnerCheckIn: PartnerCheckIn
): { headline: string; message: string } {
  const partnerMoods = partnerCheckIn.moods;
  const bothHeavy =
    myMoods.some((m) =>
      ["overwhelmed", "stressed", "tired", "irritated", "sensitive"].includes(m)
    ) &&
    partnerMoods.some((m) =>
      ["overwhelmed", "stressed", "tired", "irritated"].includes(m)
    );

  if (bothHeavy || (partnerCheckIn.energy === "low" && myMoods.includes("tired"))) {
    return {
      headline: "You both may need rest tonight",
      message: "Choose softness — quiet counts as love.",
    };
  }

  if (
    partnerCheckIn.supportIntention === "space" ||
    myMoods.includes("irritated") ||
    partnerMoods.includes("irritated")
  ) {
    return {
      headline: "A softer evening may help",
      message: "Tonight may feel better with softness and quiet.",
    };
  }

  if (myMoods.includes("hopeful") || partnerMoods.includes("hopeful")) {
    return {
      headline: "A gentle day between you",
      message: "Simple warmth — a walk, a meal, an honest thank-you.",
    };
  }

  if (myMoods.length === 0 && partnerMoods.length === 0) {
    return {
      headline: "When you are ready",
      message: "A small check-in can make the evening feel less alone.",
    };
  }

  return {
    headline: "Between you both",
    message: insight.message,
  };
}

const ACTION_WARM: Record<string, { title: string; line: string }> = {
  "Offer reassurance": {
    title: "Stay close, stay unhurried",
    line: "A steady presence often matters more than the right words.",
  },
  "Give space gently": {
    title: "Softness and quiet",
    line: "Tonight may feel better with gentleness — not fixing, just being near.",
  },
  "Listen without fixing": {
    title: "Listen first",
    line: "Let them lead — comfort, space, or help deciding together.",
  },
  "Help with small tasks": {
    title: "Lighten one small thing",
    line: "Offer once, without pressure — tea, a chore, or one less decision.",
  },
  "Plan a relaxing evening": {
    title: "Keep it simple tonight",
    line: "Something cozy you both enjoy — no agenda required.",
  },
};

export function getWarmAction(suggestion: SupportSuggestion): {
  title: string;
  line: string;
} {
  return (
    ACTION_WARM[suggestion.action] ?? {
      title: suggestion.action,
      line: "Small care builds trust more than perfect gestures.",
    }
  );
}

export function getEnergyPhrase(level: EnergyLevel | null): string {
  if (!level) return "Not shared yet";
  const map: Record<EnergyLevel, string> = {
    low: "Running a little low today",
    medium: "Steady, but not rushed",
    high: "Feeling a bit brighter",
  };
  return map[level];
}
