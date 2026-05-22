export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal";

export type MoodId =
  | "calm"
  | "tired"
  | "sensitive"
  | "stressed"
  | "overwhelmed"
  | "irritated"
  | "affectionate"
  | "low_energy"
  | "hopeful"
  | "quiet";

export type LoviraData = {
  lastPeriodStart: string | null;
  cycleLength: number;
  /** Date key → selected moods (v0.3: multiple per day) */
  moodLog: Record<string, MoodId[]>;
  /** Last completed guided-flow step (1–4) */
  flowStep: number;
};

export type CycleInfo = {
  phase: CyclePhase;
  dayInCycle: number;
  cycleLength: number;
  daysUntilNextPeriod: number;
};

export type SupportSuggestion = {
  title: string;
  message: string;
  action: string;
};

export type PersonalInsight = {
  title: string;
  message: string;
};

export type PartnerPreview = {
  awarenessLine: string;
  supportGuidance: string;
  gentleNudge: string;
};
