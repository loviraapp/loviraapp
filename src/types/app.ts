export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal";

export type MoodId =
  | "calm"
  | "emotional"
  | "sensitive"
  | "tired"
  | "hopeful"
  | "stressed";

export type LoviraData = {
  lastPeriodStart: string | null;
  cycleLength: number;
  moodLog: Record<string, MoodId>;
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
