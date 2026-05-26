import type { MoodId, NeedId, PartnerCheckIn } from "@/types/app";
import type { CoupleProfile } from "@/types/couple-profile";
import type { RelationshipVibe } from "@/types/app";
import { getPersonalizedSupport } from "@/lib/personalized-support";
import { getCoupleProfileAsEmotionalProfile } from "@/lib/couple-profile";

export type HomeInsight = {
  line: string;
  note?: string;
};

export type HomeConnection = {
  line: string;
  needsCheckIn: boolean;
};

export function getEmotionalInsight(input: {
  profile: CoupleProfile | null;
  moods: MoodId[];
  needs: NeedId[];
  partnerCheckIn: PartnerCheckIn;
  vibe: RelationshipVibe;
  meDone: boolean;
}): HomeInsight {
  const { profile, moods, needs, partnerCheckIn, vibe, meDone } = input;
  const partnerName = profile?.partnerName ?? "your partner";

  if (profile?.emotionalPrefs?.trackPhase && profile.gender === "female") {
    if (
      moods.some((m) =>
        ["sensitive", "overwhelmed", "tired", "low_energy"].includes(m)
      )
    ) {
      return {
        line: "This may be a more emotionally sensitive phase.",
        note: `${partnerName} may need extra gentleness today.`,
      };
    }
    return {
      line: "Your emotional rhythm can guide how you show up for each other.",
      note: "Lovira focuses on understanding — not medical tracking.",
    };
  }

  if (profile?.emotionalPrefs?.partnerSupportGuidance) {
    return {
      line: `${partnerName} may need gentleness today ❤️`,
      note: "Small reassurance can mean more than big gestures.",
    };
  }

  if (meDone) {
    const insight = getPersonalizedSupport({
      moods,
      needs,
      vibe,
      profile: getCoupleProfileAsEmotionalProfile(),
    });
    if (insight) {
      return { line: insight.line, note: insight.note };
    }
  }

  if (partnerCheckIn.moods.includes("overwhelmed") || partnerCheckIn.moods.includes("stressed")) {
    return {
      line: `${partnerName} may need gentleness today ❤️`,
      note: "A calm evening together may help.",
    };
  }

  if (vibe.title === "Slow and calm" || vibe.title === "Low-energy comfort") {
    return {
      line: "A calm evening together may help today.",
      note: "Softness counts as connection.",
    };
  }

  return {
    line: `${partnerName} is part of your story today.`,
    note: "Understanding grows in small moments.",
  };
}

const CONNECTION_LINES_CHECKED_IN = [
  "Small reassurance may mean a lot today.",
  "A quiet check-in tonight could feel grounding.",
  "Share one real thing about your day — not just logistics.",
  "Try noticing one thing you appreciate about them.",
];

const CONNECTION_LINES_NO_CHECKIN = [
  "Ask how their day really felt.",
  "Try a quiet check-in tonight.",
  "Name one feeling before the evening drifts away.",
];

export function getTodaysConnection(input: {
  meDone: boolean;
  todayKey: string;
}): HomeConnection {
  const { meDone, todayKey } = input;
  const pool = meDone ? CONNECTION_LINES_CHECKED_IN : CONNECTION_LINES_NO_CHECKIN;
  const index =
    todayKey.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % pool.length;
  return {
    line: pool[index],
    needsCheckIn: !meDone,
  };
}
