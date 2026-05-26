import type { MoodId, NeedId, RelationshipVibe } from "@/types/app";
import type {
  ComfortPreferenceId,
  EmotionalSupportProfile,
  HarderTriggerId,
  PersonalizedSupportInsight,
} from "@/types/support-preferences";
import { getComfortOption } from "@/lib/support-preferences";

const COMFORT_LINES: Record<ComfortPreferenceId, string> = {
  chocolate_snacks: "A small comfort treat could go a long way.",
  hugs_affection: "Warm closeness may feel better than words tonight.",
  quiet_time: "Quiet together may feel more supportive than talking.",
  tea_coffee: "Tea and quiet may feel comforting tonight.",
  music: "Soft music in the background could ease the evening.",
  walk_together: "A gentle walk together might help you both unwind.",
  comfort_media: "Something cozy on screen could be a soft landing.",
  rest_nap: "Rest without guilt — tonight can be low-effort.",
  listening: "Listening may help more than solving today.",
  humor: "A little lightness might help — only if it feels welcome.",
  chores: "Taking one small thing off your plate could feel like care.",
  fewer_messages: "Less back-and-forth may feel kinder tonight.",
  small_surprises: "A tiny thoughtful gesture could mean a lot.",
};

const MOOD_COMFORTS: Partial<Record<MoodId, ComfortPreferenceId[]>> = {
  tired: ["rest_nap", "tea_coffee", "quiet_time"],
  low_energy: ["rest_nap", "tea_coffee", "chores"],
  stressed: ["listening", "quiet_time", "tea_coffee"],
  overwhelmed: ["listening", "quiet_time", "fewer_messages"],
  sensitive: ["hugs_affection", "quiet_time", "fewer_messages"],
  irritated: ["quiet_time", "fewer_messages", "rest_nap"],
  calm: ["walk_together", "tea_coffee", "quiet_time"],
  affectionate: ["hugs_affection", "small_surprises", "walk_together"],
  hopeful: ["walk_together", "comfort_media", "small_surprises"],
  quiet: ["quiet_time", "tea_coffee", "fewer_messages"],
};

const NEED_COMFORTS: Partial<Record<NeedId, ComfortPreferenceId[]>> = {
  space: ["quiet_time", "fewer_messages"],
  reassurance: ["listening", "hugs_affection"],
  tasks: ["chores"],
  calm_conversation: ["listening", "quiet_time"],
  affection: ["hugs_affection", "small_surprises"],
  rest: ["rest_nap", "tea_coffee"],
  playfulness: ["humor", "comfort_media"],
  appreciation: ["small_surprises", "listening"],
};

const TRIGGER_AVOID: Partial<Record<HarderTriggerId, ComfortPreferenceId[]>> = {
  immediate_fixing: ["listening"],
  too_many_questions: ["quiet_time", "fewer_messages"],
  silence: ["listening", "hugs_affection"],
  constant_texting: ["fewer_messages", "quiet_time"],
  loud_conversations: ["quiet_time", "music"],
  pressure_urgency: ["quiet_time", "rest_nap"],
};

type InsightInput = {
  moods: MoodId[];
  needs: NeedId[];
  vibe: RelationshipVibe;
  profile: EmotionalSupportProfile | null;
  partnerProfile?: EmotionalSupportProfile | null;
};

export function getPersonalizedSupport(
  input: InsightInput
): PersonalizedSupportInsight | null {
  const { moods, needs, vibe, profile } = input;
  if (!profile?.comforts.length) return null;

  const candidates = rankComforts(moods, needs, profile);
  if (candidates.length === 0) return null;

  const chosen = candidates[0];
  const option = getComfortOption(chosen);
  const line = COMFORT_LINES[chosen];

  const avoidNote = getAvoidNote(profile.triggers);

  return {
    emoji: option?.emoji ?? vibe.emoji,
    line,
    note: avoidNote ?? undefined,
    framing: "What may help tonight",
  };
}

export function getPartnerSupportHint(
  input: InsightInput
): PersonalizedSupportInsight | null {
  const { partnerProfile } = input;
  if (!partnerProfile?.comforts.length) return null;

  const candidates = rankComforts([], [], partnerProfile);
  if (candidates.length === 0) return null;

  const chosen = candidates[0];
  const option = getComfortOption(chosen);

  return {
    emoji: option?.emoji ?? "💛",
    line: COMFORT_LINES[chosen],
    framing: "What your partner may appreciate",
  };
}

function rankComforts(
  moods: MoodId[],
  needs: NeedId[],
  profile: EmotionalSupportProfile
): ComfortPreferenceId[] {
  const scores = new Map<ComfortPreferenceId, number>();

  for (const comfort of profile.comforts) {
    scores.set(comfort, (scores.get(comfort) ?? 0) + 1);
  }

  for (const mood of moods) {
    for (const c of MOOD_COMFORTS[mood] ?? []) {
      if (profile.comforts.includes(c)) {
        scores.set(c, (scores.get(c) ?? 0) + 3);
      }
    }
  }

  for (const need of needs) {
    for (const c of NEED_COMFORTS[need] ?? []) {
      if (profile.comforts.includes(c)) {
        scores.set(c, (scores.get(c) ?? 0) + 2);
      }
    }
  }

  for (const trigger of profile.triggers) {
    const avoid = TRIGGER_AVOID[trigger] ?? [];
    for (const c of avoid) {
      if (scores.has(c)) {
        scores.set(c, (scores.get(c) ?? 0) + 1);
      }
    }
    if (trigger === "immediate_fixing" && profile.comforts.includes("listening")) {
      scores.set("listening", (scores.get("listening") ?? 0) + 4);
    }
  }

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}

function getAvoidNote(triggers: HarderTriggerId[]): string | null {
  if (triggers.includes("immediate_fixing")) {
    return "Skip fixing for now.";
  }
  if (triggers.includes("too_many_questions")) {
    return "Keep it gentle — no interrogating.";
  }
  if (triggers.includes("pressure_urgency")) {
    return "No rush tonight.";
  }
  return null;
}
