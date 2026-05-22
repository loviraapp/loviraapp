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
  const pad = size === "lg" ? "py-5" : "py-4";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border transition-all duration-300 ease-out ${pad} ${
        active
          ? "scale-[1.02] border-primary bg-primary-soft shadow-md shadow-primary/15 ring-2 ring-primary/20"
          : "border-border bg-card hover:border-primary/35 hover:shadow-sm"
      }`}
    >
      <span
        className={size === "lg" ? "text-3xl" : "text-2xl"}
        role="img"
        aria-label={label}
      >
        {emoji}
      </span>
      <span
        className={`text-xs font-medium sm:text-sm ${
          active ? "text-primary" : "text-foreground"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
