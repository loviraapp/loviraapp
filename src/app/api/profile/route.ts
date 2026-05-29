import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/couple-server";
import { createClient } from "@/lib/supabase/server";

type ProfileBody = {
  firstName?: string;
  displayName?: string;
  onboardingComplete?: boolean;
};

export async function PUT(request: Request) {
  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as ProfileBody;
  const firstName = body.firstName?.trim();
  const displayName = body.displayName?.trim();
  const onboardingComplete =
    typeof body.onboardingComplete === "boolean"
      ? body.onboardingComplete
      : undefined;

  if (!firstName && !displayName && onboardingComplete === undefined) {
    return NextResponse.json(
      { error: "Nothing to update" },
      { status: 400 }
    );
  }

  const updates: {
    first_name?: string;
    display_name?: string;
    lovira_onboarding_complete?: boolean;
  } = {};
  if (firstName) updates.first_name = firstName;
  if (displayName) updates.display_name = displayName;
  if (onboardingComplete !== undefined) {
    updates.lovira_onboarding_complete = onboardingComplete;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("first_name, display_name, lovira_onboarding_complete")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    profile: {
      firstName: data.first_name as string | null,
      displayName: data.display_name as string,
      onboardingComplete: data.lovira_onboarding_complete as boolean,
    },
  });
}
