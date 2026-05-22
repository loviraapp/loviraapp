"use client";

import type { CycleInfo } from "@/types/app";
import { getPhaseMeta, PHASE_ORDER } from "@/lib/cycle";
import type { CyclePhase } from "@/types/app";

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "from-rose-200/90 to-accent-soft",
  follicular: "from-emerald-100/80 to-accent-soft",
  ovulation: "from-amber-100/80 to-accent-soft",
  luteal: "from-violet-200/70 to-lavender-soft",
};

type CyclePhaseCardProps = {
  cycle: CycleInfo | null;
  hasPeriodDate: boolean;
};

export function CyclePhaseCard({ cycle, hasPeriodDate }: CyclePhaseCardProps) {
  if (!hasPeriodDate) {
    return (
      <p className="text-sm text-muted">
        Add a cycle start date to see your current rhythm phase.
      </p>
    );
  }

  if (!cycle) {
    return (
      <p className="text-sm text-muted">
        That date looks ahead of today — choose your most recent cycle start.
      </p>
    );
  }

  const meta = getPhaseMeta(cycle.phase);

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${PHASE_COLORS[cycle.phase]} p-5 ring-1 ring-border/60`}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-foreground">{meta.label}</p>
          <p className="mt-1 text-sm text-muted">
            Day {cycle.dayInCycle} of {cycle.cycleLength}
          </p>
        </div>
        <span className="rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-muted ring-1 ring-border">
          ~{cycle.daysUntilNextPeriod}d to next cycle start
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-foreground/90">
        {meta.summary}
      </p>
      <div className="mt-4 flex gap-1">
        {PHASE_ORDER.map((phase) => {
          const active = phase === cycle.phase;
          return (
            <div
              key={phase}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                active ? "bg-accent" : "bg-border"
              }`}
              title={getPhaseMeta(phase).label}
            />
          );
        })}
      </div>
    </div>
  );
}
