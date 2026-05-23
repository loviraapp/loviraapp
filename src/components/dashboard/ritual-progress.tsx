"use client";

type RitualProgressProps = {
  step: number;
};

const LABELS = ["Feelings", "Needs", "Vibe"];

export function RitualProgress({ step }: RitualProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((n) => {
        const active = step === n;
        const done = step > n;
        return (
          <div key={n} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                done || active ? "bg-primary" : "bg-border"
              }`}
            />
            <span
              className={`text-[10px] ${
                active ? "font-medium text-primary" : "text-muted"
              }`}
            >
              {LABELS[n - 1]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
