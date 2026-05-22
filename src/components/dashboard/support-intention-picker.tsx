"use client";

import type { SupportIntention } from "@/types/app";
import { SUPPORT_INTENTIONS } from "@/lib/partner-check-in";

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
      <p className="text-sm font-medium text-foreground">
        I can support today by…{" "}
        <span className="font-normal text-muted">(optional)</span>
      </p>
      <div className="mt-3 space-y-2">
        {SUPPORT_INTENTIONS.map((item) => {
          const active = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                active
                  ? "border-secondary bg-secondary-soft ring-2 ring-secondary/25"
                  : "border-border bg-card hover:border-primary/25"
              }`}
              aria-pressed={active}
            >
              <span
                className={`text-sm font-medium ${active ? "text-secondary-deep" : "text-foreground"}`}
              >
                {item.label}
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
