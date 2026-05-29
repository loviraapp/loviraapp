const STORAGE_KEY = "lovira_auth_email_cooldown_until";
const COOLDOWN_MS = 60 * 60 * 1000;

export function setAuthEmailCooldown(): void {
  if (typeof window === "undefined") return;
  const until = new Date(Date.now() + COOLDOWN_MS).toISOString();
  localStorage.setItem(STORAGE_KEY, until);
}

export function getAuthEmailCooldownUntil(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const until = Date.parse(raw);
  return Number.isFinite(until) ? until : null;
}

export function getAuthEmailCooldownRemainingMs(): number {
  const until = getAuthEmailCooldownUntil();
  if (!until) return 0;
  return Math.max(0, until - Date.now());
}

export function isAuthEmailCooldownActive(): boolean {
  return getAuthEmailCooldownRemainingMs() > 0;
}

export function formatCooldownRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
