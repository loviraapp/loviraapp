import type { PartnerMoodId } from "@/types/app";

export type PartnerMoodOption = {
  id: PartnerMoodId;
  label: string;
  emoji: string;
};

export const PARTNER_MOODS: PartnerMoodOption[] = [
  { id: "calm", label: "Calm", emoji: "😌" },
  { id: "stressed", label: "Stressed", emoji: "😵" },
  { id: "tired", label: "Tired", emoji: "😴" },
  { id: "overwhelmed", label: "Overwhelmed", emoji: "🌧️" },
  { id: "hopeful", label: "Hopeful", emoji: "✨" },
  { id: "quiet", label: "Quiet", emoji: "🤫" },
  { id: "irritated", label: "Irritated", emoji: "😤" },
  { id: "affectionate", label: "Affectionate", emoji: "🤍" },
];

export function getPartnerMoodById(id: PartnerMoodId): PartnerMoodOption {
  return PARTNER_MOODS.find((m) => m.id === id) ?? PARTNER_MOODS[0];
}

export function formatPartnerMoodList(moods: PartnerMoodId[]): string {
  if (moods.length === 0) return "None yet";
  return moods.map((id) => getPartnerMoodById(id).label).join(", ");
}
