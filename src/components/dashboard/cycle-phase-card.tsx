"use client";

import type { CycleInfo } from "@/types/app";
import { PHASE_ORDER } from "@/lib/cycle";
import { getPhaseMeta } from "@/lib/cycle";
import type { CyclePhase } from "@/types/app";
import { PhaseVisual } from "./phase-visual";

type CyclePhaseCardProps = {
  cycle: CycleInfo | null;
  hasPeriodDate: boolean;
};

export function CyclePhaseCard({ cycle, hasPeriodDate }: CyclePhaseCardProps) {
  if (!hasPeriodDate) {
    return (
      <p className="text-sm text-muted">Optional rhythm context — skip anytime.</p>
    );
  }

  if (!cycle) {
    return (
      <p className="text-sm text-muted">Choose your most recent cycle start.</p>
    );
  }

  return (
    <div className="space-y-4">
      <PhaseVisual cycle={cycle} />
      <div className="flex gap-1">
        {PHASE_ORDER.map((phase) => {
          const active = phase === cycle.phase;
          return (
            <div
              key={phase}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                active ? "bg-primary" : "bg-border"
              }`}
              title={getPhaseMeta(phase as CyclePhase).label}
            />
          );
        })}
      </div>
    </div>
  );
}
