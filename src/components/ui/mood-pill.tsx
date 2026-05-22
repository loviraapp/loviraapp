"use client";

type MoodPillProps = {
  emoji: string;
  label: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
};

export function MoodPill({ emoji, label, onClick, size = "md" }: MoodPillProps) {
  const sizes = {
    sm: "gap-1.5 px-2.5 py-1.5 text-xs",
    md: "gap-2 px-3 py-2 text-sm",
    lg: "gap-2.5 px-4 py-3 text-base",
  };
  const emojiSizes = { sm: "text-base", md: "text-xl", lg: "text-2xl" };

  const className = `inline-flex items-center rounded-full bg-primary-soft/80 font-medium text-foreground ${sizes[size]} ${
    onClick ? "cursor-pointer transition-transform active:scale-[0.98]" : ""
  }`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        <span className={emojiSizes[size]} aria-hidden>
          {emoji}
        </span>
        {label}
      </button>
    );
  }

  return (
    <span className={className}>
      <span className={emojiSizes[size]} aria-hidden>
        {emoji}
      </span>
      {label}
    </span>
  );
}
