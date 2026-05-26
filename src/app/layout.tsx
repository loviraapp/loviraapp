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
    default: "Lovira — Emotional wellness for couples",
    template: "%s · Lovira",
  },
  description:
    "Emotional wellness for couples — rhythm awareness, multi-mood check-ins, private insight, and gentle partner support. Local-first, no account required.",
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
    title: "Lovira — Emotional wellness for couples",
    description:
      "Rhythm awareness, multi-mood check-ins, and gentle partner support — saved privately on your device.",
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
