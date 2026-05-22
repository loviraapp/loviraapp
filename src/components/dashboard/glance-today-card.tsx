"use client";

import type { MoodId, PartnerMoodId } from "@/types/app";
import { getPartnerMoodById } from "@/lib/partner-mood";
import { MOOD_GLANCE } from "@/lib/visual-copy";
import { MoodPill } from "@/components/ui/mood-pill";

type GlanceTodayCardProps = {
  moods: MoodId[] | PartnerMoodId[];
  onCheckIn: () => void;
};

function glanceFor(id: MoodId | PartnerMoodId) {
  const g = MOOD_GLANCE[id as MoodId];
  if (g) return g;
  const p = getPartnerMoodById(id as PartnerMoodId);
  return { emoji: p.emoji, short: p.label };
}

export function GlanceTodayCard({ moods, onCheckIn }: GlanceTodayCardProps) {
  const primary = moods[0];
  const glance = primary ? glanceFor(primary) : null;

  return (
    <section className="glance-card">
      <p className="text-xs font-medium uppercase tracking-widest text-muted">
        Your mood
      </p>

      {glance ? (
        <div className="mt-4 flex items-center gap-4">
          <span className="text-5xl" aria-hidden>
            {glance.emoji}
          </span>
          <div>
            <h2 className="font-display text-3xl text-foreground">
              {glance.short}
            </h2>
            {moods.length > 1 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {moods.slice(1, 4).map((id) => {
                  const g = glanceFor(id);
                  return (
                    <MoodPill key={id} emoji={g.emoji} label={g.short} size="sm" />
                  );
                })}
                {moods.length > 4 ? (
                  <span className="text-xs text-muted">+{moods.length - 4}</span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <h2 className="font-display text-2xl text-foreground/80">
            How are you?
          </h2>
        </div>
      )}

      <button
        type="button"
        onClick={onCheckIn}
        className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform active:scale-[0.99]"
      >
        {moods.length ? "Update your check-in" : "Check in"}
      </button>
    </section>
  );
}
