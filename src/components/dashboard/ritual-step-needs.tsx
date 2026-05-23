"use client";

import { NEEDS } from "@/lib/needs";
import type { NeedId } from "@/types/app";

type RitualStepNeedsProps = {
  selected: NeedId[];
  onToggle: (need: NeedId) => void;
};

export function RitualStepNeeds({ selected, onToggle }: RitualStepNeedsProps) {
  return (
    <div>
      <h2 className="font-display text-2xl text-foreground">
        What do you need today?
      </h2>
      <p className="mt-2 text-sm text-muted">Choose what would help most.</p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        {NEEDS.map((need) => {
          const active = selected.includes(need.id);
          return (
            <button
              key={need.id}
              type="button"
              onClick={() => onToggle(need.id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-card-elevated text-foreground shadow-sm"
              }`}
            >
              <span aria-hidden>{need.emoji}</span>
              {need.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
