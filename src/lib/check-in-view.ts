import type { MoodId, PartnerCheckIn, PartnerMoodId } from "@/types/app";
import type { UserRole } from "@/types/role";

/** On one device: tracking logs todayMoods; support logs partnerCheckIn. */
export function getMyMoods(
  role: UserRole,
  todayMoods: MoodId[],
  partnerCheckIn: PartnerCheckIn
): MoodId[] | PartnerMoodId[] {
  return role === "support" ? partnerCheckIn.moods : todayMoods;
}

export function getTheirMoods(
  role: UserRole,
  todayMoods: MoodId[],
  partnerCheckIn: PartnerCheckIn
): MoodId[] | PartnerMoodId[] {
  return role === "support" ? todayMoods : partnerCheckIn.moods;
}

export function hasTheirCheckIn(
  role: UserRole,
  todayMoods: MoodId[],
  partnerCheckIn: PartnerCheckIn
): boolean {
  const theirs = getTheirMoods(role, todayMoods, partnerCheckIn);
  return (
    theirs.length > 0 ||
    partnerCheckIn.needs.length > 0 ||
    partnerCheckIn.energy !== null
  );
}
