export type PartnerThinkingSignal = {
  id: string;
  couple_id: string;
  from_user_id: string;
  for_user_id: string;
  signal_date: string;
  sender_display_name: string;
  created_at: string;
};

export type HerWellnessShare = {
  couple_id: string;
  her_user_id: string;
  privacy_setting: string;
  phase_label: string | null;
  phase_day: number | null;
  phase_description: string | null;
  check_in_key: string | null;
  updated_at: string;
};
