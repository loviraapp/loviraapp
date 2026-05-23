"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { MoodId, NeedId, PartnerCheckIn } from "@/types/app";
import {
  getTodayKey,
  getPartnerCheckIn,
  getNeedsForDate,
  loadLoviraData,
  normalizePartnerCheckIn,
  saveLastPeriodStart,
  saveMoodsForDate,
  saveNeedsForDate,
  savePartnerCheckIn,
  saveRitualStep,
  getRitualStep,
} from "@/lib/storage";
import { getRelationshipVibe } from "@/lib/relationship-vibe";
import { getDailyRitual } from "@/lib/daily-ritual";
import { getConnectionStreak } from "@/lib/streak";
import { PersonToggle, type ActivePerson } from "./person-toggle";
import { RitualProgress } from "./ritual-progress";
import { RitualStepMoods } from "./ritual-step-moods";
import { RitualStepNeeds } from "./ritual-step-needs";
import { RitualStepVibe } from "./ritual-step-vibe";
import { RitualChallengeCard } from "./ritual-challenge-card";
import { RepairModeCard } from "./repair-mode-card";
import { ExpandSection } from "@/components/ui/expand-section";
import { PeriodDateForm } from "./period-date-form";

const EMPTY_PARTNER: PartnerCheckIn = {
  moods: [],
  needs: [],
  energy: null,
  supportIntention: null,
};

