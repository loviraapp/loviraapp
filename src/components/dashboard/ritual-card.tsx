"use client";

import type { DailyRitual } from "@/lib/daily-ritual";

type RitualCardProps = {
  ritual: DailyRitual;
  onComplete?: () => void;
  completed?: boolean;
};

export function RitualCard({ ritual, onComplete, completed }: RitualCardProps) {
  return (
    <section className="ritual-card rounded-3xl bg-card-elevated/90 px-5 py-6 shadow-sm">
      <p className="text-sm text-primary/80">Today&apos;s ritual</p>
      <div className="mt-4 flex items-start gap-4">
        <span className="text-3xl" aria-hidden>
          {ritual.emoji}
        </span>
        <p className="flex-1 text-lg leading-relaxed text-foreground">
          {ritual.text}
        </p>
      </div>
      {onComplete && !completed && (
        <button
          type="button"
          onClick={onComplete}
          className="mt-5 w-full rounded-full bg-primary/10 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
        >
          We did this tonight
        </button>
      )}
      {completed && (
        <p className="mt-5 text-center text-sm text-muted">✨ Saved to your constellation</p>
      )}
    </section>
  );
}
