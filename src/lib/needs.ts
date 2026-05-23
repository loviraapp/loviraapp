import type { NeedId } from "@/types/app";

export type NeedOption = {
  id: NeedId;
  label: string;
  emoji: string;
};

export const NEEDS: NeedOption[] = [
  { id: "space", label: "Space", emoji: "🌙" },
  { id: "reassurance", label: "Reassurance", emoji: "🫶" },
  { id: "tasks", label: "Help with tasks", emoji: "✋" },
  { id: "calm_conversation", label: "Calm conversation", emoji: "💬" },
  { id: "affection", label: "Affection", emoji: "🤍" },
  { id: "rest", label: "Rest", emoji: "😴" },
  { id: "playfulness", label: "Playfulness", emoji: "✨" },
  { id: "appreciation", label: "Appreciation", emoji: "🌿" },
];

export function getNeedById(id: NeedId): NeedOption {
  return NEEDS.find((n) => n.id === id) ?? NEEDS[0];
}
