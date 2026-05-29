export const TOGETHER_DURATION_MINUTES = [10, 15, 20] as const;

export type TogetherDuration = (typeof TOGETHER_DURATION_MINUTES)[number];

export const OPENING_PROMPTS = [
  "What's one small thing you're grateful for about us right now?",
  "What's been on your heart lately that you haven't said out loud?",
  "When did you last feel really close — and what made it special?",
  "What's something you appreciate about your partner today?",
  "What would make the next hour feel warmer together?",
] as const;

export const CONNECTION_PROMPTS = [
  "What made you smile today?",
  "What's something stressing you lately?",
  "What's a memory you love about us?",
  "What's one thing you appreciate about your partner this week?",
  "What would make tomorrow feel better?",
] as const;

export const REFLECTION_FEELINGS = [
  { id: "connected", label: "Connected", emoji: "🫶" },
  { id: "calm", label: "Calm", emoji: "🌿" },
  { id: "loved", label: "Loved", emoji: "💜" },
  { id: "seen", label: "Seen", emoji: "✨" },
  { id: "better", label: "Better", emoji: "🌅" },
] as const;

export type ReflectionFeelingId = (typeof REFLECTION_FEELINGS)[number]["id"];

const STORAGE_KEY = "lovira_together_moments";

export type SavedTogetherMoment = {
  completedAt: string;
  feelings: ReflectionFeelingId[];
  durationMinutes: TogetherDuration;
  activityId?: string;
};

export function saveTogetherMoment(entry: SavedTogetherMoment) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: SavedTogetherMoment[] = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
  } catch {
    // ignore
  }
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function pickOpeningPrompt(): string {
  const i = Math.floor(Math.random() * OPENING_PROMPTS.length);
  return OPENING_PROMPTS[i];
}

export function pickConnectionPrompt(): string {
  const i = Math.floor(Math.random() * CONNECTION_PROMPTS.length);
  return CONNECTION_PROMPTS[i];
}

export function durationToSeconds(minutes: TogetherDuration): number {
  return minutes * 60;
}
