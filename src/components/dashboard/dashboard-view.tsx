"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { calculateCycle } from "@/lib/cycle";
import { getCoupleInsight } from "@/lib/couple-insights";
import { getPersonalInsight } from "@/lib/insights";
import { getPartnerPreview } from "@/lib/partner-preview";
import { formatMoodList } from "@/lib/mood";
import { formatPartnerMoodList } from "@/lib/partner-mood";
import { getSupportSuggestion } from "@/lib/support-tips";
import {
  getTodayKey,
  getPartnerCheckIn,
  isPartnerCheckInStarted,
  loadLoviraData,
  saveFlowStep,
  saveLastPeriodStart,
  saveMoodsForDate,
  savePartnerCheckIn,
} from "@/lib/storage";
import type { MoodId, PartnerCheckIn, PartnerMoodId } from "@/types/app";
import { PeriodDateForm } from "./period-date-form";
import { CyclePhaseCard } from "./cycle-phase-card";
import { MoodCheckIn } from "./mood-check-in";
import { SupportSuggestionCard } from "./support-suggestion-card";
import { FlowProgress } from "./flow-progress";
import { FlowStepShell } from "./flow-step-shell";
import { PersonalInsightCard } from "./personal-insight-card";
import { CoupleInsightCard } from "./couple-insight-card";
import { PartnerCheckInSection } from "./partner-check-in-section";
import { PartnerModePreview } from "./partner-mode-preview";
import { PrivacySharingCard } from "./privacy-sharing-card";
import { GentleAwarenessCard } from "./gentle-awareness-card";
import { BalancedPositioning } from "./balanced-positioning";
import { ContinueButton } from "./continue-button";

function computeMaxStep(
  hasPrimaryMoods: boolean,
  partnerStarted: boolean
): number {
  if (!hasPrimaryMoods) return 2;
  if (!partnerStarted) return 3;
  return 5;
}

