"use client";

import type { PersonalInsight } from "@/types/app";

type PersonalInsightCardProps = {
  insight: PersonalInsight;
};

export function PersonalInsightCard({ insight }: PersonalInsightCardProps) {
  return (
    <div className="rounded-2xl bg-card-elevated p-4 shadow-sm">
      <p className="text-[10px] font-medium uppercase tracking-wide text-lavender-deep">
        Private · you
      </p>
      <p className="mt-2 text-sm text-foreground">{insight.message}</p>
    </div>
  );
}
