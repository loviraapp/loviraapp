"use client";

type EmotionChipProps = {
  emoji: string;
  label: string;
  active: boolean;
  onClick: () => void;
  size?: "md" | "lg";
};

export function EmotionChip({
  emoji,
  label,
  active,
  onClick,
  size = "md",
}: EmotionChipProps) {
  const pad = size === "lg" ? "py-4" : "py-3";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-200 ${pad} ${
        active
          ? "scale-[1.02] bg-primary-soft shadow-md shadow-primary/20 ring-2 ring-primary/30"
          : "bg-card hover:bg-primary-soft/50 hover:shadow-sm"
      }`}
    >
      <span
        className={size === "lg" ? "text-2xl" : "text-xl"}
        role="img"
        aria-label={label}
      >
        {emoji}
      </span>
      <span
        className={`text-[11px] font-medium ${
          active ? "text-primary" : "text-muted"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
