import { Section } from "./section";

const phases = [
  {
    name: "Menstrual",
    days: "Days 1–5",
    tone: "Rest & restore",
    color: "from-[#f0e8e2] to-[#f5f2ec]",
  },
  {
    name: "Follicular",
    days: "Days 6–13",
    tone: "Rising clarity",
    color: "from-[#e5ede7] to-[#f5f2ec]",
  },
  {
    name: "Ovulation",
    days: "Days 14–16",
    tone: "Peak connection",
    color: "from-[#ede8df] to-[#f5f2ec]",
  },
  {
    name: "Luteal",
    days: "Days 17–28",
    tone: "Gentle patience",
    color: "from-[#eeebf4] to-[#f5f2ec]",
  },
];

export function CycleAwareness() {
  return (
    <Section
      id="cycle-awareness"
      eyebrow="Rhythm awareness"
      title="A shared language for energy and care"
      description="Understanding phase — not predicting perfection — helps both partners respond with empathy, whether you track or support."
      variant="muted"
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <p className="text-base leading-relaxed text-muted">
            Rhythm shifts influence mood, sleep, and capacity. When couples see
            phase context — not just a bad day — patience and reassurance come
            easier for everyone.
          </p>
          <ul className="space-y-3 text-sm text-foreground">
            <li className="flex gap-3 rounded-2xl bg-card/80 px-4 py-3 ring-1 ring-border/60">
              <span className="text-primary" aria-hidden>
                ✓
              </span>
              Phase calculated from your last period start
            </li>
            <li className="flex gap-3 rounded-2xl bg-card/80 px-4 py-3 ring-1 ring-border/60">
              <span className="text-primary" aria-hidden>
                ✓
              </span>
              Plain-language context — no medical jargon
            </li>
            <li className="flex gap-3 rounded-2xl bg-card/80 px-4 py-3 ring-1 ring-border/60">
              <span className="text-primary" aria-hidden>
                ✓
              </span>
              Designed for understanding, not diagnosis
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {phases.map((phase) => (
            <div
              key={phase.name}
              className={`rounded-2xl bg-gradient-to-br ${phase.color} p-5 ring-1 ring-border/50 sm:p-6`}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {phase.days}
              </p>
              <p className="mt-2 font-display text-xl text-foreground">
                {phase.name}
              </p>
              <p className="mt-1 text-sm text-muted">{phase.tone}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
