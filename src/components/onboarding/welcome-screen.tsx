"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/lib/role";
import type { UserRole } from "@/types/role";
import { RoleOptionCard } from "./role-option-card";

export function WelcomeScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);

  function handleContinue() {
    if (!selected) return;
    setUserRole(selected);
    router.replace("/dashboard");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Welcome to Lovira
      </p>
      <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
        Understand each other better.
      </h1>
      <p className="mt-3 text-sm text-muted">
        Same dashboard for both — choose what fits you today.
      </p>

      <div className="mt-8 space-y-3">
        <RoleOptionCard
          role="tracking"
          emoji="🌿"
          title="I am tracking my emotional rhythm"
          subtitle="Private moods, optional cycle context, gentle insights."
          selected={selected === "tracking"}
          onSelect={() => setSelected("tracking")}
        />
        <RoleOptionCard
          role="support"
          emoji="🤝"
          title="I am here to support my partner"
          subtitle="Partner check-in first — mood, energy, how to show up."
          selected={selected === "support"}
          onSelect={() => setSelected("support")}
        />
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected}
        className="mt-8 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to dashboard
      </button>

      <p className="mt-6 text-center text-xs text-muted">
        Saved on this device only · change anytime in settings later
      </p>
    </div>
  );
}
