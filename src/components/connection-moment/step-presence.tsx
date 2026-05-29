"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { durationToSeconds, formatTimer } from "@/lib/connection-moment";
import type { TogetherDuration } from "@/lib/connection-moment";

type StepPresenceProps = {
  durationMinutes: TogetherDuration;
  activityPresenceLine: string;
  startedAt?: string | null;
  onComplete?: () => void;
};

function secondsRemaining(
  durationMinutes: TogetherDuration,
  startedAt?: string | null
): number {
  const total = durationToSeconds(durationMinutes);
  if (!startedAt) return total;
  const elapsed = Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / 1000
  );
  return Math.max(0, total - elapsed);
}

export function TogetherModeStepPresence({
  durationMinutes,
  activityPresenceLine,
  startedAt,
  onComplete,
}: StepPresenceProps) {
  const totalSeconds = durationToSeconds(durationMinutes);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    secondsRemaining(durationMinutes, startedAt)
  );
  const completedRef = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      const left = secondsRemaining(durationMinutes, startedAt);
      setSecondsLeft(left);
      if (left <= 0 && onComplete && !completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [durationMinutes, startedAt, onComplete]);

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

      <p className="cm-presence-message font-display">Now talk.</p>
      <p className="cm-presence-sub">
        We&apos;ll quietly stay in the background.
      </p>

      <p className="cm-presence-activity">{activityPresenceLine}</p>

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

      {onComplete ? (
        <button type="button" className="cm-text-btn" onClick={onComplete}>
          End when you&apos;re ready
        </button>
      ) : null}
    </motion.div>
  );
}
