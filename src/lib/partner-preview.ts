import type { CyclePhase, CoupleInsight, PartnerCheckIn, PartnerPreview } from "@/types/app";
import type { SupportSuggestion } from "@/types/app";
import { getSupportIntentionLabel } from "@/lib/partner-check-in";

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
  suggestion: SupportSuggestion,
  coupleInsight: CoupleInsight,
  partnerCheckIn: PartnerCheckIn
): PartnerPreview {
  const awarenessLine = phase
    ? PHASE_AWARENESS[phase]
    : "Today may be a good day for patience, reassurance, and calm communication.";

  const intention = getSupportIntentionLabel(partnerCheckIn.supportIntention);
  const intentionLine = intention
    ? `Optional support intention: ${intention}.`
    : "";

  const supportGuidance = `${suggestion.title}. ${suggestion.message}${intentionLine ? ` ${intentionLine}` : ""}`;

  return {
    awarenessLine,
    supportGuidance,
    gentleNudge: `Partner awareness — a gentle nudge, not an alert: ${suggestion.action}.`,
    coupleLine: coupleInsight.message,
  };
}
