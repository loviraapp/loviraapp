"use client";

import { MOODS } from "@/lib/mood";
import { StepLabel } from "./step-label";
import type { MoodId } from "@/types/app";

type MoodCheckInProps = {
  selected: MoodId | null;
  onSelect: (mood: MoodId) => void;
};

export function MoodCheckIn({ selected, onSelect }: MoodCheckInProps) {
  return (
    <section className="dashboard-card">
      <StepLabel step={3} label="Mood check-in" />
      <h2 className="mt-1 font-display text-xl text-foreground">
        How are you feeling today?
      </h2>
      <p className="mt-2 text-sm text-muted">
        Tap one — saved for today on this device.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MOODS.map((mood) => {
          const active = selected === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => onSelect(mood.id)}
              className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition-all ${
                active
                  ? "border-accent bg-accent-soft shadow-md shadow-accent/10 ring-2 ring-accent/30"
                  : "border-border bg-background/60 hover:border-accent/40 hover:bg-card"
              }`}
              aria-pressed={active}
            >
              <span className="text-2xl" role="img" aria-label={mood.label}>
                {mood.emoji}
              </span>
              <span
                className={`text-sm font-medium ${active ? "text-accent" : "text-foreground"}`}
              >
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
