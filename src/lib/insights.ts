import type { CyclePhase, MoodId, PersonalInsight } from "@/types/app";
import { getPhaseMeta } from "@/lib/cycle";
import { getPrimaryMood } from "@/lib/mood";

const MOOD_INSIGHTS: Partial<Record<MoodId, string>> = {
  calm: "A steady day — honor what feels enough, not what feels expected.",
  tired: "Rest is productive today. Protect energy like you would protect something precious.",
  sensitive: "Feelings may sit closer to the surface. Go gently with yourself and others.",
  stressed: "Pressure is real. Small pauses and breath can loosen the grip.",
  overwhelmed: "Too much at once is valid. One next step is enough.",
  irritated: "Friction happens. Space and softness can prevent escalation.",
  affectionate: "Connection is available — share warmth in ways that feel natural.",
  low_energy: "Low output is not low worth. Keep the bar kind today.",
  hopeful: "Light is present — notice it without forcing the pace.",
  quiet: "Stillness can be healing. Let silence be part of care.",
};

export function getPersonalInsight(
  phase: CyclePhase | null,
  moods: MoodId[]
): PersonalInsight {
  const primary = getPrimaryMood(moods);

  if (!phase && moods.length === 0) {
    return {
      title: "Your personal insight",
      message:
        "Add your rhythm and today’s moods to see a gentle reflection meant only for you — not shared with your partner.",
    };
  }

  const phasePart = phase
    ? `${getPhaseMeta(phase).summary}`
    : "Check in with how you feel before the day runs away.";

  const moodPart = primary
    ? MOOD_INSIGHTS[primary] ?? "Your feelings today deserve acknowledgment."
    : moods.length > 0
      ? "Several feelings can coexist — that’s normal and worth honoring."
      : "Naming even one mood can make the day feel more manageable.";

  const multiPart =
    moods.length > 1
      ? " You selected more than one mood — hold room for all of them."
      : "";

  return {
    title: "Your personal insight",
    message: `${phasePart} ${moodPart}${multiPart}`,
  };
}
