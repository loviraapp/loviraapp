import { NextResponse } from "next/server";
import {
  getAuthUser,
  getCoupleContextForUser,
  joinCoupleWithCode,
} from "@/lib/couple-server";

export async function POST(request: Request) {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    inviteCode?: string;
    displayName?: string;
  };

  if (!body.inviteCode?.trim()) {
    return NextResponse.json({ error: "Invite code required" }, { status: 400 });
  }

  const displayName = body.displayName?.trim() || "You";

  try {
    await joinCoupleWithCode(user.id, body.inviteCode, displayName);
    const couple = await getCoupleContextForUser(user.id);
    return NextResponse.json({ couple });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to join";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
