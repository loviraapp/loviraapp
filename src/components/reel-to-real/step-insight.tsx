"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  REEL_MOODS,
  platformLabel,
  type ReelAnalysis,
} from "@/lib/reel-to-real";

type StepInsightProps = {
  analysis: ReelAnalysis;
  onContinue: () => void;
};

export function ReelStepInsight({ analysis, onContinue }: StepInsightProps) {
  const tags = [analysis.primary, analysis.secondary].filter(
    (m, i, arr) => arr.indexOf(m) === i
  );

  return (
    <motion.div
      className="rtr-step"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="rtr-step-label">Emotional insight</p>
      <p className="rtr-platform-badge">{platformLabel(analysis.platform)}</p>

      <motion.div
        className="rtr-insight-card"
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <p className="rtr-insight-line font-display">{analysis.insightLine}</p>
      </motion.div>

      <div className="rtr-tags" aria-label="Emotional tags">
        {tags.map((mood, i) => {
          const meta = REEL_MOODS[mood];
          return (
            <motion.span
              key={mood}
              className="rtr-tag"
              style={
                {
                  "--rtr-tag-color": meta.color,
                } as CSSProperties
              }
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 0.25 + i * 0.12,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.span
                className="rtr-tag-glow"
                aria-hidden
                animate={{ opacity: [0.4, 0.75, 0.4] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
              <span className="rtr-tag-emoji" aria-hidden>
                {meta.emoji}
              </span>
              {meta.label}
            </motion.span>
          );
        })}
      </div>

      <p className="rtr-insight-note">
        Lovira reads the feeling behind what you share — not the algorithm.
      </p>

      <motion.button
        type="button"
        className="rtr-btn rtr-btn--primary"
        onClick={onContinue}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        See conversation starters
      </motion.button>
    </motion.div>
  );
}
