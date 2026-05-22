"use client";

type HeroInsightProps = {
  headline: string;
  message: string;
  myEmoji?: string;
  theirEmoji?: string;
};

export function HeroInsight({
  headline,
  message,
  myEmoji,
  theirEmoji,
}: HeroInsightProps) {
  return (
    <section className="insight-hero" aria-label="Relationship insight">
      <div className="insight-hero-glow pointer-events-none" aria-hidden />
      <div className="relative">
        <p className="font-display text-lg text-primary/90">{headline}</p>
        <p className="mt-4 font-display text-[1.65rem] leading-snug tracking-tight text-foreground sm:text-3xl">
          {message}
        </p>
        {myEmoji || theirEmoji ? (
          <div className="mt-6 flex items-center gap-3 text-2xl opacity-80">
            {myEmoji ? <span aria-hidden>{myEmoji}</span> : null}
            {myEmoji && theirEmoji ? (
              <span className="text-sm text-muted">·</span>
            ) : null}
            {theirEmoji ? <span aria-hidden>{theirEmoji}</span> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
