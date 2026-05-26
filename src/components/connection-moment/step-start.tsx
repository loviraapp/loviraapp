"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TOGETHER_DURATION_MINUTES,
  type TogetherDuration,
} from "@/lib/connection-moment";

type StepStartProps = {
  onBegin: (minutes: TogetherDuration) => void;
};

export function TogetherModeStepStart({ onBegin }: StepStartProps) {
  const [minutes, setMinutes] = useState<TogetherDuration>(15);

  return (
    <motion.div
      className="cm-step cm-step--center"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="cm-together-label">Together Mode</p>

      <h1 className="cm-title font-display">
        Phones down.
        <br />
        Your person is here.
      </h1>

      <p className="cm-lead">
        Choose how long you want to be present — then put the phones away.
      </p>

      <div className="cm-duration-picker" role="group" aria-label="Session length">
        {TOGETHER_DURATION_MINUTES.map((m) => (
          <button
            key={m}
            type="button"
            className={`cm-duration-btn ${minutes === m ? "cm-duration-btn--active" : ""}`}
            onClick={() => setMinutes(m)}
            aria-pressed={minutes === m}
          >
            {m} min
          </button>
        ))}
      </div>

      <motion.button
        type="button"
        className="cm-btn cm-btn--primary"
        onClick={() => onBegin(minutes)}
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -2 }}
      >
        Begin together
      </motion.button>
    </motion.div>
  );
}
