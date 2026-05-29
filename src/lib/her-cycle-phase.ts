export type HerCyclePhaseId =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal"
  | "late";

export type HerCyclePhaseInfo = {
  id: HerCyclePhaseId;
  label: string;
  dayInCycle: number;
  description: string;
};

const PHASE_COPY: Record<
  HerCyclePhaseId,
  { label: string; description: string }
> = {
  menstrual: {
    label: "Menstrual phase",
    description:
      "Your body is asking for softness. Rest isn’t lazy — it’s how you refill.",
  },
  follicular: {
    label: "Follicular phase",
    description:
      "Energy often starts to return. You might feel clearer, lighter, more open.",
  },
  ovulation: {
    label: "Ovulation",
    description:
      "A peak moment for connection. You may feel more expressive and present.",
  },
  luteal: {
    label: "Luteal phase",
    description:
      "Feelings can run closer to the surface. Small reassurances go a long way.",
  },
  late: {
    label: "Late / irregular",
    description:
      "Your rhythm might be shifting. Be gentle with yourself — there’s no “wrong” timing.",
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

export function getPhaseForDay(day: number, cycleLength: number): HerCyclePhaseId {
  if (day > cycleLength || day >= 29) return "late";
  if (day <= 5) return "menstrual";
  if (day <= 12) return "follicular";
  if (day <= 15) return "ovulation";
  return "luteal";
}

export function calculateDayOfCycle(
  lastPeriod: string | null,
  referenceDate: Date = new Date()
): number | null {
  if (!lastPeriod) return null;

  const start = parseISODate(lastPeriod);
  const today = startOfDay(referenceDate);
  const elapsed = daysBetween(start, today);

  if (elapsed < 0) return null;
  return elapsed + 1;
}

export function calculateHerCyclePhase(
  lastPeriod: string | null,
  cycleLength: number,
  referenceDate: Date = new Date()
): HerCyclePhaseInfo | null {
  if (!lastPeriod) return null;

  const start = parseISODate(lastPeriod);
  const today = startOfDay(referenceDate);
  const elapsed = daysBetween(start, today);

  if (elapsed < 0) return null;

  const dayInCycle = elapsed + 1;
  const id = getPhaseForDay(dayInCycle, cycleLength);
  const copy = PHASE_COPY[id];

  return {
    id,
    label: copy.label,
    dayInCycle,
    description: copy.description,
  };
}
