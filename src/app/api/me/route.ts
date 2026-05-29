import { NextResponse } from "next/server";
import {
  getAuthUser,
  getCoupleContextForUser,
  getProfileForUser,
} from "@/lib/couple-server";

export async function GET() {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ user: null, couple: null }, { status: 401 });
  }

  const [couple, profile] = await Promise.all([
    getCoupleContextForUser(user.id),
    getProfileForUser(user.id),
  ]);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: profile?.first_name ?? null,
      displayName: profile?.display_name ?? null,
      onboardingComplete: profile?.lovira_onboarding_complete ?? false,
    },
    couple,
  });
}
