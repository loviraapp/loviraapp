import type {
  GenderId,
  HabitAnswer,
  RelationshipStageId,
  SupportStyleId,
} from "@/types/couple-profile";

export const ONBOARDING_STEPS = [
  "welcome",
  "setup",
  "emotional",
  "connection",
  "support",
  "philosophy",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const SETUP_PROGRESS_STEPS = [
  "setup",
  "emotional",
  "connection",
  "support",
] as const;

export function setupProgressIndex(step: OnboardingStep): number {
  const i = SETUP_PROGRESS_STEPS.indexOf(
    step as (typeof SETUP_PROGRESS_STEPS)[number]
  );
  return i >= 0 ? i + 1 : 0;
}

export const GENDER_OPTIONS: { id: GenderId; label: string }[] = [
  { id: "female", label: "Woman" },
  { id: "male", label: "Man" },
  { id: "nonbinary", label: "Non-binary" },
  { id: "prefer_not", label: "Prefer not to say" },
];

export const RELATIONSHIP_STAGE_OPTIONS: {
  id: RelationshipStageId;
  label: string;
}[] = [
  { id: "dating", label: "Dating" },
  { id: "living_together", label: "Living together" },
  { id: "engaged", label: "Engaged" },
  { id: "married", label: "Married" },
  { id: "long_term", label: "Long-term partners" },
];

export const HABIT_OPTIONS: { id: HabitAnswer; label: string }[] = [
  { id: "yes", label: "Yes, often" },
  { id: "sometimes", label: "Sometimes" },
  { id: "not_really", label: "Not really" },
];

export const SUPPORT_STYLE_OPTIONS: {
  id: SupportStyleId;
  emoji: string;
  label: string;
}[] = [
  { id: "reassurance", emoji: "🫶", label: "Reassurance" },
  { id: "quiet_space", emoji: "🌙", label: "Quiet space" },
  { id: "affection", emoji: "💜", label: "Affection" },
  { id: "conversation", emoji: "💬", label: "Conversation" },
  { id: "gestures", emoji: "✨", label: "Small thoughtful gestures" },
];

export const EMOTIONAL_TOGGLES_FEMALE = [
  {
    key: "trackPhase" as const,
    label: "Emotional phase awareness",
    hint: "Gentle context for sensitive or overwhelming days",
  },
  {
    key: "privateCycle" as const,
    label: "Private rhythm notes",
    hint: "Optional — never medical tracking",
  },
  {
    key: "shareInsights" as const,
    label: "Share emotional insights with your partner",
    hint: "Warm nudges, not clinical data",
  },
];

export const EMOTIONAL_TOGGLE_PARTNER = {
  key: "partnerSupportGuidance" as const,
  label: "Gentle guidance to support your partner emotionally",
  hint: "Small, respectful suggestions — never assumptions",
};
