import { DashboardView } from "@/components/dashboard/dashboard-view";
import { OnboardingGate } from "@/components/dashboard/onboarding-gate";

export default function DashboardPage() {
  return (
    <OnboardingGate>
      <DashboardView />
    </OnboardingGate>
  );
}
