const STEPS = [
  { num: 1, label: "Rhythm" },
  { num: 2, label: "You" },
  { num: 3, label: "Partner" },
  { num: 4, label: "Insight" },
  { num: 5, label: "Support" },
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
      <ol className="flex items-center justify-between gap-0.5">
        {STEPS.map((step, index) => {
          const done = maxReached > step.num;
          const active = currentStep === step.num;
          const reachable = step.num <= maxReached;

          return (
            <li key={step.num} className="flex min-w-0 flex-1 items-center">
              <button
                type="button"
                disabled={!reachable || !onStepClick}
                onClick={() => onStepClick?.(step.num)}
                className={`flex w-full min-w-0 flex-col items-center gap-1 ${
                  reachable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold sm:h-8 sm:w-8 sm:text-xs ${
                    active
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : done
                        ? "bg-primary/15 text-primary"
                        : "bg-border/80 text-muted"
                  }`}
                >
                  {done && !active ? "✓" : step.num}
                </span>
                <span
                  className={`truncate text-[9px] font-medium uppercase tracking-wide sm:text-[10px] ${
                    active ? "text-primary" : "text-muted"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {index < STEPS.length - 1 ? (
                <div
                  className={`mx-0.5 h-0.5 min-w-[4px] flex-1 rounded-full ${
                    maxReached > step.num ? "bg-primary/35" : "bg-border"
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
