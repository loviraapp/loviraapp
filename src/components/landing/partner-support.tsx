import { Section } from "./section";

const examples = [
  {
    phase: "Menstrual",
    mood: "Tired",
    suggestion:
      "Bring a warm drink and handle one chore without being asked. Quiet presence beats big gestures.",
  },
  {
    phase: "Follicular",
    mood: "Hopeful",
    suggestion:
      "Plan something light you both enjoy — a walk, a favorite meal. Match her rising energy, don't overwhelm it.",
  },
  {
    phase: "Luteal",
    mood: "Sensitive",
    suggestion:
      'Listen more than you fix. Ask: "Do you want comfort, space, or help deciding?"',
  },
];

export function PartnerSupport() {
  return (
    <Section
      id="partner-support"
      eyebrow="Partner support"
      title="Small words. Big difference."
      description="Lovira suggests caring actions — never scripts — so partners can show up with confidence and respect."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {examples.map((item) => (
          <article
            key={item.phase}
            className="flex flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-sm"
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                {item.phase}
              </span>
              <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted ring-1 ring-border">
                Mood: {item.mood}
              </span>
            </div>
            <blockquote className="mt-6 flex-1 font-display text-lg leading-relaxed text-foreground">
              &ldquo;{item.suggestion}&rdquo;
            </blockquote>
          </article>
        ))}
      </div>
    </Section>
  );
}
