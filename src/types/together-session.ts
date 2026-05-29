export type TogetherSessionStatus =
  | "waiting"
  | "activity"
  | "prompt"
  | "presence"
  | "reflection"
  | "completed";

export type TogetherSessionRow = {
  id: string;
  couple_id: string;
  host_user_id: string;
  activity_id: string;
  duration_minutes: number;
  opening_prompt: string;
  status: TogetherSessionStatus;
  partner_user_id: string | null;
  partner_joined_at: string | null;
  presence_started_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export type SessionReflectionRow = {
  id: string;
  session_id: string;
  user_id: string;
  feelings: string[];
  created_at: string;
};

export type CoupleMemberRow = {
  couple_id: string;
  user_id: string;
  role: "owner" | "partner";
  display_name: string;
  joined_at: string;
};

export type CoupleContext = {
  coupleId: string;
  inviteCode: string;
  status: "pending" | "active";
  togetherModeActive: boolean;
  members: CoupleMemberRow[];
  isComplete: boolean;
  myRole: "owner" | "partner" | null;
  partnerName: string | null;
};
