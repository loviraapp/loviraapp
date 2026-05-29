import { DashboardView } from "@/components/dashboard/dashboard-view";
import { AuthGate } from "@/components/dashboard/auth-gate";

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardView />
    </AuthGate>
  );
}
