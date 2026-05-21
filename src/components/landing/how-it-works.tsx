import { Section } from "./section";

const steps = [
  {
    step: "01",
    title: "Log your rhythm",
    body: "Add your last period start. Lovira estimates where you are in your cycle — no spreadsheets, no stress.",
  },
  {
    step: "02",
    title: "Check in with mood",
    body: "A quick daily pulse — how you feel, in seconds. Patterns emerge over time, quietly on your device.",
  },
  {
    step: "03",
    title: "Share support, not pressure",
    body: "Thoughtful suggestions help your partner show up with empathy — words and actions that match the day you're having.",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Three gentle steps, every day"
      description="Lovira is built for real couples — busy mornings, tender evenings, and everything in between."
    >
      <ol className="grid gap-6 md:grid-cols-3">
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
