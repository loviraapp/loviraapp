"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LoviraLogo } from "@/components/intro/lovira-logo";
import { pickConnectionPrompt } from "@/lib/connection-moment";

export function ConnectionPromptScreen() {
  const prompt = useMemo(() => pickConnectionPrompt(), []);

  return (
    <div className="cp-screen">
      <div className="cp-screen-glow" aria-hidden />
      <header className="cp-header">
        <Link href="/" className="cp-brand" aria-label="Lovira home">
          <LoviraLogo className="cp-logo" />
          <span className="font-display">Lovira</span>
        </Link>
      </header>

      <motion.main
        className="cp-main"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="cp-eyebrow">Connection Prompt</p>
        <motion.article
          className="cp-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <p className="cp-prompt font-display">{prompt}</p>
        </motion.article>
        <p className="cp-hint">Say it out loud. Then put the phones down when you&apos;re ready.</p>

        <Link href="/connection-moment" className="cp-cta cp-cta--primary">
          Start Together Mode
        </Link>
        <Link href="/" className="cp-cta cp-cta--ghost">
          Back home
        </Link>
      </motion.main>
    </div>
  );
}
