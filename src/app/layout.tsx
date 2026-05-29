import type { Metadata } from "next";
import { Fraunces, Geist, Dancing_Script } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lovira-chi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lovira — Phones down, together",
    template: "%s · Lovira",
  },
  description:
    "The app couples open once a week to put their phones down together — one intentional moment in a distracted world.",
  applicationName: "Lovira",
  keywords: [
    "couples app",
    "together mode",
    "phone-free time",
    "relationship ritual",
  ],
  authors: [{ name: "Lovira" }],
  creator: "Lovira",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Lovira",
    title: "Lovira — Phones down, together",
    description:
      "One intentional moment together each week. Invite your partner. Start Together Mode.",
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
        className={`${geistSans.variable} ${fraunces.variable} ${dancingScript.variable} min-h-screen antialiased`}
      >
        <SiteHeader />
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
