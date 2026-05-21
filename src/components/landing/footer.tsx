import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/80 bg-card/50 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8">
        <div className="text-center sm:text-left">
          <p className="font-display text-lg text-foreground">Lovira</p>
          <p className="mt-1 text-sm text-muted">
            Couple wellness · v0.1 prototype
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
          <a href="#how-it-works" className="hover:text-foreground">
            How it works
          </a>
          <a href="#privacy" className="hover:text-foreground">
            Privacy
          </a>
          <Link href="/dashboard" className="font-medium text-accent hover:opacity-80">
            Dashboard
          </Link>
        </nav>
      </div>
    </footer>
  );
}
