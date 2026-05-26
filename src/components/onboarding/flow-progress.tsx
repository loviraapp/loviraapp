"use client";

type FlowProgressProps = {
  current: number;
  total?: number;
};

export function FlowProgress({ current, total = 4 }: FlowProgressProps) {
  return (
    <div
      className="ob-flow-progress"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current} of ${total}`}
    >
      <div className="ob-flow-progress-track">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`ob-flow-progress-segment ${i < current ? "ob-flow-progress-segment--done" : ""} ${i === current - 1 ? "ob-flow-progress-segment--active" : ""}`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
