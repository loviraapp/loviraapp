import { Section } from "./section";

const steps = [
  { step: "01", emoji: "👋", title: "Choose your role", body: "Tracking rhythm or showing up in support." },
  { step: "02", emoji: "🌙", title: "Rhythm (optional)", body: "One shared lens — skip anytime." },
  { step: "03", emoji: "🫶", title: "Both check in", body: "Emoji-first moods for each partner." },
  { step: "04", emoji: "💡", title: "Couple insight", body: "One warm line — never a scorecard." },
  { step: "05", emoji: "🤝", title: "Gentle support", body: "Optional ideas, private preview." },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Five quick steps"
      description="Onboarding, then a glanceable dashboard flow."
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((item) => (
          <li
            key={item.step}
            className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>
              {item.emoji}
            </span>
            <p className="mt-3 text-xs font-medium text-primary">{item.step}</p>
            <h3 className="mt-1 text-lg font-medium text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
