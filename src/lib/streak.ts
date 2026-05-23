const KEY = "lovira:completedDates";

export function loadCompletedDates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((d): d is string => typeof d === "string")
      : [];
  } catch {
    return [];
  }
}

export function markDayComplete(dateKey: string): void {
  const dates = loadCompletedDates();
  if (!dates.includes(dateKey)) {
    dates.push(dateKey);
    dates.sort();
    localStorage.setItem(KEY, JSON.stringify(dates));
  }
}

export function getConnectionStreak(dateKey: string): number {
  const dates = new Set(loadCompletedDates());
  if (!dates.has(dateKey)) {
    dates.add(dateKey);
  }

  let streak = 0;
  const cursor = new Date(dateKey + "T12:00:00");

  while (true) {
    const key = formatDateKey(cursor);
    if (!dates.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return Math.max(streak, dates.has(dateKey) ? 1 : 0);
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isRitualComplete(
  meMoods: unknown[],
  meNeeds: unknown[],
  partnerMoods: unknown[],
  partnerNeeds: unknown[]
): boolean {
  const meDone = meMoods.length > 0 && meNeeds.length > 0;
  const partnerDone = partnerMoods.length > 0 && partnerNeeds.length > 0;
  return meDone && partnerDone;
}
