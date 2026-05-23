import type { MoodId, NeedId, PersonCheckIn, RelationshipVibe } from "@/types/app";

function hasHeavy(moods: MoodId[]): boolean {
  return moods.some((m) =>
    ["overwhelmed", "stressed", "irritated", "tired", "low_energy"].includes(m)
  );
}

function wantsPlay(needs: NeedId[]): boolean {
  return needs.includes("playfulness") || needs.includes("affection");
}

function wantsSpace(needs: NeedId[]): boolean {
  return needs.includes("space") || needs.includes("rest");
}

export function getRelationshipVibe(
  me: PersonCheckIn,
  partner: PersonCheckIn
): RelationshipVibe {
  const allMoods = [...me.moods, ...partner.moods];
  const allNeeds = [...me.needs, ...partner.needs];
  const bothHeavy = hasHeavy(me.moods) && hasHeavy(partner.moods);
  const eitherHeavy = hasHeavy(allMoods);

  if (bothHeavy || (wantsSpace(allNeeds) && eitherHeavy)) {
    return {
      emoji: "🌙",
      title: "Low-energy comfort",
      line: "Softness over solving — rest together counts.",
    };
  }

  if (wantsPlay(allNeeds) && !eitherHeavy) {
    return {
      emoji: "✨",
      title: "Playful evening",
      line: "Lightness and warmth may land best tonight.",
    };
  }

  if (
    allNeeds.includes("reassurance") ||
    allNeeds.includes("appreciation")
  ) {
    return {
      emoji: "🫶",
      title: "Gentle reconnection",
      line: "Small reassurance may go a long way.",
    };
  }

  if (wantsSpace(me.needs) !== wantsSpace(partner.needs)) {
    return {
      emoji: "💫",
      title: "Softness over solving",
      line: "Honor different needs — closeness and quiet both count.",
    };
  }

  if (allMoods.includes("hopeful") || allMoods.includes("affectionate")) {
    return {
      emoji: "🌿",
      title: "Gentle reconnection",
      line: "A calm moment together — no big talk required.",
    };
  }

  if (me.moods.length === 0 && partner.moods.length === 0) {
    return {
      emoji: "🤝",
      title: "Check in when ready",
      line: "A small ritual can make tonight feel closer.",
    };
  }

  return {
    emoji: "🌙",
    title: "Gentle reconnection",
    line: "Meet each other where you are — kindness first.",
  };
}
