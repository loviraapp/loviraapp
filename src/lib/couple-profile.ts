import type { EmotionalSupportProfile } from "@/types/support-preferences";
import type { CoupleProfile } from "@/types/couple-profile";

const KEY = "lovira:coupleProfile";

export function getCoupleProfile(): CoupleProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CoupleProfile;
    if (!parsed.yourName || !parsed.completedAt) return null;
    return parsed;
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
