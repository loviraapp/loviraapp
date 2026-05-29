import { NextResponse } from "next/server";
import { getAuthUser, getCoupleContextForUser } from "@/lib/couple-server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple?.isComplete) {
    return NextResponse.json({ error: "Couple not complete" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: session } = await supabase
    .from("together_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (!session || session.couple_id !== couple.coupleId) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.host_user_id === user.id) {
    return NextResponse.json({ session });
  }

  const { data: updated, error } = await supabase
    .from("together_sessions")
    .update({
      partner_user_id: user.id,
      partner_joined_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: updated });
}
