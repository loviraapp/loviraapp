import type { LoviraData, MoodId, PartnerCheckIn } from "@/types/app";

const KEYS = {
  lastPeriodStart: "lovira:lastPeriodStart",
  cycleLength: "lovira:cycleLength",
  moodLog: "lovira:moodLog",
  partnerCheckInLog: "lovira:partnerCheckInLog",
  flowStep: "lovira:flowStep",
} as const;

const DEFAULT_CYCLE_LENGTH = 28;

const EMPTY_PARTNER_CHECK_IN: PartnerCheckIn = {
  moods: [],
  energy: null,
  supportIntention: null,
};

function migrateMoodLog(raw: unknown): Record<string, MoodId[]> {
  if (!raw || typeof raw !== "object") return {};

  const result: Record<string, MoodId[]> = {};
  for (const [date, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      result[date] = value.filter((m): m is MoodId => typeof m === "string");
    } else if (typeof value === "string") {
      result[date] = [value as MoodId];
    }
  }
  return result;
}

function migratePartnerLog(raw: unknown): Record<string, PartnerCheckIn> {
  if (!raw || typeof raw !== "object") return {};

  const result: Record<string, PartnerCheckIn> = {};
  for (const [date, value] of Object.entries(raw as Record<string, unknown>)) {
    if (value && typeof value === "object") {
      const v = value as Partial<PartnerCheckIn>;
      result[date] = {
        moods: Array.isArray(v.moods) ? v.moods : [],
        energy: v.energy ?? null,
        supportIntention: v.supportIntention ?? null,
      };
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
      partnerCheckInLog: {},
      flowStep: 1,
    };
  }

  const lastPeriodStart = localStorage.getItem(KEYS.lastPeriodStart);
  const cycleRaw = localStorage.getItem(KEYS.cycleLength);
  const moodRaw = localStorage.getItem(KEYS.moodLog);
  const partnerRaw = localStorage.getItem(KEYS.partnerCheckInLog);
  const flowRaw = localStorage.getItem(KEYS.flowStep);

  let moodLog: Record<string, MoodId[]> = {};
  if (moodRaw) {
    try {
      moodLog = migrateMoodLog(JSON.parse(moodRaw));
    } catch {
      moodLog = {};
    }
  }

  let partnerCheckInLog: Record<string, PartnerCheckIn> = {};
  if (partnerRaw) {
    try {
      partnerCheckInLog = migratePartnerLog(JSON.parse(partnerRaw));
    } catch {
      partnerCheckInLog = {};
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
    partnerCheckInLog,
    flowStep:
      Number.isFinite(flowStep) && flowStep >= 1 && flowStep <= 5
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

export function savePartnerCheckIn(
  dateKey: string,
  checkIn: PartnerCheckIn
): void {
  const data = loadLoviraData();
  data.partnerCheckInLog[dateKey] = checkIn;
  localStorage.setItem(
    KEYS.partnerCheckInLog,
    JSON.stringify(data.partnerCheckInLog)
  );
}

export function getPartnerCheckIn(dateKey: string): PartnerCheckIn {
  return loadLoviraData().partnerCheckInLog[dateKey] ?? { ...EMPTY_PARTNER_CHECK_IN };
}

export function saveFlowStep(step: number): void {
  localStorage.setItem(KEYS.flowStep, String(Math.min(5, Math.max(1, step))));
}

export const STORAGE_KEYS = KEYS;

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isPartnerCheckInStarted(checkIn: PartnerCheckIn): boolean {
  return (
    checkIn.moods.length > 0 ||
    checkIn.energy !== null ||
    checkIn.supportIntention !== null
  );
}
