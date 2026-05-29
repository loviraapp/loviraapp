import { NextResponse } from "next/server";
import { getAuthUser, getCoupleContextForUser } from "@/lib/couple-server";
import { createClient } from "@/lib/supabase/server";
import type { ReflectionFeelingId } from "@/lib/connection-moment";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { feelings?: ReflectionFeelingId[] };
  if (!body.feelings?.length) {
    return NextResponse.json({ error: "Feelings required" }, { status: 400 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: session } = await supabase
    .from("together_sessions")
    .select("couple_id, status")
    .eq("id", id)
    .single();

  if (!session || session.couple_id !== couple.coupleId) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { error: reflectError } = await supabase
    .from("session_reflections")
    .upsert(
      {
        session_id: id,
        user_id: user.id,
        feelings: body.feelings,
      },
      { onConflict: "session_id,user_id" }
    );

  if (reflectError) {
    return NextResponse.json({ error: reflectError.message }, { status: 500 });
  }

  const { data: reflections } = await supabase
    .from("session_reflections")
    .select("user_id")
    .eq("session_id", id);

  const memberCount = couple.members.length;
  if ((reflections?.length ?? 0) >= memberCount) {
    await supabase
      .from("together_sessions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        partner_user_id: null,
        partner_joined_at: null,
        presence_started_at: null,
      })
      .eq("id", id);
    await supabase
      .from("couples")
      .update({ together_mode_active: false })
      .eq("id", session.couple_id);
  } else {
    await supabase
      .from("together_sessions")
      .update({ status: "reflection" })
      .eq("id", id);
  }

  const { data: updated } = await supabase
    .from("together_sessions")
    .select(
      `
      *,
      session_reflections ( id, user_id, feelings, created_at )
    `
    )
    .eq("id", id)
    .single();

  return NextResponse.json({ session: updated });
}
