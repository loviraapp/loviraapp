"use client";

import type { MoodId, NeedId, PartnerCheckIn, RelationshipVibe } from "@/types/app";
import type { DailyRitual } from "@/lib/daily-ritual";
import type { SoftStreak } from "@/lib/soft-streaks";
import type { PersonalizedSupportInsight } from "@/types/support-preferences";
import { getMoodGlance } from "@/lib/visual-copy";
import { getNeedPhrase } from "@/lib/soft-streaks";
import { CoupleIllustration } from "@/components/onboarding/couple-illustration";
import { EmotionalCard } from "./emotional-card";
import {
  SceneCelebrate,
  SceneCheckIn,
  ScenePartner,
  SceneRitual,
  SceneStreak,
  SceneSupport,
} from "./emotional-card-scenes";

type EmotionalHomeProps = {
  vibe: RelationshipVibe;
  todayMoods: MoodId[];
  todayNeeds: NeedId[];
  partnerCheckIn: PartnerCheckIn;
  partnerName: string;
  dailyRitual: DailyRitual;
  ritualDone: boolean;
  softStreaks: SoftStreak[];
  personalizedInsight: PersonalizedSupportInsight | null;
  onEditCheckIn: () => void;
  onCompleteRitual: () => void;
  onPartnerTap: () => void;
};

export function EmotionalHome({
  vibe,
  todayMoods,
  todayNeeds,
  partnerCheckIn,
  partnerName,
  dailyRitual,
  ritualDone,
  softStreaks,
  personalizedInsight,
  onEditCheckIn,
  onCompleteRitual,
  onPartnerTap,
}: EmotionalHomeProps) {
  const mood = todayMoods[0] ? getMoodGlance(todayMoods[0]) : null;
  const needLine = todayNeeds.length ? getNeedPhrase(todayNeeds) : null;
  const topStreak = softStreaks.find((s) => s.count > 0);
  const partnerMood = partnerCheckIn.moods[0]
    ? getMoodGlance(partnerCheckIn.moods[0])
    : null;

  const partnerLine = partnerMood
    ? `${partnerName} feels ${partnerMood.short.toLowerCase()}`
    : `Check in when ${partnerName} is ready`;

  const streakLine = topStreak
    ? formatStreakLabel(topStreak.count, topStreak.label)
    : "Your rhythm is just beginning";

  const supportMain = personalizedInsight?.line ?? null;
  const supportNote = personalizedInsight?.note ?? null;

  const celebrateLine = ritualDone
    ? "You showed up for each other today"
    : "Small moments count — one ritual at a time";

  return (
    <div className="emotional-home">
      <EmotionalCard
        emoji={vibe.emoji}
        title={vibe.title}
        line={vibe.line}
        tone="plum"
        featured
        scene={<CoupleIllustration className="emotional-card-illustration" />}
      />

      <div className="emotional-home-grid">
        <EmotionalCard
          emoji="💜"
          title="Emotional check-in"
          line={
            mood
              ? `${mood.short}${needLine ? ` · ${needLine}` : ""}`
              : "Tap to share how you feel"
          }
          tone="lavender"
          scene={<SceneCheckIn />}
          onClick={onEditCheckIn}
        />

        <EmotionalCard
          emoji="☕"
          title="Gentle support idea"
          line={
            supportMain ?? "Complete your check-in for a personalized nudge"
          }
          subline={supportNote ?? undefined}
          tone="ivory"
          scene={<SceneSupport />}
        />

        <EmotionalCard
          emoji="✨"
          title="Small reconnect ritual"
          line={dailyRitual.text}
          tone="warm"
          scene={<SceneRitual />}
          action={
            !ritualDone ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompleteRitual();
                }}
                className="emotional-card-action"
              >
                We did this tonight
              </button>
            ) : (
              <p className="emotional-card-done">Saved to your constellation ✨</p>
            )
          }
        />

        <EmotionalCard
          emoji="🫂"
          title="Partner emotional insight"
          line={partnerLine}
          tone="lavender"
          scene={<ScenePartner />}
          onClick={onPartnerTap}
        />

        <EmotionalCard
          emoji="🔥"
          title="Connection momentum"
          line={streakLine}
          tone="ivory"
          scene={<SceneStreak />}
        />

        <EmotionalCard
          emoji="🎉"
          title="Celebrate small wins"
          line={celebrateLine}
          tone="warm"
          scene={<SceneCelebrate />}
        />
      </div>
    </div>
  );
}

function formatStreakLabel(count: number, label: string): string {
  if (count === 1 && label.endsWith("s")) {
    return `1 ${label.slice(0, -1)}`;
  }
  return `${count} ${label}`;
}
