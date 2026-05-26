"use client";

import { motion } from "framer-motion";

type StepPromptsProps = {
  prompts: string[];
  onContinue: () => void;
};

export function ReelStepPrompts({ prompts, onContinue }: StepPromptsProps) {
  return (
    <motion.div
      className="rtr-step"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="rtr-step-label">Connection bridge</p>
      <h2 className="rtr-subtitle font-display">
        Three ways to turn this into a real moment
      </h2>

      <ul className="rtr-prompt-list">
        {prompts.map((prompt, i) => (
          <motion.li
            key={prompt}
            className="rtr-prompt-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.12 * i,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="rtr-prompt-num">{i + 1}</span>
            <p className="rtr-prompt-text">{prompt}</p>
          </motion.li>
        ))}
      </ul>

      <p className="rtr-prompt-hint">
        Pick one. Say it out loud. Let the reel become a doorway, not the destination.
      </p>

      <motion.button
        type="button"
        className="rtr-btn rtr-btn--soft"
        onClick={onContinue}
        whileTap={{ scale: 0.98 }}
      >
        We&apos;re ready to talk
      </motion.button>
    </motion.div>
  );
}
