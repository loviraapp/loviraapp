import { MvpOnboardingFlow } from "@/components/onboarding/mvp-onboarding-flow";

export const metadata = {
  title: "Set up your couple space",
  description: "Invite your partner and start your weekly Together Mode ritual.",
};

export default function OnboardingPage() {
  return (
    <main className="min-h-dvh bg-background">
      <MvpOnboardingFlow />
    </main>
  );
}
