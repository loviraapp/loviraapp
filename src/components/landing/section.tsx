import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "gradient";
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
  variant = "default",
}: SectionProps) {
  const bg =
    variant === "muted"
      ? "bg-accent-soft/40"
      : variant === "gradient"
        ? "landing-section-gradient"
        : "";

  return (
    <section id={id} className={`py-20 sm:py-28 ${bg} ${className}`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}
