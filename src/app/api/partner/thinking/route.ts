import { NextResponse } from "next/server";
import {
  getAuthUser,
  getCoupleContextForUser,
} from "@/lib/couple-server";
import { createClient } from "@/lib/supabase/server";

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple) {
    return NextResponse.json({ signal: null });
  }

  const supabase = await createClient();
  const date = todayUtc();

  const [receivedRes, sentRes] = await Promise.all([
    supabase
      .from("partner_signals")
      .select("id, sender_id, date, created_at")
      .eq("couple_id", couple.coupleId)
      .eq("receiver_id", user.id)
      .eq("signal_type", "thinking_of_you")
      .eq("date", date)
      .maybeSingle(),
    supabase
      .from("partner_signals")
      .select("id, date, created_at")
      .eq("couple_id", couple.coupleId)
      .eq("sender_id", user.id)
      .eq("signal_type", "thinking_of_you")
      .eq("date", date)
      .maybeSingle(),
  ]);

  if (receivedRes.error || sentRes.error) {
    const message = receivedRes.error?.message ?? sentRes.error?.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({
    received: receivedRes.data,
    sent: sentRes.data,
  });
}

export async function POST() {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple?.isComplete) {
    return NextResponse.json(
      { error: "Connect with your partner first" },
      { status: 400 }
    );
  }

  const herMember = couple.members.find((m) => m.user_id !== user.id);
  if (!herMember) {
    return NextResponse.json({ error: "Partner not found" }, { status: 400 });
  }

  const myMember = couple.members.find((m) => m.user_id === user.id);
  const senderName = myMember?.display_name ?? "Your partner";

  const supabase = await createClient();
  const today = todayUtc();
  const { error } = await supabase
    .from("partner_signals")
    .insert(
      {
        couple_id: couple.coupleId,
        sender_id: user.id,
        receiver_id: herMember.user_id,
        signal_type: "thinking_of_you",
        date: today,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: "couple_id,sender_id,receiver_id,signal_type,date",
        ignoreDuplicates: true,
      }
    )
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Signal failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ signal: { sent: true, date: today }, senderName });
}
