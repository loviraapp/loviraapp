import type { CyclePhase } from "@/types/app";

export const PHASE_VISUAL: Record<
  CyclePhase,
  { emoji: string; glance: string }
> = {
  menstrual: { emoji: "🩸", glance: "Rest" },
  follicular: { emoji: "🌱", glance: "Rise" },
  ovulation: { emoji: "✨", glance: "Open" },
  luteal: { emoji: "🌙", glance: "Slow" },
};

export const MOOD_EMOJI_OVERRIDES: Partial<Record<string, string>> = {
  sensitive: "🫶",
  stressed: "😵",
  overwhelmed: "🌧️",
};
