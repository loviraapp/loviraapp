"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TOGETHER_ACTIVITIES,
  type TogetherActivityId,
} from "@/lib/together-activities";

type StepActivityProps = {
  initialActivityId?: TogetherActivityId;
  readOnly?: boolean;
  onContinue?: (activityId: TogetherActivityId) => void;
};

export function TogetherModeStepActivity({
  initialActivityId = "talk",
  readOnly = false,
  onContinue,
}: StepActivityProps) {
  const [selected, setSelected] = useState<TogetherActivityId>(initialActivityId);

  useEffect(() => {
    setSelected(initialActivityId);
  }, [initialActivityId]);

  return (
    <motion.div
      className="cm-step cm-step--center cm-step--activity"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="cm-step-eyebrow">Your time together</p>

      <h2 className="cm-activity-title font-display">
        {readOnly
          ? "Your intention for this moment"
          : "What do you want to do while the phones are down?"}
      </h2>
      <p className="cm-activity-lead">
        {readOnly
          ? "Your partner chose this — settle in together."
          : "Pick one gentle intention. The timer is just a container."}
      </p>

      <ul className="cm-activity-list" role="listbox" aria-label="Together activity">
        {TOGETHER_ACTIVITIES.map((activity) => {
          const active = selected === activity.id;
          return (
            <li key={activity.id}>
              <button
                type="button"
                role="option"
                aria-selected={active}
                disabled={readOnly}
                className={`cm-activity-option ${active ? "cm-activity-option--active" : ""}`}
                onClick={() => !readOnly && setSelected(activity.id)}
              >
                <span className="cm-activity-option-label">{activity.label}</span>
                <span className="cm-activity-option-desc">{activity.description}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {!readOnly && onContinue ? (
        <motion.button
          type="button"
          className="cm-btn cm-btn--primary"
          onClick={() => onContinue(selected)}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      ) : null}
    </motion.div>
  );
}
