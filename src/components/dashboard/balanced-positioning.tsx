export function BalancedPositioning() {
  const lines = [
    "Lovira is for both partners.",
    "Cycle awareness is one context, not the whole relationship.",
    "Both people can check in. Both people deserve support.",
  ];

  return (
    <ul className="space-y-2 rounded-2xl border border-border bg-primary-soft/50 px-4 py-3">
      {lines.map((line) => (
        <li key={line} className="flex gap-2 text-sm text-foreground/90">
          <span className="text-primary" aria-hidden>
            ·
          </span>
          {line}
        </li>
      ))}
    </ul>
  );
}
