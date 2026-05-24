export type ComfortPreferenceId =
  | "chocolate_snacks"
  | "hugs_affection"
  | "quiet_time"
  | "tea_coffee"
  | "music"
  | "walk_together"
  | "comfort_media"
  | "rest_nap"
  | "listening"
  | "humor"
  | "chores"
  | "fewer_messages"
  | "small_surprises";

export type HarderTriggerId =
  | "too_many_questions"
  | "immediate_fixing"
  | "being_ignored"
  | "loud_conversations"
  | "pressure_urgency"
  | "silence"
  | "constant_texting"
  | "feeling_misunderstood";

export type SupportStyleId =
  | "talking_listening"
  | "physical_affection"
  | "thoughtful_gestures"
  | "acts_of_service"
  | "humor_playfulness"
  | "giving_space"
  | "quiet_time_together";

export type EmotionalSupportProfile = {
  comforts: ComfortPreferenceId[];
  triggers: HarderTriggerId[];
  supportStyles: SupportStyleId[];
  customComfort?: string;
  customTrigger?: string;
  updatedAt: string;
};

export type PersonalizedSupportInsight = {
  emoji: string;
  line: string;
  framing: string;
};
