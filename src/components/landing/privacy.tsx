import { Section } from "./section";

const pillars = [
  {
    title: "You control what is shared",
    body: "v0.3 keeps data on your device. When sharing arrives later, you decide what a partner sees.",
  },
  {
    title: "Private notes stay private",
    body: "Personal insight is for you. Partners see support guidance — not a full mood breakdown.",
  },
  {
    title: "Gentle awareness only",
    body: "No aggressive alerts — only soft partner awareness and support insight language.",
  },
];

export function Privacy() {
  return (
    <Section
      id="privacy"
      eyebrow="Privacy first"
      title="Intimate data deserves intimate care"
      description="Lovira earns trust with transparency: partner sees support guidance, not sensitive details."
      variant="gradient"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {pillars.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-white/60 bg-card/90 p-8 shadow-sm backdrop-blur-sm"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <span className="text-lg" aria-hidden>
                ◇
              </span>
            </div>
            <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
