import type { CoupleProfile, SupportStyleId } from "@/types/couple-profile";

export type TogetherActivityId =
  | "talk"
  | "memory"
  | "walk"
  | "home_together"
  | "story";

export type TogetherActivity = {
  id: TogetherActivityId;
  label: string;
  shortLabel: string;
  description: string;
  presenceLine: string;
};

export const TOGETHER_ACTIVITIES: TogetherActivity[] = [
  {
    id: "talk",
    label: "Just talk",
    shortLabel: "Talk",
    description: "Phones away. Say what’s real — no fixing required.",
    presenceLine: "Let conversation be enough.",
  },
  {
    id: "memory",
    label: "Share an old memory",
    shortLabel: "A memory",
    description: "Let nostalgia warm you before the evening drifts away.",
    presenceLine: "Let a memory lead you back to each other.",
  },
  {
    id: "walk",
    label: "Take a quiet walk",
    shortLabel: "A walk",
    description: "Movement can make honesty feel easier.",
    presenceLine: "Walk side by side. No rush.",
  },
  {
    id: "home_together",
    label: "Do something simple together",
    shortLabel: "Together at home",
    description: "A chore, tea, or one small task — present while you do it.",
    presenceLine: "One shared thing. Be here while you do it.",
  },
  {
    id: "story",
    label: "Remember a meaningful day",
    shortLabel: "Your story",
    description: "How you met, a first date, or a day you knew this mattered.",
    presenceLine: "Tell the story slowly. Let it matter again.",
  },
];

const OPENING_BY_ACTIVITY: Record<TogetherActivityId, readonly string[]> = {
  talk: [
    "What's one small thing you're grateful for about us right now?",
    "What's been on your heart lately that you haven't said out loud?",
    "What would make the next hour feel warmer together?",
  ],
  memory: [
    "What's a memory of us that still makes you smile?",
    "When did you last feel proud of us — and why?",
    "What's a moment you'd love to relive together?",
  ],
  walk: [
    "On your walk, what's one thing you've been holding back saying?",
    "What felt heavy today — and what would lighten it?",
    "What do you need from me while we're moving together?",
  ],
  home_together: [
    "While you're side by side, what would feel most supportive right now?",
    "What's one small thing we could do tonight that would help us feel closer?",
    "What helps you feel cared for when life is busy?",
  ],
  story: [
    "Tell the story of how you knew this person mattered — what do you remember most?",
    "What's a detail from early on that you never told me?",
    "If you could relive one day together, which would you choose?",
  ],
};

const DEFAULT_BY_SUPPORT: Record<SupportStyleId, TogetherActivityId> = {
  reassurance: "talk",
  quiet_space: "talk",
  affection: "memory",
  conversation: "talk",
  gestures: "home_together",
};

export function getTogetherActivity(id: TogetherActivityId): TogetherActivity {
  return TOGETHER_ACTIVITIES.find((a) => a.id === id) ?? TOGETHER_ACTIVITIES[0];
}

export function suggestDefaultActivity(
  profile: CoupleProfile | null
): TogetherActivityId {
  if (!profile) return "talk";

  if (profile.anniversary) return "story";

  const habits = profile.screenHabits;
  if (
    habits?.phonesTogether === "yes" ||
    habits?.feelDisconnected === "yes"
  ) {
    return habits.phonesTogether === "yes" ? "walk" : "talk";
  }

  if (profile.supportStyle) {
    return DEFAULT_BY_SUPPORT[profile.supportStyle];
  }

  return "talk";
}

export function pickOpeningPromptForActivity(
  activityId: TogetherActivityId,
  seed = Date.now()
): string {
  const pool = OPENING_BY_ACTIVITY[activityId];
  const i = Math.abs(seed) % pool.length;
  return pool[i];
}
