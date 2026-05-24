import type { UserRole } from "@/types/role";
import { hasCoupleProfile } from "@/lib/couple-profile";

const KEYS = {
  userRole: "lovira:userRole",
} as const;

export function getUserRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS.userRole);
  if (raw === "tracking" || raw === "support") return raw;
  return null;
}

export function setUserRole(role: UserRole): void {
  localStorage.setItem(KEYS.userRole, role);
}

export function isOnboardingComplete(): boolean {
  return hasCoupleProfile();
}

export function clearOnboardingForRoleChange(): void {
  // Couple profile persists; revisit onboarding to update.
}
