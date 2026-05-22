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
  calm: { emoji: "🌿", short: "Calm" },
  tired: { emoji: "😴", short: "Tired" },
  sensitive: { emoji: "🌙", short: "Sensitive" },
  stressed: { emoji: "⚡", short: "Stressed" },
  overwhelmed: { emoji: "🌧️", short: "Emotional" },
  irritated: { emoji: "😤", short: "Frustrated" },
  affectionate: { emoji: "🤍", short: "Warm" },
  low_energy: { emoji: "🔋", short: "Low" },
  hopeful: { emoji: "✨", short: "Hopeful" },
  quiet: { emoji: "🤫", short: "Quiet" },
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
