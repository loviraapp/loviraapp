import type { NeedId } from "@/types/app";
import { loadCompletedDates, loadRitualCompletedDates } from "@/lib/streak";
import { loadLoviraData } from "@/lib/storage";

export type SoftStreak = {
  emoji: string;
  label: string;
  count: number;
};

export function getSoftStreaks(): SoftStreak[] {
  const data = loadLoviraData();
  const completed = loadCompletedDates();
  const ritualDates = loadRitualCompletedDates();
  const dates = Object.keys(data.moodLog);

  let calmEvenings = 0;
  let appreciationDays = 0;

  for (const date of dates) {
    const needs = [
      ...(data.needLog[date] ?? []),
      ...(data.partnerCheckInLog[date]?.needs ?? []),
    ];
    if (needs.includes("rest") || needs.includes("space")) calmEvenings++;
    if (needs.includes("appreciation") || needs.includes("reassurance")) {
      appreciationDays++;
    }
  }

  const ritualStreak = getConsecutiveCompleted(ritualDates);

  return [
    {
      emoji: "✨",
      label: "connection moments",
      count: completed.length,
    },
    {
      emoji: "🌙",
      label: "calm evenings together",
      count: calmEvenings,
    },
    {
      emoji: "💛",
      label: "appreciation shared",
      count: appreciationDays,
    },
    {
      emoji: "🌿",
      label: "ritual streak",
      count: ritualStreak,
    },
  ];
}

function getConsecutiveCompleted(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort();
  const today = sorted[sorted.length - 1];
  let streak = 0;
  const cursor = new Date(today + "T12:00:00");

  while (true) {
    const key = formatKey(cursor);
    if (!dates.includes(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function formatKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getNeedPhrase(needs: NeedId[]): string {
  if (needs.length === 0) return "What may help tonight?";
  const labels: Record<NeedId, string> = {
    space: "A little space",
    reassurance: "Reassurance",
    tasks: "Help with something small",
    calm_conversation: "Calm conversation",
    affection: "Warmth and closeness",
    rest: "Rest tonight",
    playfulness: "Something playful",
    appreciation: "To feel appreciated",
  };
  return needs.map((n) => labels[n]).slice(0, 2).join(" · ");
}
