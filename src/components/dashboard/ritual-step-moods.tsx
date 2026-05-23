"use client";

import { MOODS } from "@/lib/mood";
import { getMoodGlance } from "@/lib/visual-copy";
import type { MoodId } from "@/types/app";
import { EmotionChip } from "@/components/ui/emotion-chip";

type RitualStepMoodsProps = {
  selected: MoodId[];
  onToggle: (mood: MoodId) => void;
};

export function RitualStepMoods({ selected, onToggle }: RitualStepMoodsProps) {
  return (
    <div>
      <h2 className="font-display text-2xl text-foreground">
        How are you feeling today?
      </h2>
      <p className="mt-2 text-sm text-muted">Tap all that fit — no wrong answers.</p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {MOODS.map((mood) => {
          const g = getMoodGlance(mood.id);
          return (
            <EmotionChip
              key={mood.id}
              emoji={g.emoji}
              label={g.short}
              active={selected.includes(mood.id)}
              onClick={() => onToggle(mood.id)}
              size="lg"
            />
          );
        })}
      </div>
    </div>
  );
}
