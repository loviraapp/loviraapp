export function GentleAwarenessCard() {
  return (
    <div className="rounded-xl border border-border/70 bg-card px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Gentle awareness
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">
        Lovira uses soft language —{" "}
        <span className="font-medium text-primary">gentle nudge</span>,{" "}
        <span className="font-medium text-primary">support insight</span>, and{" "}
        <span className="font-medium text-lavender-deep">partner awareness</span>{" "}
        — not loud alerts or pushy notifications.
      </p>
    </div>
  );
}
