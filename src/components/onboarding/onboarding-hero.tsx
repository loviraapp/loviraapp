"use client";

import { CoupleIllustration } from "./couple-illustration";

type OnboardingHeroProps = {
  onBegin: () => void;
  onExploreDemo: () => void;
};

export function OnboardingHero({ onBegin, onExploreDemo }: OnboardingHeroProps) {
  return (
    <div className="onboarding-hero mx-auto flex min-h-dvh max-w-md flex-col px-6 pb-12 pt-14 sm:pt-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Lovira
      </p>

      <figure className="onboarding-hero-art mx-auto mt-10 aspect-[320/200] w-full max-w-[18rem]">
        <CoupleIllustration className="block h-full w-full" />
      </figure>

      <div className="mt-10">
        <h1 className="font-display text-[1.85rem] leading-[1.2] tracking-tight text-foreground sm:text-[2.125rem]">
          Relationships feel better when both people feel understood.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          Lovira helps couples notice emotional needs, reconnect gently, and
          support each other better.
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-12">
        <button
          type="button"
          onClick={onBegin}
          className="w-full rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          💜 Start together
        </button>
        <button
          type="button"
          onClick={onExploreDemo}
          className="w-full rounded-full border border-border bg-card-elevated/80 py-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-primary-soft/40"
        >
          ✨ Explore demo
        </button>
      </div>
    </div>
  );
}
