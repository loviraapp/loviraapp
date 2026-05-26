export type ReelPlatform = "instagram" | "tiktok" | "youtube" | "unknown";

export type ReelMood =
  | "playful"
  | "nostalgic"
  | "comforting"
  | "romantic"
  | "chaotic"
  | "relatable"
  | "wholesome";

export type ReelMoodMeta = {
  id: ReelMood;
  label: string;
  emoji: string;
  color: string;
};

export const REEL_MOODS: Record<ReelMood, ReelMoodMeta> = {
  playful: { id: "playful", label: "Playful", emoji: "✨", color: "#f0c878" },
  nostalgic: { id: "nostalgic", label: "Nostalgic", emoji: "🌅", color: "#c9a8e8" },
  comforting: { id: "comforting", label: "Comforting", emoji: "🫶", color: "#e8a0b8" },
  romantic: { id: "romantic", label: "Romantic", emoji: "💜", color: "#d4889a" },
  chaotic: { id: "chaotic", label: "Chaotic", emoji: "🌀", color: "#b59edb" },
  relatable: { id: "relatable", label: "Relatable", emoji: "😌", color: "#9a84c4" },
  wholesome: { id: "wholesome", label: "Wholesome", emoji: "🌿", color: "#a8d4b8" },
};

const PROMPTS_BY_MOOD: Record<ReelMood, string[]> = {
  playful: [
    "Does this remind you of us being silly together?",
    "When did we last laugh like this?",
    "What's a tiny adventure we could plan this week?",
  ],
  nostalgic: [
    "What memory comes to mind watching this?",
    "Does this remind you of us?",
    "What's a moment from our story you'd relive?",
  ],
  comforting: [
    "What part of this feels like home to you?",
    "When do you feel most at ease with me?",
    "What's something small we should do together soon?",
  ],
  romantic: [
    "What about this made you think of us?",
    "When did you last feel this close to me?",
    "What's one sweet thing we haven't said lately?",
  ],
  chaotic: [
    "What part feels the most relatable?",
    "How would we handle this moment together?",
    "What made you want to share this with me?",
  ],
  relatable: [
    "What part feels the most relatable?",
    "Does this say something we've felt but not said?",
    "What's the real feeling behind sharing this?",
  ],
  wholesome: [
    "What made you smile about this?",
    "What would a wholesome version of us look like here?",
    "What's something kind we could do for each other today?",
  ],
};

const MOOD_PHRASES: Record<ReelMood, string> = {
  playful: "playful and lighthearted",
  nostalgic: "nostalgic and tender",
  comforting: "comforting and warm",
  romantic: "romantic and intimate",
  chaotic: "chaotic and relatable",
  relatable: "relatable and real",
  wholesome: "wholesome and sweet",
};

export type ReelAnalysis = {
  platform: ReelPlatform;
  primary: ReelMood;
  secondary: ReelMood;
  insightLine: string;
  prompts: string[];
};

export function detectPlatform(url: string): ReelPlatform {
  const lower = url.toLowerCase();
  if (lower.includes("instagram.com") || lower.includes("instagr.am")) {
    return "instagram";
  }
  if (lower.includes("tiktok.com") || lower.includes("vm.tiktok.com")) {
    return "tiktok";
  }
  if (
    lower.includes("youtube.com/shorts") ||
    lower.includes("youtu.be/shorts") ||
    (lower.includes("youtube.com") && lower.includes("short"))
  ) {
    return "youtube";
  }
  return "unknown";
}

export function isValidReelUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    const platform = detectPlatform(url);
    return platform !== "unknown";
  } catch {
    return false;
  }
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const MOOD_ORDER: ReelMood[] = [
  "playful",
  "nostalgic",
  "comforting",
  "romantic",
  "chaotic",
  "relatable",
  "wholesome",
];

/** Simulated emotional read — deterministic from link, no external API */
export function analyzeReelLink(url: string): ReelAnalysis {
  const platform = detectPlatform(url);
  const h = hashString(url.trim().toLowerCase());
  const primary = MOOD_ORDER[h % MOOD_ORDER.length];
  const secondary = MOOD_ORDER[(h + 3) % MOOD_ORDER.length];
  const prompts = pickPrompts(primary, secondary, h);

  const insightLine =
    primary === secondary
      ? `This reel feels ${MOOD_PHRASES[primary]}.`
      : `This reel feels ${MOOD_PHRASES[primary]} and ${MOOD_PHRASES[secondary]}.`;

  return { platform, primary, secondary, insightLine, prompts };
}

function pickPrompts(primary: ReelMood, secondary: ReelMood, seed: number): string[] {
  const pool = [
    ...PROMPTS_BY_MOOD[primary],
    ...PROMPTS_BY_MOOD[secondary].filter((p) => !PROMPTS_BY_MOOD[primary].includes(p)),
  ];
  const picks: string[] = [];
  for (let i = 0; i < pool.length && picks.length < 3; i++) {
    const item = pool[(seed + i * 7) % pool.length];
    if (!picks.includes(item)) picks.push(item);
  }
  while (picks.length < 3) {
    const fallback = PROMPTS_BY_MOOD[primary][picks.length % PROMPTS_BY_MOOD[primary].length];
    if (!picks.includes(fallback)) picks.push(fallback);
  }
  return picks.slice(0, 3);
}

export function platformLabel(platform: ReelPlatform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "tiktok") return "TikTok";
  if (platform === "youtube") return "YouTube Shorts";
  return "Video link";
}
