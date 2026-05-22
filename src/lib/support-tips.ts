import type { CyclePhase, MoodId, SupportSuggestion } from "@/types/app";
import { getPrimaryMood } from "@/lib/mood";

type TipKey = `${CyclePhase}:${MoodId}`;

const SPECIFIC_TIPS: Partial<Record<TipKey, SupportSuggestion>> = {
  "menstrual:tired": {
    title: "Help with small tasks",
    message:
      "Offer to handle one practical thing — a chore or errand — so your partner can rest without asking.",
    action: "Help with small tasks",
  },
  "menstrual:overwhelmed": {
    title: "Offer reassurance",
    message:
      "Keep your tone warm and unhurried: “I’m here with you.” Avoid minimizing what they feel.",
    action: "Offer reassurance",
  },
  "menstrual:sensitive": {
    title: "Give space gently",
    message:
      "Stay close but soft — quiet presence, lower volume, no pressure to talk unless they want to.",
    action: "Give space gently",
  },
  "follicular:hopeful": {
    title: "Plan a relaxing evening",
    message:
      "Match lighter energy with something simple you both enjoy — a walk, favorite food, or cozy time.",
    action: "Plan a relaxing evening",
  },
  "follicular:affectionate": {
    title: "Plan a relaxing evening",
    message:
      "Reciprocate warmth in a low-pressure way — a note, a hug, or time without screens.",
    action: "Plan a relaxing evening",
  },
  "luteal:stressed": {
    title: "Listen without fixing",
    message:
      "Ask what would help most. Often listening comes first, solutions second — if at all.",
    action: "Listen without fixing",
  },
  "luteal:irritated": {
    title: "Give space gently",
    message:
      "Small frictions feel bigger now. Speak slowly; choose kindness over being right.",
    action: "Give space gently",
  },
  "luteal:overwhelmed": {
    title: "Offer reassurance",
    message:
      "Remind them they are not alone. Steady affection beats grand gestures in heavy moments.",
    action: "Offer reassurance",
  },
  "luteal:low_energy": {
    title: "Help with small tasks",
    message:
      "Lighten the load without fanfare — tea, a snack, or one thing off their plate today.",
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
      "Energy is often rising — invite connection without over-scheduling the day.",
    action: "Plan a relaxing evening",
  },
  ovulation: {
    title: "Listen without fixing",
    message:
      "Be present and curious. Ask how they are feeling and give room for the answer.",
    action: "Listen without fixing",
  },
  luteal: {
    title: "Give space gently",
    message:
      "Extra patience helps. Offer support without pressure; let them lead how much they share.",
    action: "Give space gently",
  },
};

const MOOD_DEFAULTS: Record<MoodId, SupportSuggestion> = {
  calm: {
    title: "Plan a relaxing evening",
    message: "A peaceful moment together — no agenda, just ease and presence.",
    action: "Plan a relaxing evening",
  },
  tired: {
    title: "Help with small tasks",
    message: "One less thing on their plate can feel like care. Offer, do not insist.",
    action: "Help with small tasks",
  },
  sensitive: {
    title: "Give space gently",
    message: "Reduce noise and demands. Let them set the pace for conversation tonight.",
    action: "Give space gently",
  },
  stressed: {
    title: "Listen without fixing",
    message:
      "Validate first: “That sounds heavy.” Ask if they want comfort, space, or help deciding.",
    action: "Listen without fixing",
  },
  overwhelmed: {
    title: "Offer reassurance",
    message: "Stay steady. Help break the day into one small, doable next step.",
    action: "Offer reassurance",
  },
  irritated: {
    title: "Give space gently",
    message: "Do not match intensity. A calm tone de-escalates more than clever arguments.",
    action: "Give space gently",
  },
  affectionate: {
    title: "Plan a relaxing evening",
    message: "Meet warmth with warmth — small gestures of closeness go far.",
    action: "Plan a relaxing evening",
  },
  low_energy: {
    title: "Help with small tasks",
    message: "Assume less bandwidth. Offer practical help before big plans.",
    action: "Help with small tasks",
  },
  hopeful: {
    title: "Plan a relaxing evening",
    message: "Share something that lifts you both — keep it simple and unforced.",
    action: "Plan a relaxing evening",
  },
  quiet: {
    title: "Give space gently",
    message: "Silence can be intimacy. Be nearby without filling every pause.",
    action: "Give space gently",
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
  moods: MoodId[]
): SupportSuggestion {
  const mood = getPrimaryMood(moods);

  if (phase && mood) {
    const key = `${phase}:${mood}` as TipKey;
    const specific = SPECIFIC_TIPS[key];
    if (specific) return specific;
  }

  if (mood) return MOOD_DEFAULTS[mood];
  if (phase) return PHASE_DEFAULTS[phase];
  return GENERIC;
}
