"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  if (
    pathname === "/" ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/onboarding") ||
    pathname?.startsWith("/connection-moment") ||
    pathname?.startsWith("/reel-to-real") ||
    pathname?.startsWith("/connection-prompt")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="font-display text-xl font-medium tracking-tight text-foreground"
        >
          Lovira
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/#how-it-works"
            className="hidden text-muted transition-colors hover:text-foreground sm:inline"
          >
            How it works
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-primary px-4 py-2 font-medium text-white shadow-sm shadow-primary/20 transition-all hover:opacity-90"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
