"use client";

import type { DailyRitual } from "@/lib/daily-ritual";

type RitualChallengeCardProps = {
  ritual: DailyRitual;
};

export function RitualChallengeCard({ ritual }: RitualChallengeCardProps) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-secondary-soft/80 to-card px-5 py-5">
      <p className="text-sm text-muted">Today&apos;s ritual</p>
      <div className="mt-3 flex gap-3">
        <span className="text-3xl" aria-hidden>
          {ritual.emoji}
        </span>
        <div>
          <p className="font-display text-lg text-foreground">{ritual.title}</p>
          <p className="mt-1 text-sm text-muted">{ritual.line}</p>
        </div>
      </div>
    </section>
  );
}
