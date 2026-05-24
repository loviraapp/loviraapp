"use client";

import type { MoodId, NeedId } from "@/types/app";
import { getMoodGlance } from "@/lib/visual-copy";
import { getNeedPhrase } from "@/lib/soft-streaks";
import { getNeedById } from "@/lib/needs";

type GlanceSummaryProps = {
  moods: MoodId[];
  needs: NeedId[];
  onEdit: () => void;
};

export function GlanceSummary({ moods, needs, onEdit }: GlanceSummaryProps) {
  const mood = moods[0] ? getMoodGlance(moods[0]) : null;
  const needLine = needs.length ? getNeedPhrase(needs) : null;

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center gap-4 rounded-2xl bg-card-elevated/80 px-4 py-4 text-left shadow-sm transition-shadow hover:shadow-md"
      >
        <span className="text-3xl" aria-hidden>
          {mood?.emoji ?? "○"}
        </span>
        <div>
          <p className="text-sm text-muted">Today&apos;s mood</p>
          <p className="font-display text-xl text-foreground">
            {mood ? mood.short : "Tap to check in"}
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center gap-4 rounded-2xl bg-card-elevated/80 px-4 py-4 text-left shadow-sm transition-shadow hover:shadow-md"
      >
        <span className="text-2xl" aria-hidden>
          {needs[0] ? getNeedById(needs[0]).emoji : "🌿"}
        </span>
        <div>
          <p className="text-sm text-muted">What I need</p>
          <p className="text-base text-foreground">
            {needLine ?? "Tap to add"}
          </p>
        </div>
      </button>
    </section>
  );
}
