import type { EnergyLevel, SupportIntention } from "@/types/app";

export const ENERGY_OPTIONS: { id: EnergyLevel; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

export const SUPPORT_INTENTIONS: {
  id: SupportIntention;
  label: string;
  description: string;
}[] = [
  {
    id: "listening",
    label: "Listening",
    description: "Being present without fixing",
  },
  {
    id: "tasks",
    label: "Helping with tasks",
    description: "Lightening the load practically",
  },
  {
    id: "space",
    label: "Giving space",
    description: "Room to breathe, staying kind",
  },
  {
    id: "calm_time",
    label: "Planning calm time",
    description: "A low-pressure evening together",
  },
  {
    id: "kind_message",
    label: "Sending a kind message",
    description: "A warm text or note, no pressure",
  },
];

export function getSupportIntentionLabel(id: SupportIntention | null): string {
  if (!id) return "";
  return SUPPORT_INTENTIONS.find((s) => s.id === id)?.label ?? "";
}
