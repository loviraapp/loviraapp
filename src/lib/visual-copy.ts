import type { CyclePhase, EnergyLevel, MoodId } from "@/types/app";

export const PHASE_VISUAL: Record<
  CyclePhase,
  { emoji: string; glance: string }
> = {
  menstrual: { emoji: "🌙", glance: "Rest" },
  follicular: { emoji: "🌱", glance: "Rise" },
  ovulation: { emoji: "✨", glance: "Open" },
  luteal: { emoji: "🌙", glance: "Slow" },
};

/** Unified glance emojis — emotional, not clinical */
export const MOOD_GLANCE: Record<MoodId, { emoji: string; short: string }> = {
  calm: { emoji: "🌿", short: "Feeling calm" },
  tired: { emoji: "😴", short: "A little tired" },
  sensitive: { emoji: "🌙", short: "Feeling sensitive" },
  stressed: { emoji: "⚡", short: "Carrying some stress" },
  overwhelmed: { emoji: "🌧️", short: "A lot to hold today" },
  irritated: { emoji: "😤", short: "A bit on edge" },
  affectionate: { emoji: "🤍", short: "Warm and open" },
  low_energy: { emoji: "🔋", short: "Running a little low" },
  hopeful: { emoji: "✨", short: "Quietly hopeful" },
  quiet: { emoji: "🤫", short: "Needing quiet" },
};

export const ENERGY_GLANCE: Record<
  EnergyLevel,
  { emoji: string; label: string }
> = {
  low: { emoji: "🌙", label: "Low energy" },
  medium: { emoji: "〰️", label: "Steady" },
  high: { emoji: "✨", label: "Bright" },
};

export function getMoodGlance(id: MoodId) {
  return MOOD_GLANCE[id] ?? { emoji: "○", short: "—" };
}
