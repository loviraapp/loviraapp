"use client";

import Link from "next/link";
import { LoviraLogo } from "./lovira-logo";
import { IntroHeroImage } from "./intro-hero-image";

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
            Some weeks she needs more.
            <br />
            <span className="intro-home-headline-accent">
              Lovira helps you both understand why.
            </span>
          </h1>

          <p className="intro-home-subhead">
            Every few weeks, her emotional world shifts. Lovira gives both of you
            the awareness to stay close — then puts the phones down.
          </p>

          <div className="intro-home-actions">
            <Link href="/auth" className="intro-home-cta intro-home-cta--primary">
              <span className="intro-home-cta-shine" aria-hidden />
              <span className="intro-home-cta-label">Get started</span>
            </Link>
            <Link href="/auth" className="intro-home-cta intro-home-cta--secondary">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="intro-home-pillars" aria-label="How it works">
        <ul className="intro-home-pillar-list">
          <li className="intro-home-pillar">
            <h2 className="intro-home-pillar-title">Emotional rhythm</h2>
            <p className="intro-home-pillar-line">
              Understand the emotional phases that shape her week — and how to
              show up better.
            </p>
          </li>
          <li className="intro-home-pillar">
            <h2 className="intro-home-pillar-title">Today&apos;s nudge</h2>
            <p className="intro-home-pillar-line">
              One small action today. Based on where she actually is
              emotionally.
            </p>
          </li>
          <li className="intro-home-pillar intro-home-pillar--featured">
            <h2 className="intro-home-pillar-title">Together Mode</h2>
            <p className="intro-home-pillar-line">
              When you&apos;ve both checked in — a shared moment that
              doesn&apos;t need a screen.
            </p>
          </li>
        </ul>
      </section>

      <footer className="intro-home-footer">
        <p className="intro-home-footer-tagline">
          Understanding her emotional rhythm is what makes putting the phone
          down actually mean something.
        </p>
      </footer>
    </div>
  );
}
