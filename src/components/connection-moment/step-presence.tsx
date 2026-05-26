"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { durationToSeconds, formatTimer } from "@/lib/connection-moment";
import type { TogetherDuration } from "@/lib/connection-moment";

type StepPresenceProps = {
  durationMinutes: TogetherDuration;
  onComplete: () => void;
};

export function TogetherModeStepPresence({
  durationMinutes,
  onComplete,
}: StepPresenceProps) {
  const totalSeconds = durationToSeconds(durationMinutes);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const completedRef = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [onComplete]);

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <motion.div
      className="cm-step cm-step--presence"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="cm-presence-glow"
        aria-hidden
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <p className="cm-presence-message font-display">
        Now talk.
      </p>
      <p className="cm-presence-sub">
        We&apos;ll quietly stay in the background.
      </p>

      <div className="cm-timer-ring cm-timer-ring--minimal" aria-live="polite">
        <svg className="cm-timer-svg" viewBox="0 0 120 120" aria-hidden>
          <circle className="cm-timer-track" cx="60" cy="60" r="52" />
          <circle
            className="cm-timer-progress"
            cx="60"
            cy="60"
            r="52"
            style={{ strokeDashoffset: 327 - (327 * progress) / 100 }}
          />
        </svg>
        <span className="cm-timer-value cm-timer-value--quiet">
          {formatTimer(secondsLeft)}
        </span>
      </div>

      <button type="button" className="cm-text-btn" onClick={onComplete}>
        End when you&apos;re ready
      </button>
    </motion.div>
  );
}
