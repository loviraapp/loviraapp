import type {
  CoupleInsight,
  EnergyLevel,
  MoodId,
  PartnerCheckIn,
  PartnerMoodId,
} from "@/types/app";
import { getPrimaryMood } from "@/lib/mood";

function hasLowEnergy(energy: EnergyLevel | null): boolean {
  return energy === "low";
}

function moodIsHeavy(id: MoodId | PartnerMoodId): boolean {
  return ["overwhelmed", "stressed", "tired", "irritated", "sensitive", "low_energy"].includes(id);
}

function moodIsTender(id: MoodId | PartnerMoodId): boolean {
  return ["sensitive", "quiet", "overwhelmed"].includes(id);
}

export function getCoupleInsight(
  primaryMoods: MoodId[],
  partnerCheckIn: PartnerCheckIn
): CoupleInsight {
  const partnerMoods = partnerCheckIn.moods;
  const primary = getPrimaryMood(primaryMoods);
  const bothLowEnergy =
    hasLowEnergy(partnerCheckIn.energy) &&
    (primaryMoods.includes("tired") || primaryMoods.includes("low_energy"));

  const bothHeavy =
    primaryMoods.some(moodIsHeavy) && partnerMoods.some(moodIsHeavy);

  const oneTenderOneQuiet =
    (primaryMoods.some(moodIsTender) && partnerMoods.includes("quiet")) ||
    (partnerMoods.some(moodIsTender) && primaryMoods.includes("quiet"));

  const oneHopeful =
    primaryMoods.includes("hopeful") || partnerMoods.includes("hopeful");

  const oneNeedsSpace =
    partnerMoods.includes("irritated") ||
    primaryMoods.includes("irritated") ||
    partnerCheckIn.supportIntention === "space";

  if (bothLowEnergy || bothHeavy) {
    return {
      title: "Couple insight",
      message:
        "Both of you may need a slower evening today. Simple kindness beats big conversations — rest is allowed for both.",
    };
  }

  if (oneTenderOneQuiet || oneNeedsSpace) {
    return {
      title: "Couple insight",
      message:
        "One partner may need reassurance, the other may need quiet time. There is no scoreboard — just two people doing their best.",
    };
  }

  if (oneHopeful && !bothHeavy) {
    return {
      title: "Couple insight",
      message:
        "This may be a good day for simple kindness — a walk, a warm meal, or honest appreciation without heavy topics.",
    };
  }

  if (partnerCheckIn.supportIntention && primary) {
    return {
      title: "Couple insight",
      message:
        "You are both checking in — that already matters. Let support be optional and gentle: meet each other where you are, not where you think you should be.",
    };
  }

  if (primaryMoods.length === 0 && partnerMoods.length === 0) {
    return {
      title: "Couple insight",
      message:
        "When you are ready, even a small check-in helps. Lovira is for both partners — neither person has to carry the whole emotional load alone.",
    };
  }

  return {
    title: "Couple insight",
    message:
      "Today is a normal day in a real relationship — imperfect and still worth care. This may be a good day for simple kindness, not heavy conversations.",
  };
}
