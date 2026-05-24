import type { UserRole } from "@/types/role";
import { hasSupportProfile } from "@/lib/support-profile";

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
  const role = getUserRole();
  if (!role) return false;
  return hasSupportProfile(role);
}

export function clearOnboardingForRoleChange(): void {
  // Role switch re-runs preference setup for the new role if missing.
}
