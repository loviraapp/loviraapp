import type { CycleInfo, CyclePhase } from "@/types/app";

const PHASE_WINDOWS: Record<
  CyclePhase,
  { start: number; end: number; label: string; summary: string }
> = {
  menstrual: {
    start: 1,
    end: 5,
    label: "Menstrual",
    summary: "Rest and comfort matter most. Energy may feel lower — honor that rhythm.",
  },
  follicular: {
    start: 6,
    end: 13,
    label: "Follicular",
    summary: "Clarity and lightness often return. Good time for connection and new plans.",
  },
  ovulation: {
    start: 14,
    end: 16,
    label: "Ovulation",
    summary: "Peak vitality and openness. Communication and intimacy may feel easier.",
  },
  luteal: {
    start: 17,
    end: 28,
    label: "Luteal",
    summary: "Sensitivity can rise. Patience, reassurance, and calm routines help most.",
  },
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return startOfDay(new Date(y, m - 1, d));
}

function daysBetween(start: Date, end: Date): number {
  const ms = startOfDay(end).getTime() - startOfDay(start).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function getPhaseForDay(dayInCycle: number, cycleLength: number): CyclePhase {
  const day = ((dayInCycle - 1) % cycleLength) + 1;
  if (day <= 5) return "menstrual";
  if (day <= 13) return "follicular";
  if (day <= 16) return "ovulation";
  return "luteal";
}

export function calculateCycle(
  lastPeriodStart: string | null,
  cycleLength: number,
  referenceDate: Date = new Date()
): CycleInfo | null {
  if (!lastPeriodStart) return null;

  const start = parseISODate(lastPeriodStart);
  const today = startOfDay(referenceDate);
  const elapsed = daysBetween(start, today);

  if (elapsed < 0) return null;

  const dayInCycle = (elapsed % cycleLength) + 1;
  const phase = getPhaseForDay(dayInCycle, cycleLength);
  const daysUntilNextPeriod = cycleLength - dayInCycle + 1;

  return { phase, dayInCycle, cycleLength, daysUntilNextPeriod };
}

export function getPhaseMeta(phase: CyclePhase) {
  return PHASE_WINDOWS[phase];
}

export const PHASE_ORDER: CyclePhase[] = [
  "menstrual",
  "follicular",
  "ovulation",
  "luteal",
];
