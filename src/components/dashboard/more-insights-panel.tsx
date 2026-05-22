"use client";

import Link from "next/link";
import type { CycleInfo, PersonalInsight } from "@/types/app";
import type { PartnerCheckIn, PartnerPreview } from "@/types/app";
import type { MoodId, PartnerMoodId } from "@/types/app";
import type { UserRole } from "@/types/role";
import { getEnergyPhrase } from "@/lib/emotional-copy";
import { MOOD_GLANCE } from "@/lib/visual-copy";
import { getPartnerMoodById } from "@/lib/partner-mood";
import { GlancePhaseStrip } from "./glance-phase-strip";
import { GlanceCoupleCard } from "./glance-couple-card";
import type { CoupleInsight } from "@/types/app";
import { PeriodDateForm } from "./period-date-form";
import { PersonalInsightCard } from "./personal-insight-card";
import { PartnerModePreview } from "./partner-mode-preview";
import { PrivacySharingCard } from "./privacy-sharing-card";

function glanceFor(id: MoodId | PartnerMoodId) {
  const g = MOOD_GLANCE[id as MoodId];
  if (g) return g;
  const p = getPartnerMoodById(id as PartnerMoodId);
  return { emoji: p.emoji, short: p.label };
}

type MoreInsightsPanelProps = {
  role: UserRole;
  cycle: CycleInfo | null;
  hasPeriodDate: boolean;
  partnerCheckIn: PartnerCheckIn;
  theirMoods: (MoodId | PartnerMoodId)[];
  coupleInsight: CoupleInsight;
  myMoods: (MoodId | PartnerMoodId)[];
  partnerPending: boolean;
  personalInsight: PersonalInsight;
  partnerPreview: PartnerPreview;
  previewOpen: boolean;
  onPreviewToggle: () => void;
  lastPeriodStart: string;
  onPeriodChange: (date: string) => void;
};

export function MoreInsightsPanel({
  role,
  cycle,
  hasPeriodDate,
  partnerCheckIn,
  theirMoods,
  coupleInsight,
  myMoods,
  partnerPending,
  personalInsight,
  partnerPreview,
  previewOpen,
  onPreviewToggle,
  lastPeriodStart,
  onPeriodChange,
}: MoreInsightsPanelProps) {
  const energyLabel =
    role === "support"
      ? getEnergyPhrase(partnerCheckIn.energy)
      : partnerCheckIn.energy
        ? getEnergyPhrase(partnerCheckIn.energy)
        : "Waiting for their check-in";

  return (
    <div className="more-insights space-y-5">
      <div className="more-insights-row">
        <p className="text-sm text-muted">You</p>
        <p className="text-sm font-medium">
          {myMoods[0] ? glanceFor(myMoods[0]).short : "—"}
        </p>
      </div>
      <div className="more-insights-row">
        <p className="text-sm text-muted">Partner</p>
        <p className="text-sm font-medium">
          {theirMoods[0] ? glanceFor(theirMoods[0]).short : "—"}
        </p>
      </div>
      <div className="more-insights-row">
        <p className="text-sm text-muted">Energy between you</p>
        <p className="text-sm font-medium">{energyLabel}</p>
      </div>

      <GlancePhaseStrip
        cycle={cycle}
        hasPeriodDate={hasPeriodDate}
        onExpand={() => {}}
      />

      <GlanceCoupleCard
        insight={coupleInsight}
        myMoods={myMoods}
        theirMoods={theirMoods}
        partnerPending={partnerPending}
        compact
      />

      <PersonalInsightCard insight={personalInsight} />
      <PartnerModePreview
        preview={partnerPreview}
        isOpen={previewOpen}
        onToggle={onPreviewToggle}
      />
      <PeriodDateForm value={lastPeriodStart} onChange={onPeriodChange} />
      <PrivacySharingCard />
      <Link href="/" className="block text-center text-xs text-muted hover:text-primary">
        Home
      </Link>
    </div>
  );
}
