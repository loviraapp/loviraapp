import { redirect } from "next/navigation";
import { IntroWelcome } from "@/components/intro/intro-welcome";
import { createClient } from "@/lib/supabase/server";
import { getProfileForUser } from "@/lib/couple-server";

export default async function IntroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const profile = await getProfileForUser(user.id);
    redirect(profile?.lovira_onboarding_complete ? "/dashboard" : "/onboarding");
  }
  return <IntroWelcome />;
}
