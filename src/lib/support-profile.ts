import type { EmotionalSupportProfile } from "@/types/support-preferences";
import type { UserRole } from "@/types/role";

const KEY_PREFIX = "lovira:supportProfile:";

const EMPTY: EmotionalSupportProfile = {
  comforts: [],
  triggers: [],
  supportStyles: [],
  updatedAt: "",
};

function profileKey(role: UserRole): string {
  return `${KEY_PREFIX}${role}`;
}

export function getSupportProfile(role: UserRole): EmotionalSupportProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(profileKey(role));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EmotionalSupportProfile;
    if (!Array.isArray(parsed.comforts)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasSupportProfile(role: UserRole): boolean {
  const profile = getSupportProfile(role);
  return Boolean(profile && profile.comforts.length > 0);
}

export function saveSupportProfile(
  role: UserRole,
  profile: Omit<EmotionalSupportProfile, "updatedAt">
): void {
  const next: EmotionalSupportProfile = {
    ...EMPTY,
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(profileKey(role), JSON.stringify(next));
}

export function getPartnerRole(role: UserRole): UserRole {
  return role === "tracking" ? "support" : "tracking";
}
