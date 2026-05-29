import { NextResponse } from "next/server";
import { getAuthUser, getCoupleContextForUser } from "@/lib/couple-server";
import { createClient } from "@/lib/supabase/server";
import type { TogetherSessionStatus } from "@/types/together-session";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: session, error } = await supabase
    .from("together_sessions")
    .select(
      `
      *,
      session_reflections ( id, user_id, feelings, created_at )
    `
    )
    .eq("id", id)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple || session.couple_id !== couple.coupleId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ session });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    status?: TogetherSessionStatus;
    activityId?: string;
    durationMinutes?: number;
    openingPrompt?: string;
    presenceStarted?: boolean;
    complete?: boolean;
  };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("together_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple || existing.couple_id !== couple.coupleId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates: Record<string, unknown> = {};
  if (body.status) updates.status = body.status;
  if (body.activityId) updates.activity_id = body.activityId;
  if (body.durationMinutes) updates.duration_minutes = body.durationMinutes;
  if (body.openingPrompt) updates.opening_prompt = body.openingPrompt;
  if (body.presenceStarted) {
    updates.presence_started_at = new Date().toISOString();
    updates.status = "presence";
  }
  if (body.complete) {
    updates.status = "completed";
    updates.completed_at = new Date().toISOString();
    updates.partner_user_id = null;
    updates.partner_joined_at = null;
    updates.presence_started_at = null;
  }

  const { data: session, error } = await supabase
    .from("together_sessions")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.complete) {
    await supabase
      .from("couples")
      .update({ together_mode_active: false })
      .eq("id", existing.couple_id);
  }

  return NextResponse.json({ session });
}
