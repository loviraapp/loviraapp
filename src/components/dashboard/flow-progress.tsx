const STEPS = [
  { num: 1, label: "Rhythm" },
  { num: 2, label: "Moods" },
  { num: 3, label: "Insight" },
  { num: 4, label: "Support" },
] as const;

type FlowProgressProps = {
  currentStep: number;
  maxReached: number;
  onStepClick?: (step: number) => void;
};

export function FlowProgress({
  currentStep,
  maxReached,
  onStepClick,
}: FlowProgressProps) {
  return (
    <nav aria-label="Dashboard progress" className="mb-8">
      <ol className="flex items-center justify-between gap-1">
        {STEPS.map((step, index) => {
          const done = maxReached > step.num;
          const active = currentStep === step.num;
          const reachable = step.num <= maxReached;

          return (
            <li key={step.num} className="flex flex-1 items-center">
              <button
                type="button"
                disabled={!reachable || !onStepClick}
                onClick={() => onStepClick?.(step.num)}
                className={`flex w-full flex-col items-center gap-1.5 ${
                  reachable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    active
                      ? "bg-accent text-white shadow-md shadow-accent/25"
                      : done
                        ? "bg-accent/15 text-accent"
                        : "bg-border/80 text-muted"
                  }`}
                >
                  {done && !active ? "✓" : step.num}
                </span>
                <span
                  className={`text-[10px] font-medium uppercase tracking-wider sm:text-xs ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {index < STEPS.length - 1 ? (
                <div
                  className={`mx-0.5 h-0.5 flex-1 rounded-full ${
                    maxReached > step.num ? "bg-accent/40" : "bg-border"
                  }`}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
