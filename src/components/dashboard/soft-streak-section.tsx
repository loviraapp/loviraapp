"use client";

import type { SoftStreak } from "@/lib/soft-streaks";

type SoftStreakSectionProps = {
  streaks: SoftStreak[];
};

export function SoftStreakSection({ streaks }: SoftStreakSectionProps) {
  const active = streaks.filter((s) => s.count > 0);
  if (active.length === 0) return null;

  return (
    <section className="space-y-3" aria-label="Soft streaks">
      <p className="text-sm text-muted">Your gentle rhythm</p>
      <ul className="space-y-2">
        {active.map((streak) => (
          <li
            key={`${streak.emoji}-${streak.label}`}
            className="flex items-center gap-3 rounded-2xl bg-card-elevated/60 px-4 py-3 shadow-sm"
          >
            <span className="text-xl" aria-hidden>
              {streak.emoji}
            </span>
            <span className="text-sm text-foreground">
              <span className="font-medium">{streak.count}</span>{" "}
              {streak.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
