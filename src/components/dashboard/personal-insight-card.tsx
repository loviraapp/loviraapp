"use client";

import type { PersonalInsight } from "@/types/app";

type PersonalInsightCardProps = {
  insight: PersonalInsight;
};

export function PersonalInsightCard({ insight }: PersonalInsightCardProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-lavender-soft/80 to-accent-soft/60 p-5 ring-1 ring-border/60">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender-deep">
        For you only
      </p>
      <h3 className="mt-2 font-display text-lg text-foreground">{insight.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
        {insight.message}
      </p>
    </div>
  );
}
