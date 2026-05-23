"use client";

import type { RelationshipVibe } from "@/types/app";
import { getMoodGlance } from "@/lib/visual-copy";
import type { MoodId, NeedId } from "@/types/app";
import { getNeedById } from "@/lib/needs";

type RitualStepVibeProps = {
  vibe: RelationshipVibe;
  meMoods: MoodId[];
  partnerMoods: MoodId[];
  meNeeds: NeedId[];
  partnerNeeds: NeedId[];
  partnerPending?: boolean;
  onAddPartnerCheckIn?: () => void;
};

export function RitualStepVibe({
  vibe,
  meMoods,
  partnerMoods,
  meNeeds,
  partnerNeeds,
  partnerPending,
  onAddPartnerCheckIn,
}: RitualStepVibeProps) {
  return (
    <div>
      <h2 className="font-display text-2xl text-foreground">
        Tonight&apos;s relationship vibe
      </h2>
      <div className="insight-hero mt-6">
        <div className="insight-hero-glow pointer-events-none" aria-hidden />
        <div className="relative text-center">
          <span className="text-4xl" aria-hidden>
            {vibe.emoji}
          </span>
          <p className="mt-4 font-display text-3xl text-foreground">
            {vibe.title}
          </p>
          <p className="mt-3 text-base text-muted">{vibe.line}</p>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <PersonSummary label="You" moods={meMoods} needs={meNeeds} />
        <PersonSummary
          label="Partner"
          moods={partnerMoods}
          needs={partnerNeeds}
          pending={partnerPending}
        />
      </div>
      {partnerPending && onAddPartnerCheckIn ? (
        <button
          type="button"
          onClick={onAddPartnerCheckIn}
          className="mt-6 w-full text-center text-sm text-primary"
        >
          Add partner check-in when they&apos;re ready →
        </button>
      ) : null}
    </div>
  );
}

function PersonSummary({
  label,
  moods,
  needs,
  pending,
}: {
  label: string;
  moods: MoodId[];
  needs: NeedId[];
  pending?: boolean;
}) {
  const mood = moods[0] ? getMoodGlance(moods[0]) : null;
  const need = needs[0] ? getNeedById(needs[0]) : null;

  return (
    <div className="flex-1 rounded-2xl bg-card/70 px-3 py-3 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium">
        {mood
          ? `${mood.emoji} ${mood.short}`
          : pending
            ? "Not yet"
            : "—"}
      </p>
      {need ? (
        <p className="mt-1 text-xs text-muted">{need.emoji} {need.label}</p>
      ) : null}
    </div>
  );
}
