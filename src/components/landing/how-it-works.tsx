import { Section } from "./section";

const steps = [
  {
    step: "01",
    title: "Add rhythm context",
    body: "Either partner can log a cycle start date. Lovira estimates phase — shared awareness, not one-sided tracking.",
  },
  {
    step: "02",
    title: "Check in with moods",
    body: "Select every feeling that fits today. Couples often feel more than one thing — Lovira makes room for that.",
  },
  {
    step: "03",
    title: "See insight & support",
    body: "A private reflection for you, then gentle partner support guidance — never loud alerts, never pressure.",
  },
  {
    step: "04",
    title: "Preview Partner Mode",
    body: "See exactly what a partner would get: support insight and partner awareness — not private moods or notes.",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="A guided flow for both partners"
      description="Four clear steps on the dashboard — so you always know what to do next."
    >
      <ol className="grid gap-6 sm:grid-cols-2">
        {steps.map((item) => (
          <li
            key={item.step}
            className="group relative rounded-3xl border border-border/70 bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="font-display text-4xl font-medium text-accent/30 transition-colors group-hover:text-accent/50">
              {item.step}
            </span>
            <h3 className="mt-4 text-xl font-medium text-foreground">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {item.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
