export type HerPrivacySetting = "phase_only" | "phase_and_mood" | "manual";

export type HerCheckInOption =
  | "quiet_rest"
  | "feel_heard"
  | "physical_closeness"
  | "space_process";

export const HER_CHECK_IN_LABELS: Record<HerCheckInOption, string> = {
  quiet_rest: "Quiet and rest",
  feel_heard: "To feel heard",
  physical_closeness: "Physical closeness",
  space_process: "Space to process",
};

const KEYS = {
  onboardingComplete: "lovira_onboarding_complete",
  lastPeriod: "lovira_last_period",
  cycleLength: "lovira_cycle_length",
  privacy: "lovira_privacy_setting",
  checkInPrefix: "lovira_checkin_",
} as const;

export function isHerOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEYS.onboardingComplete) === "true";
}

export function setHerOnboardingComplete(): void {
  localStorage.setItem(KEYS.onboardingComplete, "true");
}

export function getHerLastPeriod(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.lastPeriod);
}

export function setHerLastPeriod(isoDate: string | null): void {
  if (isoDate) {
    localStorage.setItem(KEYS.lastPeriod, isoDate);
  } else {
    localStorage.removeItem(KEYS.lastPeriod);
  }
}

export function getHerCycleLength(): number {
  if (typeof window === "undefined") return 28;
  const raw = localStorage.getItem(KEYS.cycleLength);
  const n = raw ? Number.parseInt(raw, 10) : 28;
  return Number.isFinite(n) && n >= 21 && n <= 40 ? n : 28;
}

export function setHerCycleLength(days: number): void {
  localStorage.setItem(KEYS.cycleLength, String(days));
}

export function getHerPrivacySetting(): HerPrivacySetting {
  if (typeof window === "undefined") return "phase_and_mood";
  const raw = localStorage.getItem(KEYS.privacy);
  if (
    raw === "phase_only" ||
    raw === "phase_and_mood" ||
    raw === "manual"
  ) {
    return raw;
  }
  return "phase_and_mood";
}

export function setHerPrivacySetting(setting: HerPrivacySetting): void {
  localStorage.setItem(KEYS.privacy, setting);
}

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getHerCheckInForDate(dateKey: string): HerCheckInOption | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`${KEYS.checkInPrefix}${dateKey}`);
  if (
    raw === "quiet_rest" ||
    raw === "feel_heard" ||
    raw === "physical_closeness" ||
    raw === "space_process"
  ) {
    return raw;
  }
  return null;
}

export function setHerCheckInForDate(
  dateKey: string,
  value: HerCheckInOption
): void {
  localStorage.setItem(`${KEYS.checkInPrefix}${dateKey}`, value);
}
