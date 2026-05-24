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
} from "@/lib/storage";
import { getRelationshipVibe } from "@/lib/relationship-vibe";
import { getDailyRitual } from "@/lib/daily-ritual";
import { getSoftStreaks } from "@/lib/soft-streaks";
import { getConstellationStars } from "@/lib/constellation";
import {
  loadRitualCompletedDates,
  markRitualComplete,
} from "@/lib/streak";
import { getCoupleProfile, getCoupleProfileAsEmotionalProfile } from "@/lib/couple-profile";
import {
  getPersonalizedSupport,
} from "@/lib/personalized-support";
import { PersonalizedSupportCard } from "./personalized-support-card";
import { SupportPreferencesEditor } from "./support-preferences-editor";
import { CheckInFlow } from "./check-in-flow";
import { GlanceSummary } from "./glance-summary";
import { VibeHero } from "./vibe-hero";
import { RitualCard } from "./ritual-card";
import { ConstellationVisual } from "./constellation-visual";
import { SoftStreakSection } from "./soft-streak-section";
import { RepairModeCard } from "./repair-mode-card";
import { RitualStepMoods } from "./ritual-step-moods";
import { RitualStepNeeds } from "./ritual-step-needs";
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
  const [editingCheckIn, setEditingCheckIn] = useState(false);
  const [showPartnerFlow, setShowPartnerFlow] = useState(false);
  const [partnerStep, setPartnerStep] = useState<1 | 2>(1);
  const [lastPeriodStart, setLastPeriodStart] = useState("");
  const [todayMoods, setTodayMoods] = useState<MoodId[]>([]);
  const [todayNeeds, setTodayNeeds] = useState<NeedId[]>([]);
  const [partnerCheckIn, setPartnerCheckIn] =
    useState<PartnerCheckIn>(EMPTY_PARTNER);
  const [ritualDone, setRitualDone] = useState(false);
  const [coupleProfile, setCoupleProfile] = useState<ReturnType<typeof getCoupleProfile>>(null);
  const [showPreferencesEditor, setShowPreferencesEditor] = useState(false);

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
    setRitualDone(loadRitualCompletedDates().includes(todayKey));
    setCoupleProfile(getCoupleProfile());
    setHydrated(true);
  }, [todayKey]);

  const persistPartner = useCallback(
    (next: PartnerCheckIn) => {
      setPartnerCheckIn(next);
      savePartnerCheckIn(todayKey, next);
    },
    [todayKey]
  );

  const meDone = todayMoods.length > 0 && todayNeeds.length > 0;
  const partnerDone =
    partnerCheckIn.moods.length > 0 && partnerCheckIn.needs.length > 0;

  const vibe = useMemo(
    () =>
      getRelationshipVibe(
        { moods: todayMoods, needs: todayNeeds },
        { moods: partnerCheckIn.moods, needs: partnerCheckIn.needs }
      ),
    [todayMoods, todayNeeds, partnerCheckIn]
  );

  const dailyRitual = useMemo(() => getDailyRitual(todayKey), [todayKey]);

  const myProfile = getCoupleProfileAsEmotionalProfile();

  const personalizedInsight = meDone
    ? getPersonalizedSupport({
        moods: todayMoods,
        needs: todayNeeds,
        vibe,
        profile: myProfile,
      })
    : null;

  const partnerHint = null;

  const softStreaks = hydrated ? getSoftStreaks() : [];
  const stars = hydrated ? getConstellationStars() : [];

  const handleMoodToggle = useCallback(
    (mood: MoodId) => {
      setTodayMoods((prev) => {
        const next = prev.includes(mood)
          ? prev.filter((m) => m !== mood)
          : [...prev, mood];
        saveMoodsForDate(todayKey, next);
        return next;
      });
    },
    [todayKey]
  );

  const handleNeedToggle = useCallback(
    (need: NeedId) => {
      setTodayNeeds((prev) => {
        const next = prev.includes(need)
          ? prev.filter((n) => n !== need)
          : [...prev, need];
        saveNeedsForDate(todayKey, next);
        return next;
      });
    },
    [todayKey]
  );

  const handlePartnerMoodToggle = useCallback(
    (mood: MoodId) => {
      const nextMoods = partnerCheckIn.moods.includes(mood)
        ? partnerCheckIn.moods.filter((m) => m !== mood)
        : [...partnerCheckIn.moods, mood];
      persistPartner({ ...partnerCheckIn, moods: nextMoods });
    },
    [partnerCheckIn, persistPartner]
  );

  const handlePartnerNeedToggle = useCallback(
    (need: NeedId) => {
      const nextNeeds = partnerCheckIn.needs.includes(need)
        ? partnerCheckIn.needs.filter((n) => n !== need)
        : [...partnerCheckIn.needs, need];
      persistPartner({ ...partnerCheckIn, needs: nextNeeds });
    },
    [partnerCheckIn, persistPartner]
  );

  function handleRitualComplete() {
    markRitualComplete(todayKey);
    setRitualDone(true);
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

  const showCheckInFlow = !meDone || editingCheckIn;

  return (
    <div className="dashboard-shell mx-auto max-w-md px-5 pb-28 pt-8">
      <header className="mb-10">
        <h1 className="font-display text-[1.75rem] text-foreground">Lovira</h1>
        {coupleProfile ? (
          <p className="mt-1 text-sm text-muted">
            {coupleProfile.yourName} & {coupleProfile.partnerName}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-muted">{todayLabel}</p>
      </header>

      {showCheckInFlow ? (
        <div className="space-y-4">
          <CheckInFlow
            moods={todayMoods}
            needs={todayNeeds}
            onMoodToggle={handleMoodToggle}
            onNeedToggle={handleNeedToggle}
            onComplete={() => setEditingCheckIn(false)}
          />
          {meDone ? (
            <button
              type="button"
              onClick={() => setEditingCheckIn(false)}
              className="w-full text-center text-sm text-muted"
            >
              Back to tonight
            </button>
          ) : null}
        </div>
      ) : (
        <div className="companion-flow">
          <GlanceSummary
            moods={todayMoods}
            needs={todayNeeds}
            onEdit={() => setEditingCheckIn(true)}
          />

          <VibeHero vibe={vibe} />

          {personalizedInsight ? (
            <PersonalizedSupportCard
              insight={personalizedInsight}
              partnerHint={partnerHint}
            />
          ) : null}

          <RitualCard
            ritual={dailyRitual}
            completed={ritualDone}
            onComplete={handleRitualComplete}
          />

          <ConstellationVisual stars={stars} />

          <SoftStreakSection streaks={softStreaks} />
        </div>
      )}

      <div className="mt-12">
        <ExpandSection title="More">
          {showPartnerFlow ? (
            <div className="space-y-6 pb-4">
              <p className="text-sm text-muted">
                Optional — add when your partner is ready.
              </p>
              {partnerStep === 1 ? (
                <RitualStepMoods
                  selected={partnerCheckIn.moods}
                  onToggle={handlePartnerMoodToggle}
                />
              ) : (
                <RitualStepNeeds
                  selected={partnerCheckIn.needs}
                  onToggle={handlePartnerNeedToggle}
                />
              )}
              <button
                type="button"
                onClick={() => {
                  if (partnerStep === 1 && partnerCheckIn.moods.length > 0) {
                    setPartnerStep(2);
                  } else if (partnerStep === 2 && partnerCheckIn.needs.length > 0) {
                    setShowPartnerFlow(false);
                    setPartnerStep(1);
                  }
                }}
                disabled={
                  partnerStep === 1
                    ? partnerCheckIn.moods.length === 0
                    : partnerCheckIn.needs.length === 0
                }
                className="w-full rounded-full bg-primary/10 py-3 text-sm font-medium text-primary disabled:opacity-40"
              >
                {partnerStep === 1 ? "Continue" : "Save partner check-in"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPartnerFlow(false);
                  setPartnerStep(1);
                }}
                className="w-full text-sm text-muted"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPartnerFlow(true)}
              className="more-insights-row w-full text-left"
            >
              <span className="text-sm text-foreground">Partner check-in</span>
              <span className="text-sm text-muted">
                {partnerDone ? "Updated" : "Optional"}
              </span>
            </button>
          )}
          <RepairModeCard />
          {showPreferencesEditor ? (
            <SupportPreferencesEditor
              onClose={() => {
                setShowPreferencesEditor(false);
                setCoupleProfile(getCoupleProfile());
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowPreferencesEditor(true)}
              className="more-insights-row w-full text-left"
            >
              <span className="text-sm text-foreground">Support preferences</span>
              <span className="text-sm text-muted">Edit</span>
            </button>
          )}
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
            Edit couple setup
          </Link>
          <Link href="/" className="block text-center text-xs text-muted">
            Home
          </Link>
        </ExpandSection>
      </div>
    </div>
  );
}
