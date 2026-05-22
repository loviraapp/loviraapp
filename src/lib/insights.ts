import type { CyclePhase, MoodId, PersonalInsight } from "@/types/app";
import { getPhaseMeta } from "@/lib/cycle";
import { getPrimaryMood } from "@/lib/mood";

const MOOD_INSIGHTS: Partial<Record<MoodId, string>> = {
  calm: "Steady day — enough is enough.",
  tired: "Rest counts today.",
  sensitive: "Go gently with yourself.",
  stressed: "Small pauses help.",
  overwhelmed: "One next step is enough.",
  irritated: "Space beats escalation.",
  affectionate: "Warmth is welcome.",
  low_energy: "Low output is not low worth.",
  hopeful: "Notice the light — no rush.",
  quiet: "Stillness is care.",
};

export function getPersonalInsight(
  phase: CyclePhase | null,
  moods: MoodId[]
): PersonalInsight {
  const primary = getPrimaryMood(moods);

  if (!phase && moods.length === 0) {
    return {
      title: "For you only",
      message: "Tap a mood for a private reflection.",
    };
  }

  if (primary) {
    return {
      title: "For you only",
      message: MOOD_INSIGHTS[primary] ?? "Your feelings deserve acknowledgment.",
    };
  }

  if (phase) {
    return {
      title: "For you only",
      message: getPhaseMeta(phase).summary.split(".")[0] + ".",
    };
  }

  return {
    title: "For you only",
    message: "Several moods can coexist — all are valid.",
  };
}
