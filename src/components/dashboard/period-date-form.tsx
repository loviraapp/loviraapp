"use client";

type PeriodDateFormProps = {
  value: string;
  onChange: (date: string) => void;
};

export function PeriodDateForm({ value, onChange }: PeriodDateFormProps) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">
        Rhythm date
      </span>
      <input
        type="date"
        value={value}
        max={new Date().toISOString().slice(0, 10)}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl bg-card px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/25"
      />
    </label>
  );
}
