"use client";

import type { EnergyLevel } from "@/types/app";
import { ENERGY_OPTIONS } from "@/lib/partner-check-in";

type EnergySelectorProps = {
  value: EnergyLevel | null;
  onChange: (energy: EnergyLevel) => void;
};

export function EnergySelector({ value, onChange }: EnergySelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground">Energy today</p>
      <div className="mt-3 flex gap-2">
        {ENERGY_OPTIONS.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex-1 rounded-2xl border px-3 py-3 text-sm font-medium transition-all ${
                active
                  ? "border-primary bg-primary-soft text-primary ring-2 ring-primary/25"
                  : "border-border bg-card text-muted hover:border-primary/30"
              }`}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
