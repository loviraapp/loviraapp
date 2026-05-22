"use client";

import type { PartnerCheckIn, PartnerMoodId } from "@/types/app";
import { PARTNER_MOODS } from "@/lib/partner-mood";
import { EnergySelector } from "./energy-selector";
import { SupportIntentionPicker } from "./support-intention-picker";

type PartnerCheckInSectionProps = {
  checkIn: PartnerCheckIn;
  onMoodToggle: (mood: PartnerMoodId) => void;
  onEnergyChange: (energy: PartnerCheckIn["energy"]) => void;
  onIntentionChange: (intention: PartnerCheckIn["supportIntention"]) => void;
};

export function PartnerCheckInSection({
  checkIn,
  onMoodToggle,
  onEnergyChange,
  onIntentionChange,
}: PartnerCheckInSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-foreground">How are you feeling?</p>
        <p className="mt-1 text-xs text-muted">
          For any partner — including men supporting their person. Select all that
          fit.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PARTNER_MOODS.map((mood) => {
            const active = checkIn.moods.includes(mood.id);
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => onMoodToggle(mood.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition-all ${
                  active
                    ? "border-primary bg-primary-soft shadow-sm ring-2 ring-primary/25"
                    : "border-border bg-card hover:border-primary/30"
                }`}
                aria-pressed={active}
              >
                <span className="text-xl" role="img" aria-label={mood.label}>
                  {mood.emoji}
                </span>
                <span
                  className={`text-xs font-medium ${active ? "text-primary" : "text-foreground"}`}
                >
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <EnergySelector
        value={checkIn.energy}
        onChange={(e) => onEnergyChange(e)}
      />

      <SupportIntentionPicker
        value={checkIn.supportIntention}
        onChange={(i) => onIntentionChange(i)}
      />
    </div>
  );
}
