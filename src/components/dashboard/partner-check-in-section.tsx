"use client";

import type { PartnerCheckIn, PartnerMoodId } from "@/types/app";
import { PARTNER_MOODS } from "@/lib/partner-mood";
import { MOOD_GLANCE } from "@/lib/visual-copy";
import type { MoodId } from "@/types/app";
import { EmotionChip } from "@/components/ui/emotion-chip";
import { EnergySelector } from "./energy-selector";
import { SupportIntentionPicker } from "./support-intention-picker";

type PartnerCheckInSectionProps = {
  checkIn: PartnerCheckIn;
  onMoodToggle: (mood: PartnerMoodId) => void;
  onEnergyChange: (energy: PartnerCheckIn["energy"]) => void;
  onIntentionChange: (intention: PartnerCheckIn["supportIntention"]) => void;
  compactLabel?: boolean;
};

export function PartnerCheckInSection({
  checkIn,
  onMoodToggle,
  onEnergyChange,
  onIntentionChange,
  compactLabel,
}: PartnerCheckInSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        {!compactLabel ? (
          <p className="text-sm font-medium text-foreground">Mood</p>
        ) : null}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PARTNER_MOODS.map((mood) => (
            <EmotionChip
              key={mood.id}
              emoji={
                MOOD_GLANCE[mood.id as MoodId]?.emoji ?? mood.emoji
              }
              label={MOOD_GLANCE[mood.id as MoodId]?.short ?? mood.label}
              active={checkIn.moods.includes(mood.id)}
              onClick={() => onMoodToggle(mood.id)}
            />
          ))}
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
