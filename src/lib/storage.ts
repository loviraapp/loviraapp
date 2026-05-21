import type { LoviraData, MoodId } from "@/types/app";

const KEYS = {
  lastPeriodStart: "lovira:lastPeriodStart",
  cycleLength: "lovira:cycleLength",
  moodLog: "lovira:moodLog",
} as const;

const DEFAULT_CYCLE_LENGTH = 28;

export function loadLoviraData(): LoviraData {
  if (typeof window === "undefined") {
    return { lastPeriodStart: null, cycleLength: DEFAULT_CYCLE_LENGTH, moodLog: {} };
  }

  const lastPeriodStart = localStorage.getItem(KEYS.lastPeriodStart);
  const cycleRaw = localStorage.getItem(KEYS.cycleLength);
  const moodRaw = localStorage.getItem(KEYS.moodLog);

  let moodLog: Record<string, MoodId> = {};
  if (moodRaw) {
    try {
      moodLog = JSON.parse(moodRaw) as Record<string, MoodId>;
    } catch {
      moodLog = {};
    }
  }

  const parsedCycle = cycleRaw ? Number(cycleRaw) : DEFAULT_CYCLE_LENGTH;

  return {
    lastPeriodStart,
    cycleLength:
      Number.isFinite(parsedCycle) && parsedCycle >= 21 && parsedCycle <= 45
        ? parsedCycle
        : DEFAULT_CYCLE_LENGTH,
    moodLog,
  };
}

export function saveLastPeriodStart(date: string | null): void {
  if (date) {
    localStorage.setItem(KEYS.lastPeriodStart, date);
  } else {
    localStorage.removeItem(KEYS.lastPeriodStart);
  }
}

export function saveMoodForDate(dateKey: string, mood: MoodId): void {
  const data = loadLoviraData();
  data.moodLog[dateKey] = mood;
  localStorage.setItem(KEYS.moodLog, JSON.stringify(data.moodLog));
}

/** Step 4 — single place for all persisted keys */
export const STORAGE_KEYS = KEYS;

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
