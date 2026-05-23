import type { LoviraData, MoodId, NeedId, PartnerCheckIn } from "@/types/app";
import { markDayComplete, isRitualComplete } from "@/lib/streak";

const KEYS = {
  lastPeriodStart: "lovira:lastPeriodStart",
  cycleLength: "lovira:cycleLength",
  moodLog: "lovira:moodLog",
  needLog: "lovira:needLog",
  partnerCheckInLog: "lovira:partnerCheckInLog",
  partnerNeedLog: "lovira:partnerNeedLog",
  flowStep: "lovira:flowStep",
  ritualStep: "lovira:ritualStep",
} as const;

const DEFAULT_CYCLE_LENGTH = 28;

const EMPTY_PARTNER: PartnerCheckIn = {
  moods: [],
  needs: [],
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

function migrateNeedLog(raw: unknown): Record<string, NeedId[]> {
  if (!raw || typeof raw !== "object") return {};
  const result: Record<string, NeedId[]> = {};
  for (const [date, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      result[date] = value.filter((n): n is NeedId => typeof n === "string");
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
        needs: Array.isArray(v.needs) ? v.needs : [],
        energy: v.energy ?? null,
        supportIntention: v.supportIntention ?? null,
      };
    }
  }
  return result;
}

function intentionToNeed(intention: PartnerCheckIn["supportIntention"]): NeedId | null {
  if (!intention) return null;
  const map: Record<string, NeedId> = {
    listening: "calm_conversation",
    tasks: "tasks",
    space: "space",
    calm_time: "rest",
    kind_message: "appreciation",
  };
  return map[intention] ?? null;
}

export function loadLoviraData(): LoviraData {
  if (typeof window === "undefined") {
    return {
      lastPeriodStart: null,
      cycleLength: DEFAULT_CYCLE_LENGTH,
      moodLog: {},
      needLog: {},
      partnerCheckInLog: {},
      partnerNeedLog: {},
      flowStep: 1,
      ritualStep: 1,
      completedDates: [],
    };
  }

  const lastPeriodStart = localStorage.getItem(KEYS.lastPeriodStart);
  const cycleRaw = localStorage.getItem(KEYS.cycleLength);
  const moodRaw = localStorage.getItem(KEYS.moodLog);
  const needRaw = localStorage.getItem(KEYS.needLog);
  const partnerRaw = localStorage.getItem(KEYS.partnerCheckInLog);
  const partnerNeedRaw = localStorage.getItem(KEYS.partnerNeedLog);
  const flowRaw = localStorage.getItem(KEYS.flowStep);
  const ritualRaw = localStorage.getItem(KEYS.ritualStep);

  let moodLog: Record<string, MoodId[]> = {};
  if (moodRaw) {
    try {
      moodLog = migrateMoodLog(JSON.parse(moodRaw));
    } catch {
      moodLog = {};
    }
  }

  let needLog: Record<string, NeedId[]> = {};
  if (needRaw) {
    try {
      needLog = migrateNeedLog(JSON.parse(needRaw));
    } catch {
      needLog = {};
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
  let partnerNeedLog: Record<string, NeedId[]> = {};
  if (partnerNeedRaw) {
    try {
      partnerNeedLog = migrateNeedLog(JSON.parse(partnerNeedRaw));
    } catch {
      partnerNeedLog = {};
    }
  }

  for (const [date, checkIn] of Object.entries(partnerCheckInLog)) {
    if (checkIn.needs.length === 0) {
      const fromIntention = intentionToNeed(checkIn.supportIntention);
      if (fromIntention) checkIn.needs = [fromIntention];
    }
    if (partnerNeedLog[date]?.length) {
      checkIn.needs = partnerNeedLog[date];
    }
  }

  const parsedCycle = cycleRaw ? Number(cycleRaw) : DEFAULT_CYCLE_LENGTH;
  const flowStep = flowRaw ? Number(flowRaw) : 1;
  const ritualStep = ritualRaw ? Number(ritualRaw) : 1;

  return {
    lastPeriodStart,
    cycleLength:
      Number.isFinite(parsedCycle) && parsedCycle >= 21 && parsedCycle <= 45
        ? parsedCycle
        : DEFAULT_CYCLE_LENGTH,
    moodLog,
    needLog,
    partnerCheckInLog,
    partnerNeedLog,
    flowStep:
      Number.isFinite(flowStep) && flowStep >= 1 && flowStep <= 5
        ? flowStep
        : 1,
    ritualStep:
      Number.isFinite(ritualStep) && ritualStep >= 1 && ritualStep <= 3
        ? ritualStep
        : 1,
    completedDates: [],
  };
}

export function saveLastPeriodStart(date: string | null): void {
  if (date) localStorage.setItem(KEYS.lastPeriodStart, date);
  else localStorage.removeItem(KEYS.lastPeriodStart);
}

export function saveMoodsForDate(dateKey: string, moods: MoodId[]): void {
  const data = loadLoviraData();
  data.moodLog[dateKey] = moods;
  localStorage.setItem(KEYS.moodLog, JSON.stringify(data.moodLog));
  maybeMarkComplete(dateKey);
}

export function saveNeedsForDate(dateKey: string, needs: NeedId[]): void {
  const data = loadLoviraData();
  data.needLog[dateKey] = needs;
  localStorage.setItem(KEYS.needLog, JSON.stringify(data.needLog));
  maybeMarkComplete(dateKey);
}

export function getNeedsForDate(dateKey: string): NeedId[] {
  return loadLoviraData().needLog[dateKey] ?? [];
}

export function savePartnerCheckIn(dateKey: string, checkIn: PartnerCheckIn): void {
  const data = loadLoviraData();
  data.partnerCheckInLog[dateKey] = checkIn;
  localStorage.setItem(
    KEYS.partnerCheckInLog,
    JSON.stringify(data.partnerCheckInLog)
  );
  if (checkIn.needs.length) {
    data.partnerNeedLog[dateKey] = checkIn.needs;
    localStorage.setItem(
      KEYS.partnerNeedLog,
      JSON.stringify(data.partnerNeedLog)
    );
  }
  maybeMarkComplete(dateKey);
}

export function getPartnerCheckIn(dateKey: string): PartnerCheckIn {
  const raw = loadLoviraData().partnerCheckInLog[dateKey];
  return raw ? { ...EMPTY_PARTNER, ...raw } : { ...EMPTY_PARTNER };
}

export function saveFlowStep(step: number): void {
  localStorage.setItem(KEYS.flowStep, String(Math.min(5, Math.max(1, step))));
}

export function saveRitualStep(step: number): void {
  localStorage.setItem(KEYS.ritualStep, String(Math.min(3, Math.max(1, step))));
}

export function getRitualStep(): number {
  const raw = localStorage.getItem(KEYS.ritualStep);
  const n = raw ? Number(raw) : 1;
  return Number.isFinite(n) && n >= 1 && n <= 3 ? n : 1;
}

function maybeMarkComplete(dateKey: string): void {
  const data = loadLoviraData();
  const me = data.moodLog[dateKey] ?? [];
  const meNeeds = data.needLog[dateKey] ?? [];
  const partner = data.partnerCheckInLog[dateKey];
  if (
    isRitualComplete(
      me,
      meNeeds,
      partner?.moods ?? [],
      partner?.needs ?? []
    )
  ) {
    markDayComplete(dateKey);
  }
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
    checkIn.needs.length > 0 ||
    checkIn.energy !== null ||
    checkIn.supportIntention !== null
  );
}
