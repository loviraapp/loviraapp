"use client";

type PeriodDateFormProps = {
  value: string;
  onChange: (date: string) => void;
};

export function PeriodDateForm({ value, onChange }: PeriodDateFormProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">
        Last cycle start date
      </span>
      <span className="mt-1 block text-xs text-muted">
        Used to estimate rhythm phase — optional language for any partner who
        tracks.
      </span>
      <input
        type="date"
        value={value}
        max={new Date().toISOString().slice(0, 10)}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-2xl border border-border bg-background/80 px-4 py-3.5 text-foreground outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}
