"use client";

import type { EnergyLevel, PartnerCheckIn } from "@/types/app";
import type { UserRole } from "@/types/role";
import { ENERGY_GLANCE } from "@/lib/visual-copy";

type GlanceEnergyCardProps = {
  role: UserRole;
  partnerCheckIn: PartnerCheckIn;
};

function energyBar(level: EnergyLevel | null) {
  const fill =
    level === "high" ? "w-full" : level === "medium" ? "w-2/3" : level === "low" ? "w-1/3" : "w-0";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
      <div
        className={`h-full rounded-full bg-secondary transition-all duration-500 ${fill}`}
      />
    </div>
  );
}

export function GlanceEnergyCard({ role, partnerCheckIn }: GlanceEnergyCardProps) {
  const isSupport = role === "support";
  const energy = partnerCheckIn.energy;
  const glance = energy ? ENERGY_GLANCE[energy] : null;
  const title = isSupport ? "Your energy" : "Partner energy";
  const empty = isSupport
    ? "Add in your check-in"
    : "Shows when they check in (Support role)";

  return (
    <section className="glance-card glance-card--soft">
      <p className="text-xs font-medium uppercase tracking-widest text-muted">
        {title}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {glance?.emoji ?? "🤝"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-medium text-foreground">
            {glance?.label ?? empty}
          </p>
          {energyBar(energy)}
        </div>
      </div>
      {isSupport && partnerCheckIn.supportIntention ? (
        <p className="mt-3 text-xs text-muted">
          Intention · {formatIntention(partnerCheckIn.supportIntention)}
        </p>
      ) : null}
    </section>
  );
}

function formatIntention(
  id: NonNullable<PartnerCheckIn["supportIntention"]>
): string {
  const map = {
    listening: "Listen",
    tasks: "Help",
    space: "Space",
    calm_time: "Calm time",
    kind_message: "Warm message",
  };
  return map[id];
}
