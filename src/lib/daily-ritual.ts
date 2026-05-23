export type DailyRitual = {
  emoji: string;
  title: string;
  line: string;
};

const RITUALS: DailyRitual[] = [
  {
    emoji: "💬",
    title: "Say one thing you appreciated today",
    line: "Keep it simple — one sentence each.",
  },
  {
    emoji: "📵",
    title: "5-minute no-phone check-in",
    line: "Just presence — no fixing.",
  },
  {
    emoji: "🍵",
    title: "Plan a simple tea or walk moment",
    line: "Low effort, high warmth.",
  },
  {
    emoji: "🎲",
    title: "First to soften picks date night",
    line: "Playful — not competitive.",
  },
  {
    emoji: "💌",
    title: "Send one kind message before bed",
    line: "Short, honest, no pressure.",
  },
  {
    emoji: "🤝",
    title: "Share one win from today",
    line: "Celebrate something small together.",
  },
  {
    emoji: "🌙",
    title: "Two minutes of quiet together",
    line: "Sit close — words optional.",
  },
];

export function getDailyRitual(dateKey: string): DailyRitual {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash + dateKey.charCodeAt(i) * (i + 1)) % RITUALS.length;
  }
  return RITUALS[hash] ?? RITUALS[0];
}
