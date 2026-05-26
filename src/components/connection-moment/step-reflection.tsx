"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  REFLECTION_FEELINGS,
  type ReflectionFeelingId,
  type TogetherDuration,
  saveTogetherMoment,
} from "@/lib/connection-moment";

type StepReflectionProps = {
  durationMinutes: TogetherDuration;
};

export function TogetherModeStepReflection({
  durationMinutes,
}: StepReflectionProps) {
  const [selected, setSelected] = useState<ReflectionFeelingId[]>([]);
  const [done, setDone] = useState(false);

  function toggle(id: ReflectionFeelingId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleFinish() {
    if (selected.length === 0) return;
    saveTogetherMoment({
      completedAt: new Date().toISOString(),
      feelings: selected,
      durationMinutes,
    });
    setDone(true);
  }

  if (done) {
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
          Put the phones away. You showed up for each other.
        </p>
        <div className="cm-closing-actions">
          <Link href="/" className="cm-btn cm-btn--primary">
            Back home
          </Link>
          <Link href="/dashboard" className="cm-text-btn">
            Daily check-in
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
      <p className="cm-reflection-sub">Choose what fits — then leave the screen behind.</p>

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
        disabled={selected.length === 0}
        onClick={handleFinish}
        whileTap={{ scale: 0.98 }}
      >
        Complete Together Mode
      </motion.button>
    </motion.div>
  );
}
