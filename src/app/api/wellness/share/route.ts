import { NextResponse } from "next/server";
import {
  HER_CHECK_IN_LABELS,
  type HerCheckInOption,
  type HerPrivacySetting,
} from "@/lib/her-wellness-storage";
import { getAuthUser, getCoupleContextForUser } from "@/lib/couple-server";
import { upsertHerWellnessShare } from "@/lib/wellness-share-server";

type ShareBody = {
  privacySetting?: HerPrivacySetting;
  phaseLabel?: string | null;
  phaseDay?: number | null;
  phaseDescription?: string | null;
  checkInKey?: HerCheckInOption | null;
};

export async function PUT(request: Request) {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const couple = await getCoupleContextForUser(user.id);
  if (!couple) {
    return NextResponse.json({ error: "No couple space" }, { status: 400 });
  }

  const body = (await request.json()) as ShareBody;
  const privacy = body.privacySetting ?? "phase_and_mood";

  let checkInKey: string | null = null;
  if (privacy === "phase_and_mood" && body.checkInKey) {
    checkInKey = HER_CHECK_IN_LABELS[body.checkInKey] ?? null;
  }

  const phaseLabel =
    privacy === "manual" ? null : (body.phaseLabel ?? null);
  const phaseDay = privacy === "manual" ? null : (body.phaseDay ?? null);
  const phaseDescription =
    privacy === "manual" ? null : (body.phaseDescription ?? null);

  try {
    await upsertHerWellnessShare({
      coupleId: couple.coupleId,
      herUserId: user.id,
      privacySetting: privacy,
      phaseLabel,
      phaseDay,
      phaseDescription,
      checkInKey,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to share";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
