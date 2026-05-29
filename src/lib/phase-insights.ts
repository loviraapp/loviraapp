import type { HerCyclePhaseId } from "@/lib/her-cycle-phase";
import { calculateHerCyclePhase } from "@/lib/her-cycle-phase";

export type PhaseInsightPair = {
  partner: string;
  her: string;
};

const INSIGHT_POOLS: Record<HerCyclePhaseId, PhaseInsightPair[]> = {
  menstrual: [
    {
      partner:
        "Her body is doing a lot right now. Low energy is real, not laziness.",
      her: "Your body is doing a lot right now. Low energy is real, not laziness.",
    },
    {
      partner:
        "This is her most inward time. She may need quiet more than conversation.",
      her: "This is your most inward time. You may need quiet more than conversation.",
    },
    {
      partner:
        "Physical comfort matters more than words this week. Small gestures land big.",
      her: "Physical comfort matters more than words right now. Be gentle with yourself.",
    },
    {
      partner:
        "She's likely tired in a way sleep doesn't fully fix. Patience is everything.",
      her: "You're likely tired in a way sleep doesn't fully fix. Patience with yourself is everything.",
    },
    {
      partner:
        "This week she needs softness. Not solutions — just presence.",
      her: "This week you need softness. Not solutions — just presence.",
    },
  ],
  follicular: [
    {
      partner:
        "She's coming back to herself. Energy is returning — she'll feel more like her usual self.",
      her: "You're coming back to yourself. Energy is returning — you're feeling more like your usual self.",
    },
    {
      partner:
        "This is one of her lighter weeks. Good time for plans, conversations, connection.",
      her: "This is one of your lighter weeks. Good time for plans, conversations, connection.",
    },
    {
      partner:
        "She's likely feeling more social and open. Meet her there.",
      her: "You're likely feeling more social and open. Let yourself enjoy it.",
    },
    {
      partner: "Her mood tends to lift around now. Enjoy this week together.",
      her: "Your mood tends to lift around now. Enjoy this week.",
    },
    {
      partner:
        "This is a good week to do something together — she has the energy for it.",
      her: "This is a good week to do something together — you have the energy for it.",
    },
  ],
  ovulation: [
    {
      partner:
        "She's at her most warm and connected right now. She feels close to you.",
      her: "You're at your most warm and connected right now. You feel close.",
    },
    {
      partner:
        "This tends to be her most affectionate phase. Let her lead.",
      her: "This tends to be your most affectionate phase. Let yourself lean in.",
    },
    {
      partner: "Her energy and openness are at their peak this week.",
      her: "Your energy and openness are at their peak this week.",
    },
    {
      partner:
        "She's feeling her most herself right now — present and connected.",
      her: "You're feeling your most yourself right now — present and connected.",
    },
    {
      partner: "This is one of her best weeks. Be present for it.",
      her: "This is one of your best weeks. Be present for it.",
    },
  ],
  luteal: [
    {
      partner:
        "Her emotional world gets more intense this week. That's biology, not a problem.",
      her: "Your emotional world may feel more intense this week. That's biology, not a problem.",
    },
    {
      partner:
        "Small things may feel bigger to her right now. That's real — not an overreaction.",
      her: "Small things may feel bigger right now. That's real.",
    },
    {
      partner:
        "She needs reassurance more than advice this week. Listen first.",
      her: "You may need reassurance more than advice this week. Listen to yourself first.",
    },
    {
      partner:
        "This is her most sensitive phase. Your patience matters more than you know.",
      her: "This is your most sensitive phase. Kindness to yourself matters.",
    },
    {
      partner:
        "She may pull inward this week. Check in gently — don't wait for her to ask.",
      her: "You may pull inward this week. It's okay to ask for gentle check-ins.",
    },
    {
      partner:
        "Presence over problem-solving this week. Just being there is enough.",
      her: "Presence over problem-solving this week. Just being with yourself is enough.",
    },
  ],
  late: [
    {
      partner:
        "Her cycle may be running long or irregular. Check in with her today.",
      her: "Your cycle may be running long or irregular. Check in with yourself today.",
    },
    {
      partner:
        "She knows her body best. Ask how she's feeling rather than assuming.",
      her: "You know your body best. Notice how you're feeling without judging.",
    },
    {
      partner:
        "When the cycle is unpredictable, emotional check-ins matter more.",
      her: "When your rhythm is unpredictable, emotional check-ins with yourself matter more.",
    },
  ],
};

export type DailyPhaseInsight = {
  phaseId: HerCyclePhaseId;
  dayInCycle: number;
  partner: string;
  her: string;
};

function pickInsightForDay(
  phaseId: HerCyclePhaseId,
  dayInCycle: number
): PhaseInsightPair {
  const pool = INSIGHT_POOLS[phaseId];
  const index = dayInCycle % pool.length;
  return pool[index];
}

export function getDailyPhaseInsight(
  lastPeriod: string | null,
  cycleLength: number,
  referenceDate: Date = new Date()
): DailyPhaseInsight | null {
  const phase = calculateHerCyclePhase(
    lastPeriod,
    cycleLength,
    referenceDate
  );
  if (!phase) return null;

  const { partner, her } = pickInsightForDay(phase.id, phase.dayInCycle);
  return {
    phaseId: phase.id,
    dayInCycle: phase.dayInCycle,
    partner,
    her,
  };
}

export function getPartnerInsightForShare(
  lastPeriod: string | null,
  cycleLength: number,
  referenceDate?: Date
): string | null {
  return getDailyPhaseInsight(lastPeriod, cycleLength, referenceDate)?.partner ?? null;
}
