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
    partnerCheckIn.needs.includes("space") ||
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
      message: "Closeness and quiet can both be love — honor what each of you needs.",
    };
  }

  if (oneHopeful && !bothHeavy) {
    return {
      title: "Couple insight",
      message: "A gentle day between you — warmth without pressure.",
    };
  }

  if ((partnerCheckIn.needs.length > 0 || partnerCheckIn.supportIntention) && primary) {
    return {
      title: "Couple insight",
      message: "You are both showing up — meet each other where you are.",
    };
  }

  if (primaryMoods.length === 0 && partnerMoods.length === 0) {
    return {
      title: "Couple insight",
      message: "A small check-in can make the evening feel less alone.",
    };
  }

  return {
    title: "Couple insight",
    message: "Simple kindness often lands better than a heavy talk.",
  };
}
