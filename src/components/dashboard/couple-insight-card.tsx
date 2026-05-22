"use client";

import type { CoupleInsight } from "@/types/app";

type CoupleInsightCardProps = {
  insight: CoupleInsight;
};

export function CoupleInsightCard({ insight }: CoupleInsightCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-primary-soft/90 via-card to-secondary-soft/50 p-5 ring-1 ring-border/80">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Couple insight
      </p>
      <h3 className="mt-2 font-display text-lg text-foreground">{insight.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
        {insight.message}
      </p>
      <p className="mt-4 text-xs text-muted">
        Supportive guidance — not a scorecard. Neither partner is doing it wrong.
      </p>
    </div>
  );
}
