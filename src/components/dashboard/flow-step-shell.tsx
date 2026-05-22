import type { ReactNode } from "react";

type FlowStepShellProps = {
  step: number;
  label: string;
  title: string;
  description?: string;
  isActive: boolean;
  isComplete: boolean;
  children: ReactNode;
  footer?: ReactNode;
};

export function FlowStepShell({
  step,
  label,
  title,
  description,
  isActive,
  isComplete,
  children,
  footer,
}: FlowStepShellProps) {
  if (!isActive && !isComplete) {
    return (
      <section className="rounded-2xl border border-dashed border-border/80 bg-card/40 px-5 py-4 opacity-60">
        <p className="text-xs font-medium text-muted">
          Step {step}: {label} — complete earlier steps to unlock
        </p>
      </section>
    );
  }

  return (
    <section
      className={`dashboard-card transition-opacity ${
        isActive ? "ring-2 ring-primary/15" : ""
      }`}
    >
      <p className="mb-3 flex items-center gap-2 text-xs font-medium text-muted">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
          {isComplete && !isActive ? "✓" : step}
        </span>
        {label}
      </p>
      <h2 className="font-display text-xl text-foreground">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </section>
  );
}