export function DashboardHome() {
  const [hydrated, setHydrated] = useState(false);
  const [ritualStep, setRitualStep] = useState(1);
  const [activePerson, setActivePerson] = useState<ActivePerson>("me");
  const [lastPeriodStart, setLastPeriodStart] = useState("");
  const [todayMoods, setTodayMoods] = useState<MoodId[]>([]);
  const [todayNeeds, setTodayNeeds] = useState<NeedId[]>([]);
  const [partnerCheckIn, setPartnerCheckIn] =
    useState<PartnerCheckIn>(EMPTY_PARTNER);

  const todayKey = getTodayKey();
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const data = loadLoviraData();
    setLastPeriodStart(data.lastPeriodStart ?? "");
    setTodayMoods(data.moodLog[todayKey] ?? []);
    setTodayNeeds(getNeedsForDate(todayKey));
    setPartnerCheckIn(normalizePartnerCheckIn(getPartnerCheckIn(todayKey)));
    const savedStep = getRitualStep();
    const meComplete =
      (data.moodLog[todayKey]?.length ?? 0) > 0 &&
      (data.needLog[todayKey]?.length ?? 0) > 0;
    setRitualStep(meComplete && savedStep < 3 ? 3 : savedStep);
    setHydrated(true);
  }, [todayKey]);

  const persistPartner = useCallback(
    (next: PartnerCheckIn) => {
      setPartnerCheckIn(next);
      savePartnerCheckIn(todayKey, next);
    },
    [todayKey]
  );

  const activeMoods =
    activePerson === "me" ? todayMoods : partnerCheckIn.moods;
  const activeNeeds =
    activePerson === "me" ? todayNeeds : partnerCheckIn.needs;

  const meDone = todayMoods.length > 0 && todayNeeds.length > 0;
  const partnerDone =
    partnerCheckIn.moods.length > 0 && partnerCheckIn.needs.length > 0;
  const partnerPending = !partnerDone;

  const vibe = useMemo(
    () =>
      getRelationshipVibe(
        { moods: todayMoods, needs: todayNeeds },
        { moods: partnerCheckIn.moods, needs: partnerCheckIn.needs }
      ),
    [todayMoods, todayNeeds, partnerCheckIn]
  );

  const dailyRitual = useMemo(() => getDailyRitual(todayKey), [todayKey]);
  const streak = useMemo(
    () => (hydrated ? getConnectionStreak(todayKey) : 0),
    [hydrated, todayKey]
  );

  const handleMoodToggle = useCallback(
    (mood: MoodId) => {
      if (activePerson === "me") {
        setTodayMoods((prev) => {
          const next = prev.includes(mood)
            ? prev.filter((m) => m !== mood)
            : [...prev, mood];
          saveMoodsForDate(todayKey, next);
          return next;
        });
      } else {
        const nextMoods = partnerCheckIn.moods.includes(mood)
          ? partnerCheckIn.moods.filter((m) => m !== mood)
          : [...partnerCheckIn.moods, mood];
        persistPartner({ ...partnerCheckIn, moods: nextMoods });
      }
    },
    [activePerson, todayKey, partnerCheckIn, persistPartner]
  );

  const handleNeedToggle = useCallback(
    (need: NeedId) => {
      if (activePerson === "me") {
        setTodayNeeds((prev) => {
          const next = prev.includes(need)
            ? prev.filter((n) => n !== need)
            : [...prev, need];
          saveNeedsForDate(todayKey, next);
          return next;
        });
      } else {
        const nextNeeds = partnerCheckIn.needs.includes(need)
          ? partnerCheckIn.needs.filter((n) => n !== need)
          : [...partnerCheckIn.needs, need];
        persistPartner({ ...partnerCheckIn, needs: nextNeeds });
      }
    },
    [activePerson, todayKey, partnerCheckIn, persistPartner]
  );

  const goToStep = useCallback((step: number) => {
    setRitualStep(step);
    saveRitualStep(step);
  }, []);

  const startPartnerCheckIn = useCallback(() => {
    setActivePerson("partner");
    goToStep(1);
  }, [goToStep]);

  const canContinue =
    ritualStep === 1
      ? activeMoods.length > 0
      : ritualStep === 2
        ? activeNeeds.length > 0
        : false;

  function handleContinue() {
    if (ritualStep === 1 && activeMoods.length > 0) {
      goToStep(2);
      return;
    }
    if (ritualStep === 2 && activeNeeds.length > 0) {
      if (
        (activePerson === "me" && meDone) ||
        (activePerson === "partner" && partnerDone)
      ) {
        goToStep(3);
      }
    }
  }

  function continueButtonLabel(): string {
    if (ritualStep === 1) return "Continue";
    if (activePerson === "me" && meDone) return "See tonight's vibe";
    if (activePerson === "partner" && partnerDone) return "See tonight's vibe";
    return "Continue";
  }

  if (!hydrated) {
    return (
      <div className="dashboard-shell mx-auto max-w-md px-5 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 rounded-full bg-border/80" />
          <div className="h-48 rounded-3xl bg-primary-soft/50" />
        </div>
      </div>
    );
  }

  const showPartnerToggle = ritualStep < 3 && activePerson === "partner";

  return (
    <div className="dashboard-shell mx-auto max-w-md px-5 pb-28 pt-8">
      <header className="mb-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-[1.75rem] text-foreground">Lovira</h1>
            <p className="mt-1 text-sm text-muted">{todayLabel}</p>
          </div>
          {streak > 0 ? (
            <div className="rounded-full bg-card px-3 py-1.5 text-sm text-foreground">
              <span aria-hidden>🔥</span> {streak} day{streak === 1 ? "" : "s"}
            </div>
          ) : null}
        </div>
        <p className="mt-4 text-sm text-muted">
          Your check-in first — partner can join when ready.
        </p>
      </header>

      {ritualStep < 3 ? (
        <>
          {showPartnerToggle || !meDone ? (
            <PersonToggle
              active={activePerson}
              onChange={setActivePerson}
              meDone={meDone}
              partnerDone={partnerDone}
            />
          ) : (
            <p className="rounded-full bg-primary-soft/60 px-4 py-2 text-center text-sm text-primary">
              Your check-in is complete
            </p>
          )}
          <div className="mt-8">
            <RitualProgress step={ritualStep} />
          </div>
          <div className="mt-10">
            {ritualStep === 1 ? (
              <RitualStepMoods
                selected={activeMoods}
                onToggle={handleMoodToggle}
              />
            ) : (
              <RitualStepNeeds
                selected={activeNeeds}
                onToggle={handleNeedToggle}
              />
            )}
          </div>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="mt-10 w-full rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-opacity disabled:opacity-40"
          >
            {continueButtonLabel()}
          </button>
          {ritualStep === 2 && activePerson === "me" && meDone && partnerPending ? (
            <button
              type="button"
              onClick={startPartnerCheckIn}
              className="mt-4 w-full text-center text-sm text-muted hover:text-primary"
            >
              Optional: add partner check-in →
            </button>
          ) : null}
        </>
      ) : (
        <div className="space-y-8">
          <RitualStepVibe
            vibe={vibe}
            meMoods={todayMoods}
            partnerMoods={partnerCheckIn.moods}
            meNeeds={todayNeeds}
            partnerNeeds={partnerCheckIn.needs}
            partnerPending={partnerPending}
            onAddPartnerCheckIn={partnerPending ? startPartnerCheckIn : undefined}
          />
          <RitualChallengeCard ritual={dailyRitual} />
          <RepairModeCard />
          <button
            type="button"
            onClick={() => {
              goToStep(1);
              setActivePerson("me");
            }}
            className="w-full text-center text-sm text-primary"
          >
            Update your check-in
          </button>
        </div>
      )}

      <div className="mt-10">
        <ExpandSection title="More">
          <PeriodDateForm
            value={lastPeriodStart}
            onChange={(date) => {
              setLastPeriodStart(date);
              saveLastPeriodStart(date || null);
            }}
          />
          <p className="text-xs text-muted">
            Rhythm context stays optional — never the main story.
          </p>
          <Link
            href="/onboarding"
            className="block text-center text-sm text-primary"
          >
            Switch role
          </Link>
          <Link href="/" className="block text-center text-xs text-muted">
            Home
          </Link>
        </ExpandSection>
      </div>
    </div>
  );
}
