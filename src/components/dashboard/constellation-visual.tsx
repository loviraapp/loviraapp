"use client";

import type { ConstellationStar } from "@/lib/constellation";

type ConstellationVisualProps = {
  stars: ConstellationStar[];
};

export function ConstellationVisual({ stars }: ConstellationVisualProps) {
  if (stars.length === 0) return null;

  return (
    <section
      className="constellation relative mx-auto h-28 w-full max-w-sm overflow-hidden rounded-2xl"
      aria-label={`${stars.length} connection stars`}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 112"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {stars.slice(0, -1).map((star, i) => {
          const next = stars[i + 1];
          if (!next) return null;
          return (
            <line
              key={`line-${star.dateKey}`}
              x1={star.x}
              y1={star.y}
              x2={next.x}
              y2={next.y}
              className="constellation-line"
            />
          );
        })}
      </svg>
      {stars.map((star) => (
        <span
          key={star.dateKey}
          className="constellation-star absolute"
          style={{
            left: `${(star.x / 320) * 100}%`,
            top: `${(star.y / 112) * 100}%`,
          }}
          title={star.dateKey}
          aria-hidden
        />
      ))}
      <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted/80">
        {stars.length} gentle {stars.length === 1 ? "moment" : "moments"} remembered
      </p>
    </section>
  );
}
