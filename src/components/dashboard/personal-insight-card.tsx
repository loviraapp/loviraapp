"use client";

import type { PersonalInsight } from "@/types/app";

type PersonalInsightCardProps = {
  insight: PersonalInsight;
};

export function PersonalInsightCard({ insight }: PersonalInsightCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 ring-1 ring-border/80 transition-all duration-300">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender-deep">
        For you only
      </p>
      <p className="mt-3 flex gap-2 text-sm leading-snug text-foreground">
        <span className="text-lg" aria-hidden>
          ✨
        </span>
        <span>{insight.message}</span>
      </p>
    </div>
  );
}
