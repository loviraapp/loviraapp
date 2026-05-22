"use client";

import type { EnergyLevel } from "@/types/app";
import { ENERGY_OPTIONS } from "@/lib/partner-check-in";
import { ENERGY_GLANCE } from "@/lib/visual-copy";

type EnergySelectorProps = {
  value: EnergyLevel | null;
  onChange: (energy: EnergyLevel) => void;
};

export function EnergySelector({ value, onChange }: EnergySelectorProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Energy
      </p>
      <div className="mt-2 flex gap-2">
        {ENERGY_OPTIONS.map((opt) => {
          const active = value === opt.id;
          const g = ENERGY_GLANCE[opt.id];
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-3 text-xs font-medium transition-all ${
                active
                  ? "bg-primary-soft text-primary shadow-sm ring-2 ring-primary/25"
                  : "bg-card text-muted"
              }`}
              aria-pressed={active}
            >
              <span aria-hidden>{g.emoji}</span>
              {g.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
