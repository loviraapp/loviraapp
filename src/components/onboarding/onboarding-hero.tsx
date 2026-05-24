"use client";

import { CoupleIllustration } from "./couple-illustration";

type OnboardingHeroProps = {
  onBegin: () => void;
};

export function OnboardingHero({ onBegin }: OnboardingHeroProps) {
  return (
    <div className="onboarding-hero flex min-h-dvh flex-col">
      <div className="relative flex-1 overflow-hidden">
        <CoupleIllustration className="h-full w-full object-cover" />
      </div>
      <div className="onboarding-hero-content px-6 pb-10 pt-8">
        <p className="text-xs font-medium tracking-wide text-primary">Lovira</p>
        <h1 className="mt-4 font-display text-[2rem] leading-tight tracking-tight text-foreground sm:text-4xl">
          Understand each other better.
        </h1>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
          Small emotional check-ins for calmer, closer relationships.
        </p>
        <button
          type="button"
          onClick={onBegin}
          className="mt-10 w-full rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          ✨ Begin together
        </button>
      </div>
    </div>
  );
}
