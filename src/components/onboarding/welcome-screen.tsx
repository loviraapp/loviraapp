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
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
        Lovira
      </p>
      <h1 className="mt-3 font-display text-3xl text-foreground">
        Understand each other.
      </h1>
      <p className="mt-2 text-sm text-muted">
        Each partner checks in on their own — pick your role on this device.
      </p>

      <div className="mt-8 space-y-3">
        <RoleOptionCard
          role="tracking"
          emoji="🌿"
          title="Track my rhythm"
          subtitle="Moods · insights · optional context."
          selected={selected === "tracking"}
          onSelect={() => setSelected("tracking")}
        />
        <RoleOptionCard
          role="support"
          emoji="🤝"
          title="Support my partner"
          subtitle="Show up · energy · gentle intentions."
          selected={selected === "support"}
          onSelect={() => setSelected("support")}
        />
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected}
        className="mt-8 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-opacity disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
