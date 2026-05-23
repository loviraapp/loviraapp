"use client";

export type ActivePerson = "me" | "partner";

type PersonToggleProps = {
  active: ActivePerson;
  onChange: (person: ActivePerson) => void;
  meDone: boolean;
  partnerDone: boolean;
};

export function PersonToggle({
  active,
  onChange,
  meDone,
  partnerDone,
}: PersonToggleProps) {
  return (
    <div className="flex rounded-full bg-card p-1">
      <ToggleButton
        label="My check-in"
        active={active === "me"}
        done={meDone}
        onClick={() => onChange("me")}
      />
      <ToggleButton
        label="Partner check-in"
        active={active === "partner"}
        done={partnerDone}
        onClick={() => onChange("partner")}
      />
    </div>
  );
}

function ToggleButton({
  label,
  active,
  done,
  onClick,
}: {
  label: string;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-3 py-2.5 text-xs font-medium transition-all sm:text-sm ${
        active
          ? "bg-card-elevated text-foreground shadow-sm"
          : "text-muted"
      }`}
    >
      {label}
      {done ? <span className="ml-1 text-primary">✓</span> : null}
    </button>
  );
}
