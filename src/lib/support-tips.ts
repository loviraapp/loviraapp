import type { CyclePhase, MoodId, SupportSuggestion } from "@/types/app";

type TipKey = `${CyclePhase}:${MoodId}`;

const SPECIFIC_TIPS: Partial<Record<TipKey, SupportSuggestion>> = {
  "menstrual:tired": {
    title: "Help with small tasks",
    message:
      "Offer to handle one practical thing — groceries, dishes, or a chore — so she can rest without asking.",
    action: "Help with small tasks",
  },
  "menstrual:emotional": {
    title: "Offer reassurance",
    message:
      "A warm check-in goes far: “I’m here with you.” Avoid minimizing how she feels.",
    action: "Offer reassurance",
  },
  "menstrual:sensitive": {
    title: "Give space gently",
    message:
      "Stay close but soft — a quiet presence, lower volume, no pressure to talk unless she wants to.",
    action: "Give space gently",
  },
  "follicular:hopeful": {
    title: "Plan a relaxing evening",
    message:
      "Match her lighter energy with something simple you both enjoy — a walk, favorite food, or cozy show.",
    action: "Plan a relaxing evening",
  },
  "follicular:calm": {
    title: "Plan a relaxing evening",
    message:
      "This is a good window for easy connection. Keep plans flexible and low-pressure.",
    action: "Plan a relaxing evening",
  },
  "ovulation:hopeful": {
    title: "Plan a relaxing evening",
    message:
      "Celebrate the good day — shared laughter or a small adventure can deepen closeness.",
    action: "Plan a relaxing evening",
  },
  "luteal:stressed": {
    title: "Listen without fixing",
    message:
      "Ask what would help most. Often she needs listening first, solutions second — if at all.",
    action: "Listen without fixing",
  },
  "luteal:sensitive": {
    title: "Give space gently",
    message:
      "Small frictions feel bigger now. Speak slowly, choose kindness over being right.",
    action: "Give space gently",
  },
  "luteal:emotional": {
    title: "Offer reassurance",
    message:
      "Remind her she’s not alone. Steady affection beats grand gestures in this phase.",
    action: "Offer reassurance",
  },
  "luteal:tired": {
    title: "Help with small tasks",
    message:
      "Lighten the load without fanfare — tea, a snack, or taking one thing off her list.",
    action: "Help with small tasks",
  },
};

const PHASE_DEFAULTS: Record<CyclePhase, SupportSuggestion> = {
  menstrual: {
    title: "Offer reassurance",
    message:
      "Prioritize comfort and warmth. Keep plans flexible and check in with care.",
    action: "Offer reassurance",
  },
  follicular: {
    title: "Plan a relaxing evening",
    message:
      "Energy is often rising — invite connection without over-scheduling her day.",
    action: "Plan a relaxing evening",
  },
  ovulation: {
    title: "Listen without fixing",
    message:
      "Be present and curious. Celebrate her voice — ask how she’s feeling and really listen.",
    action: "Listen without fixing",
  },
  luteal: {
    title: "Give space gently",
    message:
      "Extra patience helps. Offer support without pressure; let her lead how much she shares.",
    action: "Give space gently",
  },
};

const MOOD_DEFAULTS: Record<MoodId, SupportSuggestion> = {
  calm: {
    title: "Plan a relaxing evening",
    message: "A peaceful moment together — no agenda, just ease and presence.",
    action: "Plan a relaxing evening",
  },
  emotional: {
    title: "Offer reassurance",
    message: "Hold steady eye contact and warmth. She may need to feel seen more than advised.",
    action: "Offer reassurance",
  },
  sensitive: {
    title: "Give space gently",
    message: "Reduce noise and demands. Let her set the pace for conversation tonight.",
    action: "Give space gently",
  },
  tired: {
    title: "Help with small tasks",
    message: "One less thing on her plate can feel like love. Offer, don’t insist.",
    action: "Help with small tasks",
  },
  hopeful: {
    title: "Plan a relaxing evening",
    message: "Mirror her lightness — share something that makes you both smile.",
    action: "Plan a relaxing evening",
  },
  stressed: {
    title: "Listen without fixing",
    message: "Validate first: “That sounds heavy.” Ask if she wants comfort, space, or help deciding.",
    action: "Listen without fixing",
  },
};

const GENERIC: SupportSuggestion = {
  title: "Offer reassurance",
  message:
    "Show up with warmth and curiosity. Small, consistent care builds trust more than perfect words.",
  action: "Offer reassurance",
};

export function getSupportSuggestion(
  phase: CyclePhase | null,
  mood: MoodId | null
): SupportSuggestion {
  if (phase && mood) {
    const key = `${phase}:${mood}` as TipKey;
    const specific = SPECIFIC_TIPS[key];
    if (specific) return specific;
  }

  if (mood) return MOOD_DEFAULTS[mood];
  if (phase) return PHASE_DEFAULTS[phase];
  return GENERIC;
}
