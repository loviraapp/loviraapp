export type DailyRitual = {
  emoji: string;
  text: string;
};

const RITUALS: DailyRitual[] = [
  {
    emoji: "💛",
    text: "Say one thing you appreciated today.",
  },
  {
    emoji: "🌙",
    text: "5-minute no-phone check-in.",
  },
  {
    emoji: "✨",
    text: "Send one kind message before sleep.",
  },
  {
    emoji: "🌿",
    text: "Tea or walk together tonight.",
  },
  {
    emoji: "🔥",
    text: "First one to soften chooses date night.",
  },
  {
    emoji: "🤍",
    text: "Share one small win from today.",
  },
  {
    emoji: "🫶",
    text: "Two minutes of quiet together — words optional.",
  },
];

export function getDailyRitual(dateKey: string): DailyRitual {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash + dateKey.charCodeAt(i) * (i + 1)) % RITUALS.length;
  }
  return RITUALS[hash] ?? RITUALS[0];
}
