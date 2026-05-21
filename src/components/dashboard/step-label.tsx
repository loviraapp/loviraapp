type StepLabelProps = {
  step: number;
  label: string;
};

export function StepLabel({ step, label }: StepLabelProps) {
  return (
    <p className="mb-3 flex items-center gap-2 text-xs font-medium text-muted">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-[10px] font-semibold text-accent">
        {step}
      </span>
      {label}
    </p>
  );
}
