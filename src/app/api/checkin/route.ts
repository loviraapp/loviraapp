import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getAuthUser,
  getCoupleContextForUser,
} from "@/lib/couple-server";
import {
  HER_CHECK_IN_LABELS,
  type HerCheckInOption,
} from "@/lib/her-wellness-storage";

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

type SaveCheckinBody = {
  selection?: HerCheckInOption;
};

export async function GET() {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("checkins")
    .select("selection, checkin_date, created_at")
    .eq("user_id", user.id)
    .eq("checkin_date", todayUtc())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ checkin: data ?? null });
}

export async function POST(request: Request) {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SaveCheckinBody;
  const selection = body.selection;
  if (!selection || !(selection in HER_CHECK_IN_LABELS)) {
    return NextResponse.json({ error: "Invalid selection" }, { status: 400 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple) {
    return NextResponse.json({ error: "No couple space" }, { status: 400 });
  }

  const supabase = await createClient();
  const today = todayUtc();
  const { data, error } = await supabase
    .from("checkins")
    .upsert(
      {
        user_id: user.id,
        couple_id: couple.coupleId,
        checkin_date: today,
        selection,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,checkin_date" }
    )
    .select("selection, checkin_date, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ checkin: data });
}
