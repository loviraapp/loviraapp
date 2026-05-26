import type { EmotionalSupportProfile } from "@/types/support-preferences";
import type {
  CoupleProfile,
  EmotionalPrefs,
  GenderId,
  HabitAnswer,
  RelationshipFeelingId,
  RelationshipStageId,
  ScreenHabits,
  SupportStyleId,
} from "@/types/couple-profile";
import { normalizeLoviraHelpIds } from "@/lib/support-preferences";
import { comfortsFromSupportStyle } from "@/lib/support-style-map";

const KEY = "lovira:coupleProfile";

function isGender(v: unknown): v is GenderId {
  return v === "female" || v === "male" || v === "nonbinary" || v === "prefer_not";
}

function isStage(v: unknown): v is RelationshipStageId {
  return (
    v === "dating" ||
    v === "living_together" ||
    v === "engaged" ||
    v === "married" ||
    v === "long_term"
  );
}

function isHabit(v: unknown): v is HabitAnswer {
  return v === "yes" || v === "sometimes" || v === "not_really";
}

function isSupportStyle(v: unknown): v is SupportStyleId {
  return (
    v === "reassurance" ||
    v === "quiet_space" ||
    v === "affection" ||
    v === "conversation" ||
    v === "gestures"
  );
}

function isRelationshipFeeling(v: unknown): v is RelationshipFeelingId {
  return (
    v === "busy_distracted" ||
    v === "nearby_not_present" ||
    v === "tense_days" ||
    v === "doing_ok" ||
    v === "want_closer"
  );
}

function normalizeEmotionalPrefs(raw: unknown): EmotionalPrefs | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  return {
    trackPhase: o.trackPhase === true,
    privateCycle: o.privateCycle === true,
    shareInsights: o.shareInsights === true,
    partnerSupportGuidance: o.partnerSupportGuidance === true,
  };
}

function normalizeScreenHabits(raw: unknown): ScreenHabits | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const habits: ScreenHabits = {};
  if (isHabit(o.phonesTogether)) habits.phonesTogether = o.phonesTogether;
  if (isHabit(o.feelDisconnected)) habits.feelDisconnected = o.feelDisconnected;
  if (typeof o.reconnectReminders === "boolean") {
    habits.reconnectReminders = o.reconnectReminders;
  }
  return Object.keys(habits).length ? habits : undefined;
}

function normalizeCoupleProfile(raw: Partial<CoupleProfile>): CoupleProfile | null {
  if (!raw.yourName || typeof raw.yourName !== "string") return null;

  const supportStyle = isSupportStyle(raw.supportStyle) ? raw.supportStyle : undefined;
  const legacyComforts = Array.isArray(raw.comforts) ? raw.comforts : [];
  const comforts =
    legacyComforts.length > 0
      ? legacyComforts
      : comfortsFromSupportStyle(supportStyle);

  return {
    yourName: raw.yourName,
    partnerName: typeof raw.partnerName === "string" ? raw.partnerName : "",
    gender: isGender(raw.gender) ? raw.gender : undefined,
    relationshipStage: isStage(raw.relationshipStage) ? raw.relationshipStage : undefined,
    anniversary: raw.anniversary,
    emotionalPrefs: normalizeEmotionalPrefs(raw.emotionalPrefs),
    screenHabits: normalizeScreenHabits(raw.screenHabits),
    supportStyle,
    relationshipFeeling: isRelationshipFeeling(raw.relationshipFeeling)
      ? raw.relationshipFeeling
      : undefined,
    comforts,
    triggers: Array.isArray(raw.triggers) ? raw.triggers : [],
    loviraHelp: normalizeLoviraHelpIds(raw.loviraHelp as string[] | undefined),
    onboardingVersion:
      typeof raw.onboardingVersion === "number" ? raw.onboardingVersion : undefined,
    completedAt: raw.completedAt ?? new Date().toISOString(),
  };
}

export function getCoupleProfile(): CoupleProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CoupleProfile>;
    const normalized = normalizeCoupleProfile(parsed);
    if (!normalized?.yourName) return null;
    return normalized;
  } catch {
    return null;
  }
}

export function saveCoupleProfile(
  profile: Omit<CoupleProfile, "completedAt"> & { completedAt?: string }
): void {
  const comforts =
    profile.comforts.length > 0
      ? profile.comforts
      : comfortsFromSupportStyle(profile.supportStyle);

  const next: CoupleProfile = {
    ...profile,
    comforts,
    onboardingVersion: profile.onboardingVersion ?? 2,
    completedAt: profile.completedAt ?? new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function hasCoupleProfile(): boolean {
  const profile = getCoupleProfile();
  if (!profile?.yourName || !profile.partnerName) return false;
  if (profile.onboardingVersion === 2) {
    return Boolean(profile.supportStyle || profile.comforts.length > 0);
  }
  return profile.comforts.length > 0;
}

export function updateCoupleProfile(
  patch: Partial<Omit<CoupleProfile, "completedAt">>
): void {
  const existing = getCoupleProfile();
  if (!existing) return;
  saveCoupleProfile({ ...existing, ...patch });
}

export function getCoupleProfileAsEmotionalProfile(): EmotionalSupportProfile | null {
  const profile = getCoupleProfile();
  if (!profile) return null;
  return {
    comforts: profile.comforts,
    triggers: profile.triggers,
    supportStyles: [],
    updatedAt: profile.completedAt,
  };
}
