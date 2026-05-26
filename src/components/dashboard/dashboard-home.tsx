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
} from "@/lib/storage";
import { getRelationshipVibe } from "@/lib/relationship-vibe";
import { getCoupleProfile } from "@/lib/couple-profile";
import { getEmotionalInsight, getTodaysConnection } from "@/lib/lovira-home";
import { LoviraHome } from "./lovira-home";
import { CheckInFlow } from "./check-in-flow";
import { SupportPreferencesEditor } from "./support-preferences-editor";
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
  const [lastPeriodStart, setLastPeriodStart] = useState("");
  const [todayMoods, setTodayMoods] = useState<MoodId[]>([]);
  const [todayNeeds, setTodayNeeds] = useState<NeedId[]>([]);
  const [partnerCheckIn, setPartnerCheckIn] =
    useState<PartnerCheckIn>(EMPTY_PARTNER);
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
    setCoupleProfile(getCoupleProfile());
    setHydrated(true);
  }, [todayKey]);

  const meDone = todayMoods.length > 0 && todayNeeds.length > 0;

  const vibe = useMemo(
    () =>
      getRelationshipVibe(
        { moods: todayMoods, needs: todayNeeds },
        { moods: partnerCheckIn.moods, needs: partnerCheckIn.needs }
      ),
    [todayMoods, todayNeeds, partnerCheckIn]
  );

  const insight = useMemo(
    () =>
      getEmotionalInsight({
        profile: coupleProfile,
        moods: todayMoods,
        needs: todayNeeds,
        partnerCheckIn,
        vibe,
        meDone,
      }),
    [coupleProfile, todayMoods, todayNeeds, partnerCheckIn, vibe, meDone]
  );

  const connection = useMemo(
    () => getTodaysConnection({ meDone, todayKey }),
    [meDone, todayKey]
  );

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

  if (!hydrated) {
    return (
      <div className="lv-dashboard mx-auto max-w-md px-5 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-28 rounded-full bg-border/80" />
          <div className="h-36 rounded-3xl bg-primary-soft/40" />
          <div className="h-28 rounded-3xl bg-border/30" />
          <div className="h-40 rounded-3xl bg-primary-soft/50" />
        </div>
      </div>
    );
  }

  const showCheckIn = editingCheckIn || !meDone;

  return (
    <div className="lv-dashboard mx-auto max-w-md px-5 pb-28 pt-8">
      <header className="lv-dashboard-header">
        <p className="lv-dashboard-eyebrow">Lovira</p>
        <h1 className="lv-dashboard-title font-display">
          {coupleProfile
            ? `${coupleProfile.yourName} & ${coupleProfile.partnerName}`
            : "Together"}
        </h1>
        <p className="lv-dashboard-date">{todayLabel}</p>
      </header>

      {showCheckIn ? (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted">
            {meDone ? "Update today's check-in" : "A quiet moment for today"}
          </p>
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
              Back to home
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-6">
          <LoviraHome
            insight={insight}
            connection={connection}
            onConnectionTap={() => setEditingCheckIn(true)}
          />
        </div>
      )}

      <div className="mt-12">
        <ExpandSection title="More, when you need it">
          {coupleProfile?.emotionalPrefs?.privateCycle ? (
            <PeriodDateForm
              value={lastPeriodStart}
              onChange={(date) => {
                setLastPeriodStart(date);
                saveLastPeriodStart(date || null);
              }}
            />
          ) : null}
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
          <Link href="/connection-prompt" className="more-insights-row block">
            <span className="text-sm text-foreground">Connection prompt</span>
            <span className="text-sm text-muted">→</span>
          </Link>
          <Link href="/reel-to-real" className="more-insights-row block">
            <span className="text-sm text-muted">Optional: reel to conversation</span>
            <span className="text-sm text-muted">→</span>
          </Link>
          <Link href="/onboarding" className="block text-center text-sm text-primary">
            Edit relationship setup
          </Link>
        </ExpandSection>
      </div>
    </div>
  );
}
