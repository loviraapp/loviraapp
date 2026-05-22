const PILLARS = [
  {
    title: "You control what is shared",
    body: "Your check-in stays on this device until you choose otherwise in a future version.",
  },
  {
    title: "Private notes stay private",
    body: "Personal insight is never shown in Partner Mode — only gentle support guidance.",
  },
  {
    title: "Partners see support guidance",
    body: "Partner Mode shows awareness and optional support ideas — not sensitive mood details.",
  },
];

export function PrivacySharingCard() {
  return (
    <div className="space-y-3">
      {PILLARS.map((item) => (
        <div
          key={item.title}
          className="flex gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-border/60"
        >
          <span className="text-primary" aria-hidden>
            ◇
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
