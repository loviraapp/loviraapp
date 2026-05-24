"use client";

import type { PersonalizedSupportInsight } from "@/types/support-preferences";

type PersonalizedSupportCardProps = {
  insight: PersonalizedSupportInsight;
  partnerHint?: PersonalizedSupportInsight | null;
};

export function PersonalizedSupportCard({
  insight,
  partnerHint,
}: PersonalizedSupportCardProps) {
  return (
    <section className="personalized-support rounded-3xl bg-card-elevated/90 px-5 py-5 shadow-sm">
      <p className="text-sm text-primary/80">{insight.framing}</p>
      <div className="mt-4 flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          {insight.emoji}
        </span>
        <p className="text-base leading-relaxed text-foreground">{insight.line}</p>
      </div>
      {partnerHint ? (
        <div className="mt-4 border-t border-border/60 pt-4">
          <p className="text-xs text-muted">{partnerHint.framing}</p>
          <p className="mt-2 flex items-start gap-2 text-sm text-foreground/90">
            <span aria-hidden>{partnerHint.emoji}</span>
            {partnerHint.line}
          </p>
        </div>
      ) : null}
      <p className="mt-4 text-xs text-muted/80">
        Based on your preferences — not tracking, just understanding.
      </p>
    </section>
  );
}
