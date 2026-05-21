"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { calculateCycle } from "@/lib/cycle";
import { getSupportSuggestion } from "@/lib/support-tips";
import {
  getTodayKey,
  loadLoviraData,
  saveLastPeriodStart,
  saveMoodForDate,
} from "@/lib/storage";
import type { MoodId } from "@/types/app";
import { PeriodDateForm } from "./period-date-form";
import { CyclePhaseCard } from "./cycle-phase-card";
import { MoodCheckIn } from "./mood-check-in";
import { SavedDataCard } from "./saved-data-card";
import { SupportSuggestionCard } from "./support-suggestion-card";

export function DashboardView() {
  const [hydrated, setHydrated] = useState(false);
  const [lastPeriodStart, setLastPeriodStart] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [todayMood, setTodayMood] = useState<MoodId | null>(null);
  const [moodEntryCount, setMoodEntryCount] = useState(0);

  const todayKey = getTodayKey();

  useEffect(() => {
    const data = loadLoviraData();
    setLastPeriodStart(data.lastPeriodStart ?? "");
    setCycleLength(data.cycleLength);
    setTodayMood(data.moodLog[todayKey] ?? null);
    setMoodEntryCount(Object.keys(data.moodLog).length);
    setHydrated(true);
  }, [todayKey]);

  const handlePeriodChange = useCallback((date: string) => {
    setLastPeriodStart(date);
    saveLastPeriodStart(date || null);
    setMoodEntryCount(Object.keys(loadLoviraData().moodLog).length);
  }, []);

  const handleMoodSelect = useCallback(
    (mood: MoodId) => {
      setTodayMood(mood);
      saveMoodForDate(todayKey, mood);
      setMoodEntryCount(Object.keys(loadLoviraData().moodLog).length);
    },
    [todayKey]
  );

  const cycle = useMemo(
    () =>
      lastPeriodStart
        ? calculateCycle(lastPeriodStart, cycleLength)
        : null,
    [lastPeriodStart, cycleLength]
  );

  const suggestion = useMemo(
    () => getSupportSuggestion(cycle?.phase ?? null, todayMood),
    [cycle?.phase, todayMood]
  );

  if (!hydrated) {
    return (
      <div className="dashboard-shell mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-lg bg-border" />
          <div className="h-40 rounded-3xl bg-border/80" />
          <div className="h-40 rounded-3xl bg-border/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell mx-auto max-w-2xl px-4 py-8 pb-16 sm:px-6 sm:py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Your space
        </p>
        <h1 className="mt-2 font-display text-3xl text-foreground">Dashboard</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Track your rhythm, check in with mood, and see gentle support ideas for
          your partner — saved privately on this device.
        </p>
      </header>

      <div className="space-y-5">
        <PeriodDateForm
          value={lastPeriodStart}
          onChange={handlePeriodChange}
        />
        <CyclePhaseCard
          cycle={cycle}
          hasPeriodDate={Boolean(lastPeriodStart)}
        />
        <MoodCheckIn selected={todayMood} onSelect={handleMoodSelect} />
        <SavedDataCard
          lastPeriodStart={lastPeriodStart}
          todayMood={todayMood}
          moodEntryCount={moodEntryCount}
        />
        <SupportSuggestionCard
          suggestion={suggestion}
          phase={cycle?.phase ?? null}
          mood={todayMood}
        />
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        <Link href="/" className="text-accent transition-opacity hover:opacity-80">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
