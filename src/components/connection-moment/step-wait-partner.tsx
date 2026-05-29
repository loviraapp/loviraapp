"use client";

import { motion } from "framer-motion";

type StepWaitPartnerProps = {
  partnerName: string | null;
  joined: boolean;
  isHost: boolean;
};

export function TogetherModeStepWaitPartner({
  partnerName,
  joined,
  isHost,
}: StepWaitPartnerProps) {
  const name = partnerName ?? "your partner";

  return (
    <motion.div
      className="cm-step cm-step--center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="cm-step-eyebrow">Almost ready</p>
      <h2 className="cm-activity-title font-display">
        {joined ? `${name} is here` : `Waiting for ${name}`}
      </h2>
      <p className="cm-activity-lead">
        {joined
          ? "When you’re both ready, continue into your moment together."
          : isHost
            ? "They’ll see a join prompt on their home screen. Keep this open — no rush."
            : "You’re in. Your partner will start when you’re both here."}
      </p>
      {!joined && (
        <div className="cm-wait-pulse" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      )}
    </motion.div>
  );
}
