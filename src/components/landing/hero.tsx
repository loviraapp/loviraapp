import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur-sm">
            Daily ritual for couples
          </p>

          <h1 className="mt-8 font-display text-[2.5rem] font-medium leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            Feel closer.
            <br />
            <span className="text-primary">One small ritual a day.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg text-muted">
            Moods, needs, and tonight&apos;s vibe — for both partners. Not a
            period tracker. Not one-sided.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] sm:w-auto"
            >
              Start today&apos;s ritual
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-8 py-3.5 text-sm font-medium text-foreground sm:w-auto"
            >
              How it works
            </a>
          </div>

          <p className="mt-6 text-sm text-muted">Private on your device · v0.8</p>
        </div>
      </div>
    </section>
  );
}
