"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isOnboardingComplete } from "@/lib/role";

type OnboardingGateProps = {
  children: React.ReactNode;
};

export function OnboardingGate({ children }: OnboardingGateProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isOnboardingComplete()) {
      router.replace("/onboarding");
    }
  }, [router]);

  if (!isOnboardingComplete()) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse px-4 py-10">
        <div className="h-8 w-48 rounded-lg bg-border" />
      </div>
    );
  }

  return <>{children}</>;
}
