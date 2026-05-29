import { NextResponse } from "next/server";
import { getAuthUser, getCoupleContextForUser } from "@/lib/couple-server";
import { createClient } from "@/lib/supabase/server";
import { pickOpeningPromptForActivity } from "@/lib/together-activities";
import type { TogetherActivityId } from "@/lib/together-activities";
import type { TogetherDuration } from "@/lib/connection-moment";

export async function POST(request: Request) {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple?.isComplete) {
    return NextResponse.json(
      { error: "Invite your partner before starting Together Mode" },
      { status: 403 }
    );
  }

  const body = (await request.json()) as {
    activityId?: TogetherActivityId;
    durationMinutes?: TogetherDuration;
  };

  const activityId = body.activityId ?? "talk";
  const durationMinutes = body.durationMinutes ?? 15;
  const openingPrompt = pickOpeningPromptForActivity(activityId);

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("together_sessions")
    .select("*")
    .eq("couple_id", couple.coupleId)
    .in("status", ["waiting", "activity", "prompt", "presence"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("couples")
      .update({ together_mode_active: true })
      .eq("id", couple.coupleId);
    return NextResponse.json({ session: existing });
  }

  const { data: session, error } = await supabase
    .from("together_sessions")
    .insert({
      couple_id: couple.coupleId,
      host_user_id: user.id,
      activity_id: activityId,
      duration_minutes: durationMinutes,
      opening_prompt: openingPrompt,
      status: "waiting",
    })
    .select("*")
    .single();

  if (error || !session) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create session" },
      { status: 500 }
    );
  }

  await supabase
    .from("couples")
    .update({ together_mode_active: true })
    .eq("id", couple.coupleId);

  return NextResponse.json({ session });
}

export async function GET() {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple) {
    return NextResponse.json({ sessions: [], active: null });
  }

  const supabase = await createClient();

  const { data: active } = await supabase
    .from("together_sessions")
    .select("*")
    .eq("couple_id", couple.coupleId)
    .in("status", ["waiting", "activity", "prompt", "presence"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: sessions } = await supabase
    .from("together_sessions")
    .select(
      `
      *,
      session_reflections ( id, user_id, feelings, created_at )
    `
    )
    .eq("couple_id", couple.coupleId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(12);

  return NextResponse.json({
    active: active ?? null,
    sessions: sessions ?? [],
  });
}
