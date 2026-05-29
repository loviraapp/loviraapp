import { Suspense } from "react";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata = {
  title: "Sign in",
  description: "Sign in to Lovira and invite your partner.",
};

export default function AuthPage() {
  return (
    <main className="min-h-dvh bg-background">
      <Suspense fallback={<div className="p-16 text-center text-muted">Loading…</div>}>
        <AuthScreen />
      </Suspense>
    </main>
  );
}
