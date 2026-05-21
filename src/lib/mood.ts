import type { MoodId } from "@/types/app";

export type MoodOption = {
  id: MoodId;
  label: string;
  emoji: string;
};

export const MOODS: MoodOption[] = [
  { id: "calm", label: "Calm", emoji: "😌" },
  { id: "emotional", label: "Emotional", emoji: "🥺" },
  { id: "sensitive", label: "Sensitive", emoji: "🫠" },
  { id: "tired", label: "Tired", emoji: "😴" },
  { id: "hopeful", label: "Hopeful", emoji: "✨" },
  { id: "stressed", label: "Stressed", emoji: "😮‍💨" },
];

export function getMoodById(id: MoodId): MoodOption {
  return MOODS.find((m) => m.id === id) ?? MOODS[0];
}
