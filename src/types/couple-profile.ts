import type {
  ComfortPreferenceId,
  HarderTriggerId,
} from "@/types/support-preferences";

export type GenderId = "female" | "male" | "nonbinary" | "prefer_not";

export type RelationshipStageId =
  | "dating"
  | "living_together"
  | "engaged"
  | "married"
  | "long_term";

export type HabitAnswer = "yes" | "sometimes" | "not_really";

export type SupportStyleId =
  | "reassurance"
  | "quiet_space"
  | "affection"
  | "conversation"
  | "gestures";

/** @deprecated legacy onboarding signal */
export type RelationshipFeelingId =
  | "busy_distracted"
  | "nearby_not_present"
  | "tense_days"
  | "doing_ok"
  | "want_closer";

export type LoviraHelpId =
  | "together_mode"
  | "daily_checkins"
  | "connection_prompts"
  | "gentle_insights"
  | "reconnection"
  | "relationship_rituals";

export type EmotionalPrefs = {
  trackPhase?: boolean;
  privateCycle?: boolean;
  shareInsights?: boolean;
  partnerSupportGuidance?: boolean;
};

export type ScreenHabits = {
  phonesTogether?: HabitAnswer;
  feelDisconnected?: HabitAnswer;
  reconnectReminders?: boolean;
};

export type CoupleProfile = {
  yourName: string;
  partnerName: string;
  gender?: GenderId;
  relationshipStage?: RelationshipStageId;
  anniversary?: string;
  emotionalPrefs?: EmotionalPrefs;
  screenHabits?: ScreenHabits;
  supportStyle?: SupportStyleId;
  /** @deprecated */
  relationshipFeeling?: RelationshipFeelingId;
  comforts: ComfortPreferenceId[];
  triggers: HarderTriggerId[];
  loviraHelp: LoviraHelpId[];
  onboardingVersion?: number;
  completedAt: string;
};
