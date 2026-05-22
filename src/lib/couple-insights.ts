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
      message: "Choose softness tonight — rest is enough for both of you.",
    };
  }

  if (oneTenderOneQuiet || oneNeedsSpace) {
    return {
      title: "Couple insight",
      message: "One may need closeness, one may need quiet — both are valid.",
    };
  }

  if (oneHopeful && !bothHeavy) {
    return {
      title: "Couple insight",
      message: "A good day for simple kindness — walk, warmth, or honest thanks.",
    };
  }

  if (partnerCheckIn.supportIntention && primary) {
    return {
      title: "Couple insight",
      message: "You are both checking in — meet each other where you are.",
    };
  }

  if (primaryMoods.length === 0 && partnerMoods.length === 0) {
    return {
      title: "Couple insight",
      message: "Small check-ins help — neither person has to carry it all.",
    };
  }

  return {
    title: "Couple insight",
    message: "Simple kindness beats heavy talks today.",
  };
}
