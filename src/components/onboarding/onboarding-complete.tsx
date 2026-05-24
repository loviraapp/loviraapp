"use client";

type OnboardingCompleteProps = {
  yourName: string;
  partnerName: string;
  onEnter: () => void;
};

export function OnboardingComplete({
  yourName,
  partnerName,
  onEnter,
}: OnboardingCompleteProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 pb-12 pt-16 text-center animate-fade-in">
      <div className="onboarding-complete-glow mb-10 flex h-28 w-28 items-center justify-center rounded-full bg-primary-soft shadow-lg shadow-primary/15">
        <span className="text-5xl" aria-hidden>
          ✨
        </span>
      </div>
      <h2 className="font-display text-3xl leading-snug text-foreground">
        Lovira is ready for both of you.
      </h2>
      <p className="mt-4 max-w-xs text-base leading-relaxed text-muted">
        {yourName} & {partnerName} — your gentle ritual space is set. Check in
        when it feels right.
      </p>
      <button
        type="button"
        onClick={onEnter}
        className="mt-12 w-full max-w-sm rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25"
      >
        Enter Lovira
      </button>
    </div>
  );
}
