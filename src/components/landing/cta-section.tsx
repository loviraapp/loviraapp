import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="cta-panel relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 cta-glow" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Ready for a softer way to connect?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Open your dashboard, log your rhythm today, and see how Lovira
              guides gentle partner support — in minutes, not months.
            </p>
            <Link
              href="/dashboard"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-10 py-4 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              Open Lovira dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
