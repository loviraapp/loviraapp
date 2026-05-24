import type { EmotionalSupportProfile } from "@/types/support-preferences";
import type { CoupleProfile, LoviraHelpId } from "@/types/couple-profile";

const KEY = "lovira:coupleProfile";

function normalizeCoupleProfile(raw: Partial<CoupleProfile>): CoupleProfile | null {
  if (!raw.yourName || typeof raw.yourName !== "string") return null;
  return {
    yourName: raw.yourName,
    partnerName: typeof raw.partnerName === "string" ? raw.partnerName : "",
    anniversary: raw.anniversary,
    comforts: Array.isArray(raw.comforts) ? raw.comforts : [],
    triggers: Array.isArray(raw.triggers) ? raw.triggers : [],
    loviraHelp: Array.isArray(raw.loviraHelp)
      ? raw.loviraHelp
      : (["daily_checkins", "relationship_rituals", "gentle_insights"] as LoviraHelpId[]),
    completedAt: raw.completedAt ?? new Date().toISOString(),
  };
}

export function getCoupleProfile(): CoupleProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CoupleProfile>;
    const normalized = normalizeCoupleProfile(parsed);
    if (!normalized?.yourName) return null;
    return normalized;
  } catch {
    return null;
  }
}

export function saveCoupleProfile(
  profile: Omit<CoupleProfile, "completedAt"> & { completedAt?: string }
): void {
  const next: CoupleProfile = {
    ...profile,
    completedAt: profile.completedAt ?? new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function hasCoupleProfile(): boolean {
  const profile = getCoupleProfile();
  return Boolean(profile?.yourName && profile.comforts.length > 0);
}

export function updateCoupleProfile(
  patch: Partial<Omit<CoupleProfile, "completedAt">>
): void {
  const existing = getCoupleProfile();
  if (!existing) return;
  saveCoupleProfile({ ...existing, ...patch });
}

export function getCoupleProfileAsEmotionalProfile(): EmotionalSupportProfile | null {
  const profile = getCoupleProfile();
  if (!profile) return null;
  return {
    comforts: profile.comforts,
    triggers: profile.triggers,
    supportStyles: [],
    updatedAt: profile.completedAt,
  };
}
