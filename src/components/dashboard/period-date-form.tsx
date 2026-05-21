"use client";

import { StepLabel } from "./step-label";

type PeriodDateFormProps = {
  value: string;
  onChange: (date: string) => void;
};

export function PeriodDateForm({ value, onChange }: PeriodDateFormProps) {
  return (
    <section className="dashboard-card">
      <StepLabel step={1} label="Period start date" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Cycle tracking
          </p>
          <h2 className="mt-1 font-display text-xl text-foreground">
            Last period start
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We use this date to estimate your current phase. Stored only on this
            device.
          </p>
        </div>
      </div>

      <label className="mt-6 block">
        <span className="sr-only">Last period start date</span>
        <input
          type="date"
          value={value}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3.5 text-foreground outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </label>
    </section>
  );
}
