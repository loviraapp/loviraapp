"use client";

import type { CoupleInsight, MoodId, PartnerMoodId } from "@/types/app";
import { getMoodById } from "@/lib/mood";
import { getPartnerMoodById } from "@/lib/partner-mood";
import { MOOD_GLANCE } from "@/lib/visual-copy";

function moodEmoji(id: MoodId | PartnerMoodId, fallback: string): string {
  return MOOD_GLANCE[id as MoodId]?.emoji ?? fallback;
}

type CoupleInsightVisualProps = {
  insight: CoupleInsight;
  yourMoods: MoodId[];
  partnerMoods: PartnerMoodId[];
};

export function CoupleInsightVisual({
  insight,
  yourMoods,
  partnerMoods,
}: CoupleInsightVisualProps) {
  const you = yourMoods[0] ? getMoodById(yourMoods[0]) : null;
  const partner = partnerMoods[0]
    ? getPartnerMoodById(partnerMoods[0])
    : null;

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-primary-soft/80 via-card to-secondary-soft/40 p-6 shadow-sm ring-1 ring-border/60 transition-all duration-300">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        Couple insight
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <PartnerPill
          label="You"
          emoji={you ? moodEmoji(you.id, you.emoji) : "○"}
          mood={you?.label ?? "—"}
        />
        <PartnerPill
          label="Partner"
          emoji={partner ? moodEmoji(partner.id, partner.emoji) : "○"}
          mood={partner?.label ?? "—"}
        />
      </div>

      <p className="mt-5 flex gap-2 text-base leading-snug text-foreground">
        <span className="text-xl" aria-hidden>
          💡
        </span>
        <span>{insight.message.split(".")[0]}.</span>
      </p>
    </div>
  );
}

function PartnerPill({
  label,
  emoji,
  mood,
}: {
  label: string;
  emoji: string;
  mood: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-card/90 px-3 py-4 ring-1 ring-border/70">
      <span className="text-3xl" role="img" aria-hidden>
        {emoji}
      </span>
      <p className="mt-2 text-xs font-medium text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{mood}</p>
    </div>
  );
}
