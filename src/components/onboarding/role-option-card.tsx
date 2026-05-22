"use client";

import type { UserRole } from "@/types/role";

type RoleOptionCardProps = {
  role: UserRole;
  emoji: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
};

export function RoleOptionCard({
  emoji,
  title,
  subtitle,
  selected,
  onSelect,
}: RoleOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full rounded-2xl border p-6 text-left transition-all duration-300 ${
        selected
          ? "scale-[1.01] border-primary bg-primary-soft shadow-md ring-2 ring-primary/25"
          : "border-border bg-card hover:border-primary/35"
      }`}
    >
      <span className="text-3xl" role="img" aria-hidden>
        {emoji}
      </span>
      <p className="mt-4 font-display text-xl text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>
    </button>
  );
}
