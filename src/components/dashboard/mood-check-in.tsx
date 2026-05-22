"use client";

import { MOODS } from "@/lib/mood";
import type { MoodId } from "@/types/app";

type MoodCheckInProps = {
  selected: MoodId[];
  onToggle: (mood: MoodId) => void;
};

export function MoodCheckIn({ selected, onToggle }: MoodCheckInProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {MOODS.map((mood) => {
        const active = selected.includes(mood.id);
        return (
          <button
            key={mood.id}
            type="button"
            onClick={() => onToggle(mood.id)}
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
  );
}
