import type { LoviraData, MoodId } from "@/types/app";

const KEYS = {
  lastPeriodStart: "lovira:lastPeriodStart",
  cycleLength: "lovira:cycleLength",
  moodLog: "lovira:moodLog",
  flowStep: "lovira:flowStep",
} as const;

const DEFAULT_CYCLE_LENGTH = 28;

function migrateMoodLog(raw: unknown): Record<string, MoodId[]> {
  if (!raw || typeof raw !== "object") return {};

  const entries = Object.entries(raw as Record<string, unknown>);
  const result: Record<string, MoodId[]> = {};

  for (const [date, value] of entries) {
    if (Array.isArray(value)) {
      result[date] = value.filter((m): m is MoodId => typeof m === "string");
    } else if (typeof value === "string") {
      result[date] = [value as MoodId];
    }
  }

  return result;
}

export function loadLoviraData(): LoviraData {
  if (typeof window === "undefined") {
    return {
      lastPeriodStart: null,
      cycleLength: DEFAULT_CYCLE_LENGTH,
      moodLog: {},
      flowStep: 1,
    };
  }

  const lastPeriodStart = localStorage.getItem(KEYS.lastPeriodStart);
  const cycleRaw = localStorage.getItem(KEYS.cycleLength);
  const moodRaw = localStorage.getItem(KEYS.moodLog);
  const flowRaw = localStorage.getItem(KEYS.flowStep);

  let moodLog: Record<string, MoodId[]> = {};
  if (moodRaw) {
    try {
      moodLog = migrateMoodLog(JSON.parse(moodRaw));
    } catch {
      moodLog = {};
    }
  }

  const parsedCycle = cycleRaw ? Number(cycleRaw) : DEFAULT_CYCLE_LENGTH;
  const flowStep = flowRaw ? Number(flowRaw) : 1;

  return {
    lastPeriodStart,
    cycleLength:
      Number.isFinite(parsedCycle) && parsedCycle >= 21 && parsedCycle <= 45
        ? parsedCycle
        : DEFAULT_CYCLE_LENGTH,
    moodLog,
    flowStep:
      Number.isFinite(flowStep) && flowStep >= 1 && flowStep <= 4
        ? flowStep
        : 1,
  };
}

export function saveLastPeriodStart(date: string | null): void {
  if (date) {
    localStorage.setItem(KEYS.lastPeriodStart, date);
  } else {
    localStorage.removeItem(KEYS.lastPeriodStart);
  }
}

export function saveMoodsForDate(dateKey: string, moods: MoodId[]): void {
  const data = loadLoviraData();
  data.moodLog[dateKey] = moods;
  localStorage.setItem(KEYS.moodLog, JSON.stringify(data.moodLog));
}

export function saveFlowStep(step: number): void {
  localStorage.setItem(KEYS.flowStep, String(Math.min(4, Math.max(1, step))));
}

export const STORAGE_KEYS = KEYS;

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
