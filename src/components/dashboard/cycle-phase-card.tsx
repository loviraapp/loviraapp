"use client";

import { StepLabel } from "./step-label";
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
      <section className="dashboard-card">
        <StepLabel step={2} label="Cycle day & phase" />
        <h2 className="font-display text-xl text-foreground">
          Waiting for your date
        </h2>
        <p className="mt-3 text-sm text-muted">
          Add your last period start above to see your current phase and day in
          cycle.
        </p>
      </section>
    );
  }

  if (!cycle) {
    return (
      <section className="dashboard-card">
        <StepLabel step={2} label="Cycle day & phase" />
        <p className="text-sm text-muted">
          That date looks ahead of today — choose your most recent period start.
        </p>
      </section>
    );
  }

  const meta = getPhaseMeta(cycle.phase);

  return (
    <section className="dashboard-card overflow-hidden">
      <StepLabel step={2} label="Cycle day & phase" />

      <div
        className={`mt-4 rounded-2xl bg-gradient-to-br ${PHASE_COLORS[cycle.phase]} p-5 ring-1 ring-border/60`}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-3xl text-foreground">{meta.label}</p>
            <p className="mt-1 text-sm text-muted">
              Day {cycle.dayInCycle} of {cycle.cycleLength}
            </p>
          </div>
          <span className="rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-muted ring-1 ring-border">
            ~{cycle.daysUntilNextPeriod}d to next period
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          {meta.summary}
        </p>
      </div>

      <div className="mt-5 flex gap-1">
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
    </section>
  );
}
