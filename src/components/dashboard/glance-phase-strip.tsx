"use client";

import type { CycleInfo } from "@/types/app";
import { PHASE_VISUAL } from "@/lib/visual-copy";
import { getPhaseMeta, PHASE_ORDER } from "@/lib/cycle";
type GlancePhaseStripProps = {
  cycle: CycleInfo | null;
  hasPeriodDate: boolean;
  onExpand: () => void;
};

export function GlancePhaseStrip({
  cycle,
  hasPeriodDate,
  onExpand,
}: GlancePhaseStripProps) {
  if (!hasPeriodDate || !cycle) {
    return (
      <button
        type="button"
        onClick={onExpand}
        className="w-full rounded-2xl px-1 py-2 text-center text-xs text-muted transition-colors hover:text-primary"
      >
        + Rhythm context (optional)
      </button>
    );
  }

  const visual = PHASE_VISUAL[cycle.phase];
  const meta = getPhaseMeta(cycle.phase);

  return (
    <button
      type="button"
      onClick={onExpand}
      className="flex w-full items-center justify-between gap-3 rounded-2xl bg-card/50 px-4 py-3 text-left transition-colors hover:bg-card"
    >
      <span className="flex items-center gap-2 text-sm text-muted">
        <span aria-hidden>{visual.emoji}</span>
        <span>
          {meta.label} · Day {cycle.dayInCycle}
        </span>
      </span>
      <span className="flex gap-1" aria-hidden>
        {PHASE_ORDER.map((phase) => (
          <span
            key={phase}
            className={`h-1.5 w-4 rounded-full ${
              phase === cycle.phase ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </span>
    </button>
  );
}
