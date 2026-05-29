import { NextResponse } from "next/server";
import {
  getAuthUser,
  getCoupleContextForUser,
} from "@/lib/couple-server";
import { getHerWellnessShareForCouple } from "@/lib/wellness-share-server";

export async function GET() {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple) {
    return NextResponse.json({ share: null });
  }

  try {
    const share = await getHerWellnessShareForCouple(couple.coupleId);
    return NextResponse.json({ share });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load insight";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
