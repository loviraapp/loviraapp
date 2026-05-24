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
    <div className="preference-step animate-fade-in">
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

      <p className="mt-8 text-xs font-medium uppercase tracking-wide text-primary">
        Step {step} of {totalSteps}
      </p>
      <h2 className="mt-3 font-display text-2xl leading-snug text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>

      <div className="mt-8 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {options.map((option) => (
          <EmotionChip
            key={option.id}
            emoji={option.emoji}
            label={option.label}
            active={selected.includes(option.id)}
            onClick={() => onToggle(option.id)}
          />
        ))}
      </div>

      {onCustomChange ? (
        <div className="mt-6">
          <label className="text-xs text-muted">Something else? (optional)</label>
          <input
            type="text"
            value={customValue ?? ""}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder={customPlaceholder}
            className="mt-2 w-full rounded-2xl border border-border bg-card-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="mt-10 w-full rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-opacity disabled:opacity-40"
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
