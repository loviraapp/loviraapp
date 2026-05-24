import type {
  ComfortPreferenceId,
  HarderTriggerId,
} from "@/types/support-preferences";

export type LoviraHelpId =
  | "daily_checkins"
  | "relationship_rituals"
  | "gentle_insights"
  | "reconnection";

export type CoupleProfile = {
  yourName: string;
  partnerName: string;
  anniversary?: string;
  comforts: ComfortPreferenceId[];
  triggers: HarderTriggerId[];
  loviraHelp: LoviraHelpId[];
  completedAt: string;
};
