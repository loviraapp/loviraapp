"use client";

import type { RelationshipVibe } from "@/types/app";

type VibeHeroProps = {
  vibe: RelationshipVibe;
};

export function VibeHero({ vibe }: VibeHeroProps) {
  return (
    <section className="vibe-hero" aria-label="Tonight's relationship vibe">
      <div className="vibe-hero-glow pointer-events-none" aria-hidden />
      <div className="relative text-center">
        <p className="text-sm text-primary/80">Tonight&apos;s relationship vibe</p>
        <span className="mt-6 block text-5xl" aria-hidden>
          {vibe.emoji}
        </span>
        <h2 className="mt-5 font-display text-[1.85rem] leading-tight tracking-tight text-foreground sm:text-4xl">
          {vibe.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xs text-base leading-relaxed text-muted">
          {vibe.line}
        </p>
      </div>
    </section>
  );
}
