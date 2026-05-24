"use client";

type CoupleSetupStepProps = {
  yourName: string;
  partnerName: string;
  anniversary: string;
  onYourNameChange: (v: string) => void;
  onPartnerNameChange: (v: string) => void;
  onAnniversaryChange: (v: string) => void;
  onContinue: () => void;
};

export function CoupleSetupStep({
  yourName,
  partnerName,
  anniversary,
  onYourNameChange,
  onPartnerNameChange,
  onAnniversaryChange,
  onContinue,
}: CoupleSetupStepProps) {
  const canContinue =
    yourName.trim().length > 0 && partnerName.trim().length > 0;

  return (
    <div className="onboarding-step animate-fade-in px-6 pb-10 pt-12">
      <p className="text-xs font-medium uppercase tracking-wide text-primary">
        Couple setup
      </p>
      <h2 className="mt-4 font-display text-3xl leading-snug text-foreground">
        Who&apos;s sharing this space?
      </h2>
      <p className="mt-3 text-sm text-muted">
        Just names — warm, private, and stored on this device only.
      </p>

      <div className="mt-10 space-y-5">
        <label className="block">
          <span className="text-sm text-muted">Your name</span>
          <input
            type="text"
            value={yourName}
            onChange={(e) => onYourNameChange(e.target.value)}
            placeholder="Alex"
            className="onboarding-input mt-2"
            autoComplete="given-name"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Partner&apos;s name</span>
          <input
            type="text"
            value={partnerName}
            onChange={(e) => onPartnerNameChange(e.target.value)}
            placeholder="Jordan"
            className="onboarding-input mt-2"
            autoComplete="off"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Anniversary (optional)</span>
          <input
            type="date"
            value={anniversary}
            onChange={(e) => onAnniversaryChange(e.target.value)}
            className="onboarding-input mt-2"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="mt-12 w-full rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
