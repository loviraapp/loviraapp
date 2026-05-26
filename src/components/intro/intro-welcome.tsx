"use client";

import Link from "next/link";
import { LoviraLogo } from "./lovira-logo";
import { IntroHeroImage } from "./intro-hero-image";

const PILLARS: {
  title: string;
  line: string;
  featured?: boolean;
}[] = [
  {
    title: "Emotional Understanding",
    line: "Gentle awareness of how you and your partner are really doing.",
  },
  {
    title: "Today's Connection",
    line: "One warm nudge a day — not another feed to scroll.",
  },
  {
    title: "Together Mode",
    line: "Phones down. Your person is here.",
    featured: true,
  },
];

export function IntroWelcome() {
  return (
    <div className="intro-home intro-home--minimal">
      <div className="intro-home-glow" aria-hidden />

      <header className="intro-home-brand">
        <LoviraLogo className="intro-home-logo" />
        <span className="intro-home-wordmark font-display">Lovira</span>
      </header>

      <section className="intro-home-hero" aria-labelledby="intro-hero-heading">
        <IntroHeroImage />

        <div className="intro-home-hero-copy">
          <h1 id="intro-hero-heading" className="intro-home-headline font-display">
            Technology helping humans
            <br />
            <span className="intro-home-headline-accent">reconnect emotionally.</span>
          </h1>

          <p className="intro-home-subhead">
            Lovira helps couples understand each other better in a distracted world —
            then put the phones away for real moments together.
          </p>

          <div className="intro-home-actions">
            <Link href="/onboarding" className="intro-home-cta intro-home-cta--primary">
              <span className="intro-home-cta-shine" aria-hidden />
              <span className="intro-home-cta-label">Begin your journey</span>
            </Link>
            <Link href="/dashboard" className="intro-home-cta intro-home-cta--secondary">
              Open Lovira
            </Link>
          </div>
        </div>
      </section>

      <section className="intro-home-pillars" aria-label="Three gentle areas">
        <ul className="intro-home-pillar-list">
          {PILLARS.map((pillar) => (
            <li
              key={pillar.title}
              className={`intro-home-pillar ${pillar.featured ? "intro-home-pillar--featured" : ""}`}
            >
              <h2 className="intro-home-pillar-title">{pillar.title}</h2>
              <p className="intro-home-pillar-line">{pillar.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="intro-home-footer">
        <p className="intro-home-footer-tagline">
          Better offline moments — not more screen time.
        </p>
      </footer>
    </div>
  );
}
