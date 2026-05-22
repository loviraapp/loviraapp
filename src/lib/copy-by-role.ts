import type { UserRole } from "@/types/role";

type DashboardCopy = {
  tagline: string;
  subtitle: string;
  step1Title: string;
  step1Hint: string;
  step2Title: string;
  step2Hint: string;
  step3Title: string;
  step3Hint: string;
  step4Title: string;
  step4Hint: string;
  step5Title: string;
  step5Hint: string;
  emptyMood: string;
  emptyPartner: string;
  emptyRhythm: string;
};

const COPY: Record<UserRole, DashboardCopy> = {
  tracking: {
    tagline: "Your emotional rhythm",
    subtitle: "Private check-in · both partners welcome",
    step1Title: "Rhythm context",
    step1Hint: "Optional · one lens among many",
    step2Title: "How are you feeling today?",
    step2Hint: "Tap all that fit",
    step3Title: "Partner check-in",
    step3Hint: "Their mood & energy · optional",
    step4Title: "Insights",
    step4Hint: "Yours stays private",
    step5Title: "Gentle support",
    step5Hint: "Optional ideas · never required",
    emptyMood: "Tap a mood to continue",
    emptyPartner: "Add partner check-in when ready",
    emptyRhythm: "Skip or add a date",
  },
  support: {
    tagline: "Show up with care",
    subtitle: "Supportive check-in · no fixing required",
    step1Title: "Rhythm context",
    step1Hint: "Optional awareness only",
    step2Title: "How are you feeling today?",
    step2Hint: "Your state matters too",
    step3Title: "How can you show up supportively today?",
    step3Hint: "Mood · energy · one gentle intention",
    step4Title: "Insights",
    step4Hint: "Warm · never judgmental",
    step5Title: "Support guidance",
    step5Hint: "Preview what they'd see",
    emptyMood: "Your check-in helps too",
    emptyPartner: "Choose mood, energy, or intention",
    emptyRhythm: "Optional — skip anytime",
  },
};

export function getDashboardCopy(role: UserRole): DashboardCopy {
  return COPY[role];
}
