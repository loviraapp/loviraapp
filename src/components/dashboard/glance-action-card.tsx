"use client";

import type { SupportSuggestion } from "@/types/app";

type GlanceActionCardProps = {
  suggestion: SupportSuggestion;
};

export function GlanceActionCard({ suggestion }: GlanceActionCardProps) {
  const short =
    suggestion.message.split(".")[0]?.slice(0, 48) ??
    suggestion.action;

  return (
    <section className="glance-card">
      <p className="text-xs font-medium uppercase tracking-widest text-muted">
        Try today
      </p>
      <h3 className="mt-3 font-display text-2xl text-foreground">
        {suggestion.action}
      </h3>
      <p className="mt-2 text-sm text-muted">{short}.</p>
    </section>
  );
}
