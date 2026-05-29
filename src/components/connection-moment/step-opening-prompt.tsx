"use client";

import { motion } from "framer-motion";

type StepOpeningPromptProps = {
  prompt: string;
  activityLabel: string;
  readOnly?: boolean;
  onContinue?: () => void;
};

export function TogetherModeStepOpeningPrompt({
  prompt,
  activityLabel,
  readOnly = false,
  onContinue,
}: StepOpeningPromptProps) {
  return (
    <motion.div
      className="cm-step cm-step--center"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="cm-step-eyebrow">A gentle start · {activityLabel}</p>

      <motion.article
        className="cm-opening-prompt-card"
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.45 }}
      >
        <p className="cm-opening-prompt-text font-display">{prompt}</p>
      </motion.article>

      <p className="cm-opening-hint">
        {readOnly
          ? "Share this together. The timer starts when you’re both ready."
          : "Share this together, then let the screen fade into the background."}
      </p>

      {!readOnly && onContinue ? (
        <motion.button
          type="button"
          className="cm-btn cm-btn--primary"
          onClick={onContinue}
          whileTap={{ scale: 0.98 }}
        >
          We&apos;re ready
        </motion.button>
      ) : null}
    </motion.div>
  );
}
