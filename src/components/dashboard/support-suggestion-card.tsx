"use client";

import { StepLabel } from "./step-label";
import type { SupportSuggestion } from "@/types/app";
import type { CyclePhase, MoodId } from "@/types/app";
import { getPhaseMeta } from "@/lib/cycle";
import { getMoodById } from "@/lib/mood";

type SupportSuggestionCardProps = {
  suggestion: SupportSuggestion;
  phase: CyclePhase | null;
  mood: MoodId | null;
};

export function SupportSuggestionCard({
  suggestion,
  phase,
  mood,
}: SupportSuggestionCardProps) {
  return (
    <section className="support-card relative overflow-hidden rounded-3xl border border-border/80 p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-0 support-card-glow" aria-hidden />
      <div className="relative">
        <StepLabel step={5} label="Partner support suggestion" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender-deep">
          For your partner today
        </p>
        <h2 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
          {suggestion.title}
        </h2>

        {(phase || mood) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {phase ? (
              <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-accent ring-1 ring-border">
                Phase: {getPhaseMeta(phase).label}
              </span>
            ) : null}
            {mood ? (
              <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-muted ring-1 ring-border">
                Mood: {getMoodById(mood).emoji} {getMoodById(mood).label}
              </span>
            ) : null}
          </div>
        )}

        <p className="mt-5 text-base leading-relaxed text-foreground/90">
          {suggestion.message}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent-deep ring-1 ring-accent/20">
          <span aria-hidden>♡</span>
          Suggested action: {suggestion.action}
        </div>
      </div>
    </section>
  );
}
