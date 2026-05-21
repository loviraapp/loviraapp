import { Section } from "./section";

const pillars = [
  {
    title: "On your device",
    body: "v0.1 stores cycle and mood data in your browser — nothing leaves your phone or laptop unless you choose to later.",
  },
  {
    title: "No account required",
    body: "Open the dashboard and start. No email, no passwords, no waiting — just space to breathe and track.",
  },
  {
    title: "You stay in control",
    body: "Future versions will let you choose exactly what a partner sees. Privacy isn't a feature — it's the foundation.",
  },
];

export function Privacy() {
  return (
    <Section
      id="privacy"
      eyebrow="Privacy first"
      title="Intimate data deserves intimate care"
      description="Wellness apps ask for your inner life. Lovira is designed to earn that trust slowly, transparently, and on your terms."
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
