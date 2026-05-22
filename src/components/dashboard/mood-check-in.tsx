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
                ? "border-primary bg-primary-soft shadow-sm ring-2 ring-primary/25"
                : "border-border bg-card hover:border-primary/30"
            }`}
            aria-pressed={active}
          >
            <span className="text-2xl" role="img" aria-label={mood.label}>
              {mood.emoji}
            </span>
            <span
              className={`text-sm font-medium ${active ? "text-primary" : "text-foreground"}`}
            >
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
