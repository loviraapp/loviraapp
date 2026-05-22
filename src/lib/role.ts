import type { UserRole } from "@/types/role";

const KEYS = {
  userRole: "lovira:userRole",
  onboardingComplete: "lovira:onboardingComplete",
} as const;

export function getUserRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS.userRole);
  if (raw === "tracking" || raw === "support") return raw;
  return null;
}

export function setUserRole(role: UserRole): void {
  localStorage.setItem(KEYS.userRole, role);
  localStorage.setItem(KEYS.onboardingComplete, "true");
}

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEYS.onboardingComplete) === "true";
}

export function clearOnboardingForRoleChange(): void {
  localStorage.removeItem(KEYS.onboardingComplete);
}
