"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  REFLECTION_FEELINGS,
  type ReflectionFeelingId,
  type TogetherDuration,
} from "@/lib/connection-moment";
import type { TogetherActivityId } from "@/lib/together-activities";

type StepReflectionProps = {
  sessionId: string;
  durationMinutes: TogetherDuration;
  activityId: TogetherActivityId;
  userId: string | null;
  reflections?: { user_id: string; feelings: string[] }[];
};

export function TogetherModeStepReflection({
  sessionId,
  userId,
  reflections = [],
}: StepReflectionProps) {
  const alreadySubmitted = reflections.some((r) => r.user_id === userId);
  const [selected, setSelected] = useState<ReflectionFeelingId[]>([]);
  const [done, setDone] = useState(alreadySubmitted);
  const [waiting, setWaiting] = useState(false);

  function toggle(id: ReflectionFeelingId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleFinish() {
    if (selected.length === 0) return;
    setWaiting(true);
    const res = await fetch(`/api/session/${sessionId}/reflect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feelings: selected }),
    });
    setWaiting(false);
    if (res.ok) setDone(true);
  }

  if (done) {
    const bothDone = reflections.length >= 2 || (reflections.length >= 1 && alreadySubmitted);
    return (
      <motion.div
        className="cm-step cm-step--center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <p className="cm-closing-quote font-display">
          Small moments create strong relationships.
        </p>
        <p className="cm-closing-sub">
          {bothDone
            ? "This evening is saved in your shared memory."
            : "Waiting for your partner to reflect…"}
        </p>
        <div className="cm-closing-actions">
          <Link href="/dashboard" className="cm-btn cm-btn--primary">
            Back home
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="cm-step cm-step--reflection"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="cm-reflection-title font-display">
        How did this moment feel?
      </h2>
      <p className="cm-reflection-sub">
        Choose what fits — your partner will see this in your shared memory.
      </p>

      <ul className="cm-feeling-list">
        {REFLECTION_FEELINGS.map((feeling, i) => {
          const active = selected.includes(feeling.id);
          return (
            <motion.li
              key={feeling.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <button
                type="button"
                className={`cm-feeling-chip ${active ? "cm-feeling-chip--active" : ""}`}
                onClick={() => toggle(feeling.id)}
                aria-pressed={active}
              >
                <span aria-hidden>{feeling.emoji}</span>
                {feeling.label}
              </button>
            </motion.li>
          );
        })}
      </ul>

      <motion.button
        type="button"
        className="cm-btn cm-btn--primary"
        disabled={selected.length === 0 || waiting}
        onClick={handleFinish}
        whileTap={{ scale: 0.98 }}
      >
        {waiting ? "Saving…" : "Save reflection"}
      </motion.button>
    </motion.div>
  );
}
