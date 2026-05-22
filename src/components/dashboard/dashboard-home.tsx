"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { calculateCycle } from "@/lib/cycle";
import { getCoupleInsight } from "@/lib/couple-insights";
import { getPersonalInsight } from "@/lib/insights";
import { getPartnerPreview } from "@/lib/partner-preview";
import { getSupportSuggestion } from "@/lib/support-tips";
import {
  getTodayKey,
  getPartnerCheckIn,
  loadLoviraData,
  saveLastPeriodStart,
  saveMoodsForDate,
  savePartnerCheckIn,
} from "@/lib/storage";
import type { MoodId, PartnerCheckIn, PartnerMoodId } from "@/types/app";
import type { UserRole } from "@/types/role";
import { useUserRole } from "@/hooks/use-user-role";
import {
  getMyMoods,
  getTheirMoods,
  hasTheirCheckIn,
} from "@/lib/check-in-view";
import {
  getTodayHeadline,
  getHeroInsight,
  getWarmAction,
} from "@/lib/emotional-copy";
import { MOOD_GLANCE } from "@/lib/visual-copy";
import { ExpandSection } from "@/components/ui/expand-section";
import { TodayMoodSection } from "./today-mood-section";
import { HeroInsight } from "./hero-insight";
import { GentleAction } from "./gentle-action";
import { MoreInsightsPanel } from "./more-insights-panel";
import { MoodPickerSheet } from "./mood-picker-sheet";

function glanceEmoji(id: MoodId | PartnerMoodId) {
  return MOOD_GLANCE[id as MoodId]?.emoji ?? "○";
}

export function DashboardHome() {
  const { role, ready: roleReady } = useUserRole();
  const [hydrated, setHydrated] = useState(false);
  const [lastPeriodStart, setLastPeriodStart] = useState("");
  const [todayMoods, setTodayMoods] = useState<MoodId[]>([]);
  const [partnerCheckIn, setPartnerCheckIn] = useState<PartnerCheckIn>({
    moods: [],
    energy: null,
    supportIntention: null,
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const todayKey = getTodayKey();
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const persistPartner = useCallback(
    (next: PartnerCheckIn) => {
      setPartnerCheckIn(next);
      savePartnerCheckIn(todayKey, next);
    },
    [todayKey]
  );

  useEffect(() => {
    const data = loadLoviraData();
    setLastPeriodStart(data.lastPeriodStart ?? "");
    setTodayMoods(data.moodLog[todayKey] ?? []);
    setPartnerCheckIn(getPartnerCheckIn(todayKey));
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

  const cycle = useMemo(
    () =>
      lastPeriodStart ? calculateCycle(lastPeriodStart, 28) : null,
    [lastPeriodStart]
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

  if (!hydrated || !roleReady) {
    return (
      <div className="dashboard-shell mx-auto max-w-md px-5 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-5 w-28 rounded-full bg-border/80" />
          <div className="h-36 rounded-3xl bg-primary-soft/50" />
        </div>
      </div>
    );
  }

  const activeRole: UserRole = role ?? "tracking";
  const myMoods = getMyMoods(activeRole, todayMoods, partnerCheckIn);
  const theirMoods = getTheirMoods(activeRole, todayMoods, partnerCheckIn);
  const partnerPending =
    activeRole === "tracking" &&
    !hasTheirCheckIn(activeRole, todayMoods, partnerCheckIn);

  const todayHeadline = getTodayHeadline(
    activeRole === "support"
      ? (partnerCheckIn.moods as unknown as MoodId[])
      : todayMoods
  );
  const hero = getHeroInsight(coupleInsight, todayMoods, partnerCheckIn);
  const action = getWarmAction(suggestion);

  const myEmoji = myMoods[0] ? glanceEmoji(myMoods[0]) : undefined;
  const theirEmoji = theirMoods[0] ? glanceEmoji(theirMoods[0]) : undefined;

  return (
    <div className="dashboard-shell mx-auto max-w-md px-5 pb-28 pt-8">
      <header className="mb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[1.75rem] text-foreground">Lovira</h1>
            <p className="mt-1 text-sm text-muted">{todayLabel}</p>
          </div>
          <Link
            href="/onboarding"
            className="mt-1 shrink-0 text-sm text-primary/80 hover:text-primary"
          >
            {activeRole === "support" ? "Supporting" : "Tracking"} · change
          </Link>
        </div>
      </header>

      <div className="companion-flow">
        <TodayMoodSection
          headline={todayHeadline}
          moods={myMoods}
          onCheckIn={() => setSheetOpen(true)}
        />

        <HeroInsight
          headline={hero.headline}
          message={hero.message}
          myEmoji={myEmoji}
          theirEmoji={theirEmoji}
        />

        <GentleAction title={action.title} line={action.line} />
      </div>

      <div className="mt-12">
        <ExpandSection title="More insights">
          <MoreInsightsPanel
            role={activeRole}
            cycle={cycle}
            hasPeriodDate={!!lastPeriodStart}
            partnerCheckIn={partnerCheckIn}
            theirMoods={theirMoods}
            coupleInsight={coupleInsight}
            myMoods={myMoods}
            partnerPending={partnerPending}
            personalInsight={personalInsight}
            partnerPreview={partnerPreview}
            previewOpen={previewOpen}
            onPreviewToggle={() => setPreviewOpen((o) => !o)}
            lastPeriodStart={lastPeriodStart}
            onPeriodChange={handlePeriodChange}
          />
        </ExpandSection>
      </div>

      <MoodPickerSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        role={activeRole}
        todayMoods={todayMoods}
        onMoodToggle={handleMoodToggle}
        partnerCheckIn={partnerCheckIn}
        onPartnerMoodToggle={handlePartnerMoodToggle}
        onEnergyChange={(energy) =>
          persistPartner({ ...partnerCheckIn, energy })
        }
        onIntentionChange={(supportIntention) =>
          persistPartner({ ...partnerCheckIn, supportIntention })
        }
      />
    </div>
  );
}
