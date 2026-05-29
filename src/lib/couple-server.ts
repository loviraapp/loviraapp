import "server-only";

import type { CoupleContext, CoupleMemberRow } from "@/types/together-session";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { generateInviteCode } from "@/lib/invite-code";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getProfileForUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("first_name, display_name, lovira_onboarding_complete")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCoupleContextForUser(
  userId: string
): Promise<CoupleContext | null> {
  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("couple_members")
    .select("couple_id, role, display_name, user_id, joined_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) return null;

  const { data: couple } = await supabase
    .from("couples")
    .select("id, invite_code, status, together_mode_active")
    .eq("id", membership.couple_id)
    .single();

  if (!couple) return null;

  const { data: members } = await supabase
    .from("couple_members")
    .select("couple_id, user_id, role, display_name, joined_at")
    .eq("couple_id", couple.id);

  const memberRows = (members ?? []) as CoupleMemberRow[];
  const isComplete = memberRows.length >= 2;
  const partner = memberRows.find((m) => m.user_id !== userId);

  return {
    coupleId: couple.id,
    inviteCode: couple.invite_code,
    status: couple.status as "pending" | "active",
    togetherModeActive: Boolean(couple.together_mode_active),
    members: memberRows,
    isComplete,
    myRole: membership.role as "owner" | "partner",
    partnerName: partner?.display_name ?? null,
  };
}

export async function createCoupleForUser(
  userId: string,
  displayName: string
): Promise<{ coupleId: string; inviteCode: string }> {
  const admin = createServiceClient();
  let inviteCode = generateInviteCode();
  let attempts = 0;

  while (attempts < 5) {
    const { data: existing } = await admin
      .from("couples")
      .select("id")
      .eq("invite_code", inviteCode)
      .maybeSingle();
    if (!existing) break;
    inviteCode = generateInviteCode();
    attempts++;
  }

  const { data: couple, error: coupleError } = await admin
    .from("couples")
    .insert({ invite_code: inviteCode, status: "pending" })
    .select("id, invite_code")
    .single();

  if (coupleError || !couple) {
    throw new Error(coupleError?.message ?? "Failed to create couple");
  }

  const name = displayName.trim();
  await admin.from("profiles").upsert({
    id: userId,
    display_name: name,
    first_name: name,
  });

  const { error: memberError } = await admin.from("couple_members").insert({
    couple_id: couple.id,
    user_id: userId,
    role: "owner",
    display_name: displayName.trim(),
  });

  if (memberError) {
    throw new Error(memberError.message);
  }

  return { coupleId: couple.id, inviteCode: couple.invite_code };
}

export async function joinCoupleWithCode(
  userId: string,
  inviteCode: string,
  displayName: string
): Promise<{ coupleId: string }> {
  const admin = createServiceClient();
  const code = inviteCode.trim().toUpperCase();

  const { data: existingMember } = await admin
    .from("couple_members")
    .select("couple_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingMember) {
    return { coupleId: existingMember.couple_id };
  }

  const { data: couple } = await admin
    .from("couples")
    .select("id, status")
    .eq("invite_code", code)
    .maybeSingle();

  if (!couple) {
    throw new Error("Invalid invite code");
  }

  const { count } = await admin
    .from("couple_members")
    .select("user_id", { count: "exact", head: true })
    .eq("couple_id", couple.id);

  if ((count ?? 0) >= 2) {
    throw new Error("This couple space is already full");
  }

  const name = displayName.trim();
  await admin.from("profiles").upsert({
    id: userId,
    display_name: name,
    first_name: name,
  });

  const { error: joinError } = await admin.from("couple_members").insert({
    couple_id: couple.id,
    user_id: userId,
    role: "partner",
    display_name: displayName.trim(),
  });

  if (joinError) {
    throw new Error(joinError.message);
  }

  await admin
    .from("couples")
    .update({ status: "active" })
    .eq("id", couple.id);

  return { coupleId: couple.id };
}
