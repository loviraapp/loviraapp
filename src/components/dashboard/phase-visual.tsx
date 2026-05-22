"use client";

import type { CycleInfo } from "@/types/app";
import { getPhaseMeta } from "@/lib/cycle";
import { PHASE_VISUAL } from "@/lib/visual-copy";

type PhaseVisualProps = {
  cycle: CycleInfo;
};

export function PhaseVisual({ cycle }: PhaseVisualProps) {
  const meta = getPhaseMeta(cycle.phase);
  const visual = PHASE_VISUAL[cycle.phase];

  return (
    <div className="flex items-center gap-5 rounded-2xl bg-card p-5 ring-1 ring-border/80 transition-all duration-300">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-4xl"
        aria-hidden
      >
        {visual.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-2xl text-foreground">{meta.label}</p>
        <p className="mt-1 text-sm text-muted">
          Day {cycle.dayInCycle} · {visual.glance}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-foreground/85">
          {meta.summary.split(".")[0]}.
        </p>
      </div>
      <span className="hidden shrink-0 rounded-full bg-background px-3 py-1 text-xs text-muted ring-1 ring-border sm:inline">
        ~{cycle.daysUntilNextPeriod}d
      </span>
    </div>
  );
}
