import "server-only";

import type { HerPrivacySetting } from "@/lib/her-wellness-storage";
import { createClient } from "@/lib/supabase/server";

export async function upsertHerWellnessShare(input: {
  coupleId: string;
  herUserId: string;
  privacySetting: HerPrivacySetting;
  phaseLabel: string | null;
  phaseDay: number | null;
  phaseDescription: string | null;
  checkInKey: string | null;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("her_wellness_shares").upsert({
    couple_id: input.coupleId,
    her_user_id: input.herUserId,
    privacy_setting: input.privacySetting,
    phase_label: input.phaseLabel,
    phase_day: input.phaseDay,
    phase_description: input.phaseDescription,
    check_in_key: input.checkInKey,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getHerWellnessShareForCouple(coupleId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("her_wellness_shares")
    .select("*")
    .eq("couple_id", coupleId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
