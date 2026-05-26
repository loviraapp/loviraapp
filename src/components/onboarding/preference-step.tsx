"use client";

import { EmotionChip } from "@/components/ui/emotion-chip";

type PreferenceOption = {
  id: string;
  emoji: string;
  label: string;
};

type PreferenceStepProps = {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  options: PreferenceOption[];
  selected: string[];
  onToggle: (id: string) => void;
  customValue?: string;
  onCustomChange?: (value: string) => void;
  customPlaceholder?: string;
  onContinue: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  requireSelection?: boolean;
};

/** Standalone preference editor (dashboard / support role). */
export function PreferenceStep({
  step,
  totalSteps,
  title,
  subtitle,
  options,
  selected,
  onToggle,
  customValue,
  onCustomChange,
  customPlaceholder,
  onContinue,
  onSkip,
  continueLabel = "Continue",
  requireSelection = true,
}: PreferenceStepProps) {
  const canContinue = requireSelection ? selected.length > 0 : true;

  return (
    <div className="preference-step animate-fade-in px-6 pb-10 pt-8">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < step ? "bg-primary" : "bg-border"
            }`}
            aria-hidden
          />
        ))}
      </div>

      <h2 className="mt-10 font-display text-[1.75rem] leading-snug text-foreground">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted">{subtitle}</p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <EmotionChip
            key={option.id}
            emoji={option.emoji}
            label={option.label}
            active={selected.includes(option.id)}
            onClick={() => onToggle(option.id)}
            size="lg"
          />
        ))}
      </div>

      {onCustomChange ? (
        <div className="mt-8">
          <label className="text-xs text-muted">Something else? (optional)</label>
          <input
            type="text"
            value={customValue ?? ""}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder={customPlaceholder}
            className="onboarding-input mt-2"
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="mt-12 w-full rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 disabled:opacity-40"
      >
        {continueLabel}
      </button>

      {onSkip ? (
        <button
          type="button"
          onClick={onSkip}
          className="mt-4 w-full text-center text-sm text-muted hover:text-primary"
        >
          Skip for now
        </button>
      ) : null}
    </div>
  );
}
