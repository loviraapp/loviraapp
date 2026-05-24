import type {
  ComfortPreferenceId,
  HarderTriggerId,
  SupportStyleId,
} from "@/types/support-preferences";

export type PreferenceOption<T extends string> = {
  id: T;
  emoji: string;
  label: string;
};

export const ONBOARDING_COMFORT_OPTIONS: PreferenceOption<ComfortPreferenceId>[] = [
  { id: "chocolate_snacks", emoji: "🍫", label: "Comfort snacks" },
  { id: "hugs_affection", emoji: "🫂", label: "Hugs" },
  { id: "tea_coffee", emoji: "☕", label: "Tea/coffee" },
  { id: "quiet_time", emoji: "🌙", label: "Quiet time" },
  { id: "walk_together", emoji: "🚶", label: "Walks" },
  { id: "music", emoji: "🎧", label: "Music" },
  { id: "humor", emoji: "😂", label: "Humor" },
  { id: "chores", emoji: "🧹", label: "Help with chores" },
  { id: "comfort_media", emoji: "📺", label: "Comfort movies" },
  { id: "listening", emoji: "💬", label: "Listening without fixing" },
];

export const LOVIRA_HELP_OPTIONS = [
  { id: "daily_checkins" as const, emoji: "✨", label: "Daily emotional check-ins" },
  { id: "relationship_rituals" as const, emoji: "🌙", label: "Relationship rituals" },
  { id: "gentle_insights" as const, emoji: "💛", label: "Gentle support insights" },
  { id: "reconnection" as const, emoji: "🔥", label: "Reconnection after tense days" },
];

export const COMFORT_OPTIONS: PreferenceOption<ComfortPreferenceId>[] = [
  { id: "chocolate_snacks", emoji: "🍫", label: "Chocolate/snacks" },
  { id: "hugs_affection", emoji: "🫂", label: "Hugs/affection" },
  { id: "quiet_time", emoji: "🌙", label: "Quiet time" },
  { id: "tea_coffee", emoji: "☕", label: "Tea/coffee" },
  { id: "music", emoji: "🎧", label: "Music" },
  { id: "walk_together", emoji: "🚶", label: "Walk together" },
  { id: "comfort_media", emoji: "📺", label: "Comfort movie/show" },
  { id: "rest_nap", emoji: "🛏️", label: "Rest/nap" },
  { id: "listening", emoji: "💬", label: "Listening without fixing" },
  { id: "humor", emoji: "😂", label: "Humor/playfulness" },
  { id: "chores", emoji: "🧹", label: "Help with chores" },
  { id: "fewer_messages", emoji: "📱", label: "Fewer messages" },
  { id: "small_surprises", emoji: "💐", label: "Small surprises" },
];

export const TRIGGER_OPTIONS: PreferenceOption<HarderTriggerId>[] = [
  { id: "too_many_questions", emoji: "⚡", label: "Too many questions" },
  { id: "immediate_fixing", emoji: "🛠️", label: "Immediate problem-solving" },
  { id: "being_ignored", emoji: "📵", label: "Being ignored" },
  { id: "loud_conversations", emoji: "🔊", label: "Loud conversations" },
  { id: "pressure_urgency", emoji: "⏳", label: "Pressure/urgency" },
  { id: "silence", emoji: "❄️", label: "Silence" },
  { id: "constant_texting", emoji: "📱", label: "Constant texting" },
  { id: "feeling_misunderstood", emoji: "😔", label: "Feeling misunderstood" },
];

export const SUPPORT_STYLE_OPTIONS: PreferenceOption<SupportStyleId>[] = [
  { id: "talking_listening", emoji: "💬", label: "Talking/listening" },
  { id: "physical_affection", emoji: "🫂", label: "Physical affection" },
  { id: "thoughtful_gestures", emoji: "🎁", label: "Thoughtful gestures" },
  { id: "acts_of_service", emoji: "🧹", label: "Acts of service" },
  { id: "humor_playfulness", emoji: "😂", label: "Humor/playfulness" },
  { id: "giving_space", emoji: "🌙", label: "Giving space" },
  { id: "quiet_time_together", emoji: "☕", label: "Quiet time together" },
];

export function getComfortOption(id: ComfortPreferenceId) {
  return COMFORT_OPTIONS.find((o) => o.id === id);
}

export function getTriggerOption(id: HarderTriggerId) {
  return TRIGGER_OPTIONS.find((o) => o.id === id);
}

export function getSupportStyleOption(id: SupportStyleId) {
  return SUPPORT_STYLE_OPTIONS.find((o) => o.id === id);
}
