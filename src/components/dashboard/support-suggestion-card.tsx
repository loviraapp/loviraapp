"use client";

import type { SupportSuggestion } from "@/types/app";
import type { CyclePhase } from "@/types/app";
import { getPhaseMeta } from "@/lib/cycle";

type SupportSuggestionCardProps = {
  suggestion: SupportSuggestion;
  phase: CyclePhase | null;
};

export function SupportSuggestionCard({
  suggestion,
  phase,
}: SupportSuggestionCardProps) {
  return (
    <div className="support-card relative overflow-hidden rounded-2xl border border-border/80 p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 support-card-glow" aria-hidden />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Optional support insight
        </p>
        <h3 className="mt-2 font-display text-2xl text-foreground">
          {suggestion.title}
        </h3>

        {phase ? (
          <span className="mt-3 inline-flex rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-secondary ring-1 ring-border">
            Rhythm context: {getPhaseMeta(phase).label}
          </span>
        ) : null}

        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          {suggestion.message}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/15">
          <span aria-hidden>♡</span>
          Gentle idea: {suggestion.action}
        </div>
      </div>
    </div>
  );
}
