import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lovira-chi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lovira — Couple wellness",
    template: "%s · Lovira",
  },
  description:
    "Understand each other better with cycle awareness, mood check-ins, and gentle partner support. Private, local-first wellness for couples.",
  applicationName: "Lovira",
  keywords: [
    "couple wellness",
    "cycle tracking",
    "mood check-in",
    "partner support",
    "relationship wellness",
  ],
  authors: [{ name: "Lovira" }],
  creator: "Lovira",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Lovira",
    title: "Lovira — Couple wellness",
    description:
      "Cycle awareness, daily mood check-ins, and gentle partner support — saved privately on your device.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lovira — Couple wellness",
    description:
      "Cycle awareness, mood check-ins, and partner support for couples.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${fraunces.variable} min-h-screen antialiased`}
      >
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
                className="rounded-full bg-accent px-4 py-2 font-medium text-white shadow-sm shadow-accent/20 transition-all hover:opacity-90"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
