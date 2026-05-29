import { NextResponse } from "next/server";
import {
  createCoupleForUser,
  getAuthUser,
  getCoupleContextForUser,
} from "@/lib/couple-server";

export async function POST(request: Request) {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await getCoupleContextForUser(user.id);
  if (existing) {
    return NextResponse.json({ couple: existing });
  }

  const body = (await request.json()) as { displayName?: string };
  const displayName = body.displayName?.trim() || "You";

  try {
    const { coupleId, inviteCode } = await createCoupleForUser(
      user.id,
      displayName
    );
    const couple = await getCoupleContextForUser(user.id);
    return NextResponse.json({ coupleId, inviteCode, couple });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create couple";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
