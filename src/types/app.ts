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

/** @deprecated use MoodId for partner too */
export type PartnerMoodId = MoodId;

export type NeedId =
  | "space"
  | "reassurance"
  | "tasks"
  | "calm_conversation"
  | "affection"
  | "rest"
  | "playfulness"
  | "appreciation";

export type EnergyLevel = "low" | "medium" | "high";

export type SupportIntention =
  | "listening"
  | "tasks"
  | "space"
  | "calm_time"
  | "kind_message";

export type PersonCheckIn = {
  moods: MoodId[];
  needs: NeedId[];
};

export type PartnerCheckIn = PersonCheckIn & {
  energy: EnergyLevel | null;
  supportIntention: SupportIntention | null;
};

export type RelationshipVibe = {
  title: string;
  line: string;
  emoji: string;
};

export type LoviraData = {
  lastPeriodStart: string | null;
  cycleLength: number;
  moodLog: Record<string, MoodId[]>;
  needLog: Record<string, NeedId[]>;
  partnerCheckInLog: Record<string, PartnerCheckIn>;
  partnerNeedLog: Record<string, NeedId[]>;
  flowStep: number;
  ritualStep: number;
  completedDates: string[];
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
