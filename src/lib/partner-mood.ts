import type { MoodId } from "@/types/app";
import { MOODS } from "@/lib/mood";

export type PartnerMoodOption = {
  id: MoodId;
  label: string;
  emoji: string;
};

/** Same moods for both partners — balanced experience */
export const PARTNER_MOODS: PartnerMoodOption[] = MOODS;

export function getPartnerMoodById(id: MoodId): PartnerMoodOption {
  return PARTNER_MOODS.find((m) => m.id === id) ?? PARTNER_MOODS[0];
}

export function formatPartnerMoodList(moods: MoodId[]): string {
  if (moods.length === 0) return "None yet";
  return moods.map((id) => getPartnerMoodById(id).label).join(", ");
}
