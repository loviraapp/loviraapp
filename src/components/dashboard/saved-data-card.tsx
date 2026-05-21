"use client";

import { getMoodById } from "@/lib/mood";
import type { MoodId } from "@/types/app";
import { StepLabel } from "./step-label";

type SavedDataCardProps = {
  lastPeriodStart: string;
  todayMood: MoodId | null;
  moodEntryCount: number;
};

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SavedDataCard({
  lastPeriodStart,
  todayMood,
  moodEntryCount,
}: SavedDataCardProps) {
  const hasPeriod = Boolean(lastPeriodStart);
  const hasMood = Boolean(todayMood);

  return (
    <section className="dashboard-card">
      <StepLabel step={4} label="Saved on this device" />

      <h2 className="font-display text-xl text-foreground">Your private data</h2>
      <p className="mt-2 text-sm text-muted">
        Everything below is stored in your browser only — no account, no cloud.
      </p>

      <ul className="mt-5 space-y-3">
        <SavedRow
          label="Last period start"
          value={hasPeriod ? formatDisplayDate(lastPeriodStart) : "Not set yet"}
          saved={hasPeriod}
        />
        <SavedRow
          label="Mood today"
          value={
            hasMood
              ? `${getMoodById(todayMood!).emoji} ${getMoodById(todayMood!).label}`
              : "Not checked in yet"
          }
          saved={hasMood}
        />
        <SavedRow
          label="Mood history"
          value={
            moodEntryCount === 0
              ? "No past entries"
              : `${moodEntryCount} day${moodEntryCount === 1 ? "" : "s"} logged`
          }
          saved={moodEntryCount > 0}
        />
      </ul>

      <p className="mt-5 flex items-center gap-2 text-xs text-muted">
        <span
          className={`h-2 w-2 rounded-full ${hasPeriod || hasMood ? "bg-emerald-500" : "bg-border"}`}
          aria-hidden
        />
        {hasPeriod || hasMood
          ? "Auto-saved to localStorage"
          : "Updates save automatically as you go"}
      </p>
    </section>
  );
}

function SavedRow({
  label,
  value,
  saved,
}: {
  label: string;
  value: string;
  saved: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-xl bg-background/80 px-4 py-3 ring-1 ring-border/60">
      <span className="text-sm text-muted">{label}</span>
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        {saved ? (
          <span className="text-emerald-600" aria-label="Saved">
            ✓
          </span>
        ) : null}
        {value}
      </span>
    </li>
  );
}
