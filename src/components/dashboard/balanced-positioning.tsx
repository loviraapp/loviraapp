const BULLETS = [
  { icon: "🤝", text: "Both partners check in" },
  { icon: "🌿", text: "Rhythm is one lens" },
  { icon: "🔒", text: "Private on this device" },
];

export function BalancedPositioning() {
  return (
    <ul className="flex flex-wrap gap-2">
      {BULLETS.map(({ icon, text }) => (
        <li
          key={text}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground/90"
        >
          <span aria-hidden>{icon}</span>
          {text}
        </li>
      ))}
    </ul>
  );
}
