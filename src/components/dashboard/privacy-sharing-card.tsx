const PILLARS = [
  { title: "You control sharing", body: "On this device until you choose otherwise." },
  { title: "Notes stay private", body: "Personal insight never in Partner Mode." },
  { title: "Gentle guidance only", body: "Support ideas — not sensitive details." },
];

export function PrivacySharingCard() {
  return (
    <div className="space-y-2">
      {PILLARS.map((item) => (
        <div
          key={item.title}
          className="flex gap-3 rounded-xl bg-card px-4 py-2.5 ring-1 ring-border/60"
        >
          <span className="text-primary" aria-hidden>
            ◇
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            <p className="text-xs text-muted">{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
