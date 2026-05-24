"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUserRole, getUserRole } from "@/lib/role";
import { hasSupportProfile } from "@/lib/support-profile";
import type { UserRole } from "@/types/role";
import { RoleOptionCard } from "./role-option-card";
import { SupportPreferencesFlow } from "./support-preferences-flow";

type Phase = "role" | "intro" | "preferences";

export function WelcomeScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("role");
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const role = getUserRole();
    if (role) {
      setActiveRole(role);
      setSelected(role);
      if (!hasSupportProfile(role)) {
        setPhase("intro");
      }
    }
  }, []);

  function handleRoleContinue() {
    if (!selected) return;
    setUserRole(selected);
    setActiveRole(selected);
    if (hasSupportProfile(selected)) {
      router.replace("/dashboard");
      return;
    }
    setPhase("intro");
  }

  if (phase === "preferences" && activeRole) {
    return (
      <div className="dashboard-shell mx-auto max-w-md px-4 py-10 sm:py-14">
        <SupportPreferencesFlow role={activeRole} />
      </div>
    );
  }

  if (phase === "intro" && activeRole) {
    return (
      <div className="dashboard-shell mx-auto max-w-md px-4 py-12 sm:py-16">
        <div className="animate-fade-in text-center">
          <p className="text-xs font-medium text-primary">Relationship understanding</p>
          <h1 className="mt-4 font-display text-3xl leading-snug text-foreground">
            How can your partner support you best?
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
            A few gentle preferences — not surveillance, not diagnosis. Just
            what helps you feel seen on harder days.
          </p>
          <div className="mt-10 space-y-3 text-left">
            <div className="rounded-2xl bg-card-elevated/80 px-4 py-3 text-sm text-foreground shadow-sm">
              💛 What comforts you when low
            </div>
            <div className="rounded-2xl bg-card-elevated/80 px-4 py-3 text-sm text-foreground shadow-sm">
              🌙 What to avoid on stressful days
            </div>
            <div className="rounded-2xl bg-card-elevated/80 px-4 py-3 text-sm text-foreground shadow-sm">
              ✨ How you naturally show care
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPhase("preferences")}
            className="mt-10 w-full rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20"
          >
            Set my preferences
          </button>
          <p className="mt-4 text-xs text-muted">
            Takes about a minute · editable anytime in More
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <p className="text-xs font-medium text-primary">Lovira</p>
      <h1 className="mt-3 font-display text-3xl text-foreground">
        Your daily ritual together.
      </h1>
      <p className="mt-2 text-sm text-muted">
        Both partners check in — moods, needs, one shared vibe. Thoughtful,
        never clinical.
      </p>

      <div className="mt-8 space-y-3">
        <RoleOptionCard
          role="tracking"
          emoji="🌿"
          title="Track my rhythm"
          subtitle="Moods · needs · shared insight."
          selected={selected === "tracking"}
          onSelect={() => setSelected("tracking")}
        />
        <RoleOptionCard
          role="support"
          emoji="🤝"
          title="Support my partner"
          subtitle="Show up · same ritual · both seen."
          selected={selected === "support"}
          onSelect={() => setSelected("support")}
        />
      </div>

      <button
        type="button"
        onClick={handleRoleContinue}
        disabled={!selected}
        className="mt-8 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
