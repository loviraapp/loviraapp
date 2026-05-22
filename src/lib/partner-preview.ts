import type { CyclePhase, PartnerPreview } from "@/types/app";
import { getPhaseMeta } from "@/lib/cycle";
import type { SupportSuggestion } from "@/types/app";

const PHASE_AWARENESS: Record<CyclePhase, string> = {
  menstrual:
    "Today may be a good day for patience, comfort, and calm communication.",
  follicular:
    "Today may be a good day for light connection, encouragement, and shared plans.",
  ovulation:
    "Today may be a good day for openness, warmth, and being present together.",
  luteal:
    "Today may be a good day for patience, reassurance, and calm communication.",
};

export function getPartnerPreview(
  phase: CyclePhase | null,
  suggestion: SupportSuggestion
): PartnerPreview {
  const awarenessLine = phase
    ? PHASE_AWARENESS[phase]
    : "Today may be a good day for patience, reassurance, and calm communication.";

  const phaseLabel = phase ? getPhaseMeta(phase).label : null;

  const supportGuidance = phaseLabel
    ? `Support insight: ${suggestion.title}. ${suggestion.message}`
    : `${suggestion.title}. ${suggestion.message}`;

  return {
    awarenessLine,
    supportGuidance,
    gentleNudge: `Partner awareness — a gentle nudge, not an alert: ${suggestion.action}.`,
  };
}
