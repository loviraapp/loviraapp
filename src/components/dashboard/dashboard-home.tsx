"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { MoodId, NeedId, PartnerCheckIn } from "@/types/app";
import {
  getTodayKey,
  getPartnerCheckIn,
  getNeedsForDate,
  loadLoviraData,
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
    setPartnerCheckIn(getPartnerCheckIn(todayKey));
    setRitualStep(getRitualStep());
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
  const bothDone = meDone && partnerDone;

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
      if (!meDone && activePerson === "partner") {
        setActivePerson("me");
        goToStep(1);
        return;
      }
      if (!partnerDone && activePerson === "me") {
        setActivePerson("partner");
        goToStep(1);
        return;
      }
      if (bothDone) goToStep(3);
      else if (meDone) {
        setActivePerson("partner");
        goToStep(1);
      } else {
        setActivePerson("me");
        goToStep(1);
      }
    }
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
          A daily ritual for both of you — not a tracker.
        </p>
      </header>

      {ritualStep < 3 ? (
        <>
          <PersonToggle
            active={activePerson}
            onChange={setActivePerson}
            meDone={meDone}
            partnerDone={partnerDone}
          />
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
            {ritualStep === 1
              ? "Continue"
              : bothDone || (activePerson === "me" ? partnerDone : meDone)
                ? "See tonight's vibe"
                : activePerson === "me"
                  ? "Continue · partner check-in next"
                  : "Continue · your check-in next"}
          </button>
        </>
      ) : (
        <div className="space-y-8">
          <RitualStepVibe
            vibe={vibe}
            meMoods={todayMoods}
            partnerMoods={partnerCheckIn.moods}
            meNeeds={todayNeeds}
            partnerNeeds={partnerCheckIn.needs}
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
            Update check-in
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
