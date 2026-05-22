export function GentleAwarenessCard() {
  return (
    <div className="rounded-xl border border-border/70 bg-card/80 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Gentle awareness
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">
        Lovira uses soft language —{" "}
        <span className="font-medium text-accent">gentle nudge</span>,{" "}
        <span className="font-medium text-accent">support insight</span>, and{" "}
        <span className="font-medium text-accent">partner awareness</span> — not
        loud alerts or pushy notifications.
      </p>
    </div>
  );
}
