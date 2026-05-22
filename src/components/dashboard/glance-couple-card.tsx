"use client";

import type { CoupleInsight, MoodId, PartnerMoodId } from "@/types/app";
import { getPartnerMoodById } from "@/lib/partner-mood";
import { MOOD_GLANCE } from "@/lib/visual-copy";

function glanceFor(id: MoodId | PartnerMoodId) {
  const g = MOOD_GLANCE[id as MoodId];
  if (g) return g;
  const p = getPartnerMoodById(id as PartnerMoodId);
  return { emoji: p.emoji, short: p.label };
}

type GlanceCoupleCardProps = {
  insight: CoupleInsight;
  myMoods: (MoodId | PartnerMoodId)[];
  theirMoods: (MoodId | PartnerMoodId)[];
  partnerPending?: boolean;
  compact?: boolean;
};

export function GlanceCoupleCard({
  insight,
  myMoods,
  theirMoods,
  partnerPending,
  compact,
}: GlanceCoupleCardProps) {
  if (compact) {
    return (
      <div className="rounded-2xl bg-card/60 px-4 py-3">
        <p className="text-sm text-muted">{insight.message}</p>
        {partnerPending ? (
          <p className="mt-2 text-xs text-muted">
            Partner can check in with Support role on this device.
          </p>
        ) : null}
      </div>
    );
  }

  const you = myMoods[0] ? glanceFor(myMoods[0]) : null;
  const partner = theirMoods[0] ? glanceFor(theirMoods[0]) : null;

  return (
    <section className="glance-card glance-card--soft">
      <p className="mt-4 flex gap-2 font-display text-xl leading-snug text-foreground">
        <span aria-hidden>💡</span>
        {insight.message}
      </p>
      <div className="mt-5 flex gap-3">
        <MiniPartner label="You" emoji={you?.emoji ?? "○"} name={you?.short ?? "—"} />
        <MiniPartner
          label="Partner"
          emoji={partner?.emoji ?? "○"}
          name={partner?.short ?? "—"}
        />
      </div>
      {partnerPending ? (
        <p className="mt-3 text-xs text-muted">
          Partner checks in separately — switch to Support role on this device.
        </p>
      ) : null}
    </section>
  );
}

function MiniPartner({
  label,
  emoji,
  name,
}: {
  label: string;
  emoji: string;
  name: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-2 rounded-2xl bg-card-elevated/80 px-3 py-2.5">
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <div>
        <p className="text-[10px] text-muted">{label}</p>
        <p className="text-sm font-medium">{name}</p>
      </div>
    </div>
  );
}
