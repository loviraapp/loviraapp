"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { calculateCycle } from "@/lib/cycle";
import { getPersonalInsight } from "@/lib/insights";
import { getPartnerPreview } from "@/lib/partner-preview";
import { formatMoodList } from "@/lib/mood";
import { getSupportSuggestion } from "@/lib/support-tips";
import {
  getTodayKey,
  loadLoviraData,
  saveFlowStep,
  saveLastPeriodStart,
  saveMoodsForDate,
} from "@/lib/storage";
import type { MoodId } from "@/types/app";
import { PeriodDateForm } from "./period-date-form";
import { CyclePhaseCard } from "./cycle-phase-card";
import { MoodCheckIn } from "./mood-check-in";
import { SupportSuggestionCard } from "./support-suggestion-card";
import { FlowProgress } from "./flow-progress";
import { FlowStepShell } from "./flow-step-shell";
import { PersonalInsightCard } from "./personal-insight-card";
import { PartnerModePreview } from "./partner-mode-preview";
import { PrivacySharingCard } from "./privacy-sharing-card";
import { GentleAwarenessCard } from "./gentle-awareness-card";
import { ContinueButton } from "./continue-button";

function computeMaxStep(
  hasPeriod: boolean,
  moodCount: number
): number {
  if (!hasPeriod) return 1;
  if (moodCount === 0) return 2;
  return 4;
}

export function DashboardView() {
  const [hydrated, setHydrated] = useState(false);
  const [lastPeriodStart, setLastPeriodStart] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [todayMoods, setTodayMoods] = useState<MoodId[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [partnerPreviewOpen, setPartnerPreviewOpen] = useState(false);

  const todayKey = getTodayKey();

  useEffect(() => {
    const data = loadLoviraData();
    const moods = data.moodLog[todayKey] ?? [];
    const hasPeriod = Boolean(data.lastPeriodStart);

    setLastPeriodStart(data.lastPeriodStart ?? "");
    setCycleLength(data.cycleLength);
    setTodayMoods(moods);

    const max = computeMaxStep(hasPeriod, moods.length);
    const step = Math.min(data.flowStep, max);
    setMaxReached(max);
    setCurrentStep(step);
    setHydrated(true);
  }, [todayKey]);

  const handlePeriodChange = useCallback(
    (date: string) => {
      setLastPeriodStart(date);
      saveLastPeriodStart(date || null);
      if (date) {
        setMaxReached((m) => Math.max(m, 2));
      }
    },
    []
  );

  const handleMoodToggle = useCallback(
    (mood: MoodId) => {
      setTodayMoods((prev) => {
        const next = prev.includes(mood)
          ? prev.filter((m) => m !== mood)
          : [...prev, mood];
        saveMoodsForDate(todayKey, next);
        if (next.length > 0) {
          setMaxReached((m) => Math.max(m, 3));
        }
        return next;
      });
    },
    [todayKey]
  );

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    saveFlowStep(step);
  }, []);

  const advanceStep = useCallback(() => {
    setCurrentStep((s) => {
      const next = Math.min(4, s + 1);
      saveFlowStep(next);
      setMaxReached((m) => Math.max(m, next));
      return next;
    });
  }, []);

  const cycle = useMemo(
    () =>
      lastPeriodStart
        ? calculateCycle(lastPeriodStart, cycleLength)
        : null,
    [lastPeriodStart, cycleLength]
  );

  const suggestion = useMemo(
    () => getSupportSuggestion(cycle?.phase ?? null, todayMoods),
    [cycle?.phase, todayMoods]
  );

  const insight = useMemo(
    () => getPersonalInsight(cycle?.phase ?? null, todayMoods),
    [cycle?.phase, todayMoods]
  );

  const partnerPreview = useMemo(
    () => getPartnerPreview(cycle?.phase ?? null, suggestion),
    [cycle?.phase, suggestion]
  );

  const hasPeriod = Boolean(lastPeriodStart);
  const hasMoods = todayMoods.length > 0;

  if (!hydrated) {
    return (
      <div className="dashboard-shell mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-lg bg-border" />
          <div className="h-40 rounded-3xl bg-border/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell mx-auto max-w-2xl px-4 py-8 pb-16 sm:px-6 sm:py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Emotional wellness for couples
        </p>
        <h1 className="mt-2 font-display text-3xl text-foreground">Dashboard</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          A guided check-in for both partners — rhythm, moods, personal insight,
          and gentle support. Saved privately on this device.
        </p>
      </header>

      <FlowProgress
        currentStep={currentStep}
        maxReached={maxReached}
        onStepClick={goToStep}
      />

      <div className="space-y-5">
        <FlowStepShell
          step={1}
          label="Add cycle date"
          title="Start with your rhythm"
          description="Optional for any partner. Helps estimate phase and support context."
          isActive={currentStep === 1}
          isComplete={maxReached > 1}
          footer={
            currentStep === 1 ? (
              <ContinueButton
                onClick={advanceStep}
                disabled={!hasPeriod}
                label={hasPeriod ? "Continue to moods" : "Add a date to continue"}
              />
            ) : null
          }
        >
          <PeriodDateForm value={lastPeriodStart} onChange={handlePeriodChange} />
          {hasPeriod && cycle ? (
            <div className="mt-5">
              <CyclePhaseCard cycle={cycle} hasPeriodDate />
            </div>
          ) : null}
        </FlowStepShell>

        <FlowStepShell
          step={2}
          label="Today's moods"
          title="How are you feeling?"
          description="Select all that apply — couples often feel more than one thing at once."
          isActive={currentStep === 2}
          isComplete={maxReached > 2}
          footer={
            currentStep === 2 ? (
              <ContinueButton
                onClick={advanceStep}
                disabled={!hasMoods}
                label={
                  hasMoods
                    ? `Continue (${todayMoods.length} selected)`
                    : "Select at least one mood"
                }
              />
            ) : null
          }
        >
          <MoodCheckIn selected={todayMoods} onToggle={handleMoodToggle} />
          {hasMoods ? (
            <p className="mt-3 text-xs text-muted">
              Today: {formatMoodList(todayMoods)}
            </p>
          ) : null}
        </FlowStepShell>

        <FlowStepShell
          step={3}
          label="Personal insight"
          title="Your reflection"
          description="Private to you — not shown in Partner Mode."
          isActive={currentStep === 3}
          isComplete={maxReached > 3}
          footer={
            currentStep === 3 ? (
              <ContinueButton
                onClick={advanceStep}
                label="View partner support"
              />
            ) : null
          }
        >
          <PersonalInsightCard insight={insight} />
        </FlowStepShell>

        <FlowStepShell
          step={4}
          label="Partner support"
          title="Support insight for your partner"
          description="Gentle guidance they can use — without exposing your private check-in."
          isActive={currentStep === 4}
          isComplete={maxReached >= 4}
        >
          <SupportSuggestionCard
            suggestion={suggestion}
            phase={cycle?.phase ?? null}
          />
          <div className="mt-5 space-y-4">
            <PartnerModePreview
              preview={partnerPreview}
              isOpen={partnerPreviewOpen}
              onToggle={() => setPartnerPreviewOpen((o) => !o)}
            />
            <PrivacySharingCard />
            <GentleAwarenessCard />
          </div>
        </FlowStepShell>
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        <Link href="/" className="text-accent transition-opacity hover:opacity-80">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
