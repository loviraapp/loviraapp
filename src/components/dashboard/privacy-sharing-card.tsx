const PILLARS = [
  {
    title: "You control what is shared",
    body: "Lovira is built so you decide what leaves your device when sharing arrives in a future version.",
  },
  {
    title: "Private notes stay private",
    body: "Personal reflections and detailed check-ins are for you — not automatically visible to a partner.",
  },
  {
    title: "Partners see support guidance",
    body: "A partner would see gentle support insight — not sensitive details or a full mood breakdown.",
  },
];

export function PrivacySharingCard() {
  return (
    <div className="space-y-3">
      {PILLARS.map((item) => (
        <div
          key={item.title}
          className="flex gap-3 rounded-xl bg-background/80 px-4 py-3 ring-1 ring-border/60"
        >
          <span className="text-accent" aria-hidden>
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
