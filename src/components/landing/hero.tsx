import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Understand each other better
          </p>

          <h1 className="mt-8 font-display text-[2.5rem] font-medium leading-[1.1] tracking-tight text-foreground sm:text-6xl sm:leading-[1.08]">
            Feel understood.
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Show up together.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg text-muted sm:text-xl">
            Glanceable check-ins for both partners — private on your device.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:opacity-95 sm:w-auto"
            >
              Start your check-in
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-8 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary-soft sm:w-auto"
            >
              See how it works
            </a>
          </div>

          <p className="mt-6 text-sm text-muted">No account · On-device only · v0.5</p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <PreviewCard emoji="🌙" label="Rhythm" value="Luteal" />
              <PreviewCard emoji="🫶" label="You" value="Sensitive" highlight />
              <PreviewCard emoji="💡" label="Insight" value="Softness tonight" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({
  emoji,
  label,
  value,
  highlight,
}: {
  emoji: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 text-center transition-all duration-300 ${
        highlight
          ? "bg-gradient-to-br from-primary-soft to-card ring-1 ring-primary/20"
          : "bg-background/60 ring-1 ring-border/50"
      }`}
    >
      <span className="text-3xl" aria-hidden>
        {emoji}
      </span>
      <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-xl text-foreground">{value}</p>
    </div>
  );
}
