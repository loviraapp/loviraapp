import type { MoodId } from "@/types/app";

export type MoodOption = {
  id: MoodId;
  label: string;
  emoji: string;
};

export const MOODS: MoodOption[] = [
  { id: "calm", label: "Calm", emoji: "😌" },
  { id: "tired", label: "Tired", emoji: "😴" },
  { id: "sensitive", label: "Sensitive", emoji: "🫠" },
  { id: "stressed", label: "Stressed", emoji: "😮‍💨" },
  { id: "overwhelmed", label: "Overwhelmed", emoji: "🌊" },
  { id: "irritated", label: "Irritated", emoji: "😤" },
  { id: "affectionate", label: "Affectionate", emoji: "🤍" },
  { id: "low_energy", label: "Low energy", emoji: "🔋" },
  { id: "hopeful", label: "Hopeful", emoji: "✨" },
  { id: "quiet", label: "Quiet", emoji: "🤫" },
];

const MOOD_MAP = new Map(MOODS.map((m) => [m.id, m]));

export function getMoodById(id: MoodId): MoodOption {
  return MOOD_MAP.get(id) ?? MOODS[0];
}

/** Pick the mood that most influences partner support tone */
export function getPrimaryMood(moods: MoodId[]): MoodId | null {
  if (moods.length === 0) return null;

  const priority: MoodId[] = [
    "overwhelmed",
    "stressed",
    "irritated",
    "sensitive",
    "tired",
    "low_energy",
    "quiet",
    "calm",
    "hopeful",
    "affectionate",
  ];

  for (const id of priority) {
    if (moods.includes(id)) return id;
  }

  return moods[0];
}

export function formatMoodList(moods: MoodId[]): string {
  if (moods.length === 0) return "None yet";
  return moods.map((id) => getMoodById(id).label).join(", ");
}
