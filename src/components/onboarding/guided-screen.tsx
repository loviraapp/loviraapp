"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { FlowProgress } from "./flow-progress";

type GuidedScreenProps = {
  stepKey: string;
  progressStep?: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
  onBack?: () => void;
};

export function GuidedScreen({
  stepKey,
  progressStep,
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  onBack,
}: GuidedScreenProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        className="lv-guided"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {progressStep ? <FlowProgress current={progressStep} total={4} /> : null}
        {onBack ? (
          <button type="button" className="lv-guided-back" onClick={onBack}>
            ← Back
          </button>
        ) : null}
        {eyebrow ? <p className="lv-guided-eyebrow">{eyebrow}</p> : null}
        <h2 className="lv-guided-title font-display">{title}</h2>
        {subtitle ? <p className="lv-guided-subtitle">{subtitle}</p> : null}
        <div className="lv-guided-body">{children}</div>
        <div className="lv-guided-footer">{footer}</div>
      </motion.div>
    </AnimatePresence>
  );
}
