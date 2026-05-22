"use client";

import { MOODS } from "@/lib/mood";
import { getMoodGlance } from "@/lib/visual-copy";
import type { MoodId } from "@/types/app";
import { EmotionChip } from "@/components/ui/emotion-chip";

type MoodCheckInProps = {
  selected: MoodId[];
  onToggle: (mood: MoodId) => void;
};

export function MoodCheckIn({ selected, onToggle }: MoodCheckInProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {MOODS.map((mood) => (
        <EmotionChip
          key={mood.id}
          emoji={getMoodGlance(mood.id).emoji}
          label={getMoodGlance(mood.id).short}
          active={selected.includes(mood.id)}
          onClick={() => onToggle(mood.id)}
          size="lg"
        />
      ))}
    </div>
  );
}
