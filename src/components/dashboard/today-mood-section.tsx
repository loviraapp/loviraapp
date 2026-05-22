"use client";

import type { MoodId, PartnerMoodId } from "@/types/app";
import { MOOD_GLANCE } from "@/lib/visual-copy";
import { getPartnerMoodById } from "@/lib/partner-mood";
type TodayMoodSectionProps = {
  headline: string;
  moods: MoodId[] | PartnerMoodId[];
  onCheckIn: () => void;
};

function glanceFor(id: MoodId | PartnerMoodId) {
  const g = MOOD_GLANCE[id as MoodId];
  if (g) return g;
  const p = getPartnerMoodById(id as PartnerMoodId);
  return { emoji: p.emoji, short: p.label };
}

export function TodayMoodSection({
  headline,
  moods,
  onCheckIn,
}: TodayMoodSectionProps) {
  const primary = moods[0];
  const glance = primary ? glanceFor(primary) : null;
  return (
    <section className="today-surface">
      <p className="text-[15px] leading-snug text-muted">{headline}</p>

      {glance ? (
        <div className="mt-4 flex items-center gap-4">
          <span className="text-[3.25rem] leading-none" aria-hidden>
            {glance.emoji}
          </span>
          <p className="font-display text-2xl text-foreground">{glance.short}</p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onCheckIn}
        className="mt-5 text-sm font-medium text-primary transition-opacity hover:opacity-75"
      >
        {moods.length ? "Update how you feel →" : "Check in →"}
      </button>
    </section>
  );
}
