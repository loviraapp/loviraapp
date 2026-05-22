"use client";

import type { MoodId, PartnerCheckIn, PartnerMoodId } from "@/types/app";
import type { UserRole } from "@/types/role";
import { MOODS } from "@/lib/mood";
import { PARTNER_MOODS } from "@/lib/partner-mood";
import { getMoodGlance, MOOD_GLANCE } from "@/lib/visual-copy";
import { getTheirMoods } from "@/lib/check-in-view";
import { EmotionChip } from "@/components/ui/emotion-chip";
import { EnergySelector } from "./energy-selector";
import { SupportIntentionPicker } from "./support-intention-picker";
import { MoodPill } from "@/components/ui/mood-pill";

type MoodPickerSheetProps = {
  open: boolean;
  onClose: () => void;
  role: UserRole;
  todayMoods: MoodId[];
  onMoodToggle: (mood: MoodId) => void;
  partnerCheckIn: PartnerCheckIn;
  onPartnerMoodToggle: (mood: PartnerMoodId) => void;
  onEnergyChange: (energy: PartnerCheckIn["energy"]) => void;
  onIntentionChange: (intention: PartnerCheckIn["supportIntention"]) => void;
};

export function MoodPickerSheet({
  open,
  onClose,
  role,
  todayMoods,
  onMoodToggle,
  partnerCheckIn,
  onPartnerMoodToggle,
  onEnergyChange,
  onIntentionChange,
}: MoodPickerSheetProps) {
  if (!open) return null;

  const isSupport = role === "support";
  const theirMoods = getTheirMoods(role, todayMoods, partnerCheckIn);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        className="relative max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-card-elevated px-5 pb-8 pt-4 shadow-2xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Your check-in</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-medium text-primary"
          >
            Done
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">
          Only you can edit this — your partner checks in on their side.
        </p>

        {isSupport ? (
          <>
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
              How you feel
            </p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {PARTNER_MOODS.map((mood) => {
                const g =
                  MOOD_GLANCE[mood.id as MoodId] ?? {
                    emoji: mood.emoji,
                    short: mood.label,
                  };
                return (
                  <EmotionChip
                    key={mood.id}
                    emoji={g.emoji}
                    label={g.short}
                    active={partnerCheckIn.moods.includes(mood.id)}
                    onClick={() => onPartnerMoodToggle(mood.id)}
                  />
                );
              })}
            </div>
            <div className="mt-6 space-y-5">
              <EnergySelector
                value={partnerCheckIn.energy}
                onChange={onEnergyChange}
              />
              <SupportIntentionPicker
                value={partnerCheckIn.supportIntention}
                onChange={onIntentionChange}
              />
            </div>
          </>
        ) : (
          <>
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
              How you feel
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {MOODS.map((mood) => {
                const g = getMoodGlance(mood.id);
                return (
                  <EmotionChip
                    key={mood.id}
                    emoji={g.emoji}
                    label={g.short}
                    active={todayMoods.includes(mood.id)}
                    onClick={() => onMoodToggle(mood.id)}
                  />
                );
              })}
            </div>
          </>
        )}

        <TheirCheckInReadOnly
          role={role}
          theirMoodIds={theirMoods}
          partnerEnergy={isSupport ? null : partnerCheckIn.energy}
        />
      </div>
    </div>
  );
}

function TheirCheckInReadOnly({
  role,
  theirMoodIds,
  partnerEnergy,
}: {
  role: UserRole;
  theirMoodIds: MoodId[] | PartnerMoodId[];
  partnerEnergy: PartnerCheckIn["energy"];
}) {
  const label = role === "support" ? "Their mood" : "Partner";
  const hint =
    role === "support"
      ? "They log this when using Tracking on this device."
      : "They log this when using Support on this device.";

  return (
    <div className="mt-8 rounded-2xl bg-card/80 px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label} · read-only
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
      {theirMoodIds.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {theirMoodIds.map((id) => {
            const g = getMoodGlance(id as MoodId);
            return (
              <MoodPill key={id} emoji={g.emoji} label={g.short} size="sm" />
            );
          })}
        </div>
      ) : (
        <p className="mt-3 text-sm text-foreground/70">Not checked in yet</p>
      )}
      {partnerEnergy && role === "tracking" ? (
        <p className="mt-2 text-xs text-muted">
          Energy · {partnerEnergy}
        </p>
      ) : null}
    </div>
  );
}
