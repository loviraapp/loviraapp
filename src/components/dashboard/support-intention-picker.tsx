"use client";

import type { SupportIntention } from "@/types/app";
import { SUPPORT_INTENTIONS } from "@/lib/partner-check-in";

const SHORT: Record<SupportIntention, string> = {
  listening: "Listen",
  tasks: "Help",
  space: "Space",
  calm_time: "Calm",
  kind_message: "Message",
};

type SupportIntentionPickerProps = {
  value: SupportIntention | null;
  onChange: (intention: SupportIntention) => void;
};

export function SupportIntentionPicker({
  value,
  onChange,
}: SupportIntentionPickerProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Support intention
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SUPPORT_INTENTIONS.map((item) => {
          const active = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`rounded-full px-3.5 py-2 text-xs font-medium transition-all ${
                active
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-card text-muted"
              }`}
              aria-pressed={active}
            >
              {SHORT[item.id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
