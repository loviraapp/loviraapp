export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal";

/** Primary check-in moods (full set) */
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

/** Partner check-in moods (subset) */
export type PartnerMoodId =
  | "calm"
  | "stressed"
  | "tired"
  | "overwhelmed"
  | "hopeful"
  | "quiet"
  | "irritated"
  | "affectionate";

export type EnergyLevel = "low" | "medium" | "high";

export type SupportIntention =
  | "listening"
  | "tasks"
  | "space"
  | "calm_time"
  | "kind_message";

export type PartnerCheckIn = {
  moods: PartnerMoodId[];
  energy: EnergyLevel | null;
  supportIntention: SupportIntention | null;
};

export type LoviraData = {
  lastPeriodStart: string | null;
  cycleLength: number;
  moodLog: Record<string, MoodId[]>;
  partnerCheckInLog: Record<string, PartnerCheckIn>;
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

export type CoupleInsight = {
  title: string;
  message: string;
};

export type PartnerPreview = {
  awarenessLine: string;
  supportGuidance: string;
  gentleNudge: string;
  coupleLine: string;
};
