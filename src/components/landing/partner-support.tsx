import { Section } from "./section";

const examples = [
  {
    phase: "Menstrual",
    context: "Low energy",
    suggestion:
      "Bring warmth and handle one small task without being asked. Quiet presence beats big gestures.",
  },
  {
    phase: "Follicular",
    context: "Hopeful",
    suggestion:
      "Plan something light you both enjoy. Match rising energy without over-scheduling the day.",
  },
  {
    phase: "Luteal",
    context: "Sensitive",
    suggestion:
      "Listen more than you fix. Ask: comfort, space, or help deciding?",
  },
];

export function PartnerSupport() {
  return (
    <Section
      id="partner-support"
      eyebrow="Partner support"
      title="Gentle support insight, not scripts"
      description="Lovira suggests caring actions so any partner — including men supporting their person — can show up with confidence."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {examples.map((item) => (
          <article
            key={item.phase}
            className="flex flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-sm"
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                {item.phase}
              </span>
              <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted ring-1 ring-border">
                {item.context}
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
