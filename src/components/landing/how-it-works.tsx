import { Section } from "./section";

const steps = [
  { emoji: "🫶", title: "Feelings", body: "Both partners pick moods." },
  { emoji: "🌿", title: "Needs", body: "Space, rest, affection — what helps today." },
  { emoji: "✨", title: "Tonight's vibe", body: "One shared insight for the evening." },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="Daily ritual"
      title="Three steps. Done."
      description="A calm check-in — not a dashboard."
    >
      <ol className="grid gap-6 sm:grid-cols-3">
        {steps.map((item, i) => (
          <li
            key={item.title}
            className="rounded-2xl bg-card/80 p-6 text-center shadow-sm"
          >
            <span className="text-3xl" aria-hidden>
              {item.emoji}
            </span>
            <p className="mt-3 text-xs text-primary">Step {i + 1}</p>
            <h3 className="mt-1 text-lg font-medium">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