export function DashboardView() {
  const [hydrated, setHydrated] = useState(false);
  const [lastPeriodStart, setLastPeriodStart] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [todayMoods, setTodayMoods] = useState<MoodId[]>([]);
  const [partnerCheckIn, setPartnerCheckIn] = useState<PartnerCheckIn>({
    moods: [],
    energy: null,
    supportIntention: null,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [partnerPreviewOpen, setPartnerPreviewOpen] = useState(false);

  const todayKey = getTodayKey();

  const persistPartner = useCallback(
    (next: PartnerCheckIn) => {
      setPartnerCheckIn(next);
      savePartnerCheckIn(todayKey, next);
      if (isPartnerCheckInStarted(next)) {
        setMaxReached((m) => Math.max(m, 4));
      }
    },
    [todayKey]
  );

  useEffect(() => {
    const data = loadLoviraData();
    const moods = data.moodLog[todayKey] ?? [];
    const partner = getPartnerCheckIn(todayKey);

    setLastPeriodStart(data.lastPeriodStart ?? "");
    setCycleLength(data.cycleLength);
    setTodayMoods(moods);
    setPartnerCheckIn(partner);

    const max = computeMaxStep(
      moods.length > 0,
      isPartnerCheckInStarted(partner)
    );
    const step = Math.min(data.flowStep, max);
    setMaxReached(Math.max(max, step));
    setCurrentStep(step);
    setHydrated(true);
  }, [todayKey]);

  const handlePeriodChange = useCallback((date: string) => {
    setLastPeriodStart(date);
    saveLastPeriodStart(date || null);
  }, []);

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

  const handlePartnerMoodToggle = useCallback(
    (mood: PartnerMoodId) => {
      const nextMoods = partnerCheckIn.moods.includes(mood)
        ? partnerCheckIn.moods.filter((m) => m !== mood)
        : [...partnerCheckIn.moods, mood];
      persistPartner({ ...partnerCheckIn, moods: nextMoods });
    },
    [partnerCheckIn, persistPartner]
  );

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    saveFlowStep(step);
  }, []);

  const advanceStep = useCallback(() => {
    setCurrentStep((s) => {
      const next = Math.min(5, s + 1);
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

  const personalInsight = useMemo(
    () => getPersonalInsight(cycle?.phase ?? null, todayMoods),
    [cycle?.phase, todayMoods]
  );

  const coupleInsight = useMemo(
    () => getCoupleInsight(todayMoods, partnerCheckIn),
    [todayMoods, partnerCheckIn]
  );

  const partnerPreview = useMemo(
    () =>
      getPartnerPreview(
        cycle?.phase ?? null,
        suggestion,
        coupleInsight,
        partnerCheckIn
      ),
    [cycle?.phase, suggestion, coupleInsight, partnerCheckIn]
  );

  const hasPrimaryMoods = todayMoods.length > 0;
  const partnerStarted = isPartnerCheckInStarted(partnerCheckIn);

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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Emotional wellness for couples
        </p>
        <h1 className="mt-2 font-display text-3xl text-foreground">Dashboard</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Both partners can check in. Both deserve support — saved privately on
          this device.
        </p>
        <div className="mt-4">
          <BalancedPositioning />
        </div>
      </header>

      <FlowProgress
        currentStep={currentStep}
        maxReached={maxReached}
        onStepClick={goToStep}
      />

      <div className="space-y-5">
        <FlowStepShell
          step={1}
          label="Rhythm context"
          title="Optional rhythm context"
          description="One lens for the relationship — not the whole story. Skip anytime."
          isActive={currentStep === 1}
          isComplete={maxReached > 1}
          footer={
            currentStep === 1 ? (
              <ContinueButton
                onClick={advanceStep}
                label="Continue to your check-in"
              />
            ) : null
          }
        >
          <PeriodDateForm value={lastPeriodStart} onChange={handlePeriodChange} />
          {lastPeriodStart && cycle ? (
            <div className="mt-5">
              <CyclePhaseCard cycle={cycle} hasPeriodDate />
            </div>
          ) : null}
        </FlowStepShell>

        <FlowStepShell
          step={2}
          label="Your check-in"
          title="How are you feeling?"
          description="Your moods — private in Partner Mode. Select all that apply."
          isActive={currentStep === 2}
          isComplete={maxReached > 2}
          footer={
            currentStep === 2 ? (
              <ContinueButton
                onClick={advanceStep}
                disabled={!hasPrimaryMoods}
                label={
                  hasPrimaryMoods
                    ? "Continue to partner check-in"
                    : "Select at least one mood"
                }
              />
            ) : null
          }
        >
          <MoodCheckIn selected={todayMoods} onToggle={handleMoodToggle} />
          {hasPrimaryMoods ? (
            <p className="mt-3 text-xs text-muted">
              You: {formatMoodList(todayMoods)}
            </p>
          ) : null}
        </FlowStepShell>

        <FlowStepShell
          step={3}
          label="Partner check-in"
          title="Your partner check-in"
          description="How are you showing up today? Mood, energy, and optional support intention."
          isActive={currentStep === 3}
          isComplete={maxReached > 3}
          footer={
            currentStep === 3 ? (
              <ContinueButton
                onClick={advanceStep}
                disabled={!partnerStarted}
                label={
                  partnerStarted
                    ? "View insights"
                    : "Add mood, energy, or support intention"
                }
              />
            ) : null
          }
        >
          <PartnerCheckInSection
            checkIn={partnerCheckIn}
            onMoodToggle={handlePartnerMoodToggle}
            onEnergyChange={(energy) =>
              persistPartner({ ...partnerCheckIn, energy })
            }
            onIntentionChange={(supportIntention) =>
              persistPartner({ ...partnerCheckIn, supportIntention })
            }
          />
          {partnerStarted ? (
            <p className="mt-3 text-xs text-muted">
              Partner: {formatPartnerMoodList(partnerCheckIn.moods)}
              {partnerCheckIn.energy
                ? ` · Energy: ${partnerCheckIn.energy}`
                : ""}
            </p>
          ) : null}
        </FlowStepShell>

        <FlowStepShell
          step={4}
          label="Insights"
          title="Reflection for both of you"
          description="Personal insight stays private. Couple insight is warm guidance — never blame."
          isActive={currentStep === 4}
          isComplete={maxReached > 4}
          footer={
            currentStep === 4 ? (
              <ContinueButton
                onClick={advanceStep}
                label="View support guidance"
              />
            ) : null
          }
        >
          <div className="space-y-4">
            <PersonalInsightCard insight={personalInsight} />
            <CoupleInsightCard insight={coupleInsight} />
          </div>
        </FlowStepShell>

        <FlowStepShell
          step={5}
          label="Support"
          title="Gentle support guidance"
          description="Optional ideas for showing up — never obligations. Preview what a partner would see."
          isActive={currentStep === 5}
          isComplete={maxReached >= 5}
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
        <Link href="/" className="text-primary transition-opacity hover:opacity-80">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
