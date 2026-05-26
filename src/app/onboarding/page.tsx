import { RelationshipFlow } from "@/components/onboarding/relationship-flow";

export const metadata = {
  title: "Set up your relationship flow",
  description:
    "A gentle onboarding to understand how you connect and build your Lovira ritual together.",
};

export default function OnboardingPage() {
  return (
    <main className="min-h-dvh bg-background">
      <RelationshipFlow />
    </main>
  );
}
