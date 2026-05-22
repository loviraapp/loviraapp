import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Emotional wellness for couples
          </p>

          <h1 className="mt-8 font-display text-[2.5rem] font-medium leading-[1.1] tracking-tight text-foreground sm:text-6xl sm:leading-[1.08]">
            Feel understood.
            <br />
            <span className="bg-gradient-to-r from-accent to-[#9b6b8a] bg-clip-text text-transparent">
              Show up together.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            Lovira helps both partners navigate rhythm, mood, and gentle
            support — so care feels natural, not guesswork. Built for couples,
            not one-sided tracking.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/30 sm:w-auto"
            >
              Start on your dashboard
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card/80 px-8 py-3.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-card sm:w-auto"
            >
              See how it works
            </a>
          </div>

          <p className="mt-6 text-sm text-muted">
            No account · Saved on your device · Free in v0.1
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-xl shadow-accent/5 backdrop-blur-md sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <PreviewCard
                label="Rhythm context"
                value="Luteal"
                hint="Shared awareness, not surveillance"
              />
              <PreviewCard
                label="Today's moods"
                value="Calm · Tired"
                hint="Multiple feelings welcome"
              />
              <PreviewCard
                label="Partner insight"
                value="Patience"
                hint="Gentle support guidance"
                highlight
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        highlight
          ? "bg-gradient-to-br from-accent-soft to-card ring-1 ring-accent/20"
          : "bg-background/80"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </div>
  );
}
