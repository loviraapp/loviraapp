"use client";

type GentleActionProps = {
  title: string;
  line: string;
};

export function GentleAction({ title, line }: GentleActionProps) {
  return (
    <section className="action-whisper" aria-label="Gentle suggestion">
      <p className="text-[15px] text-muted">A small idea for tonight</p>
      <p className="mt-2 font-display text-xl text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{line}</p>
    </section>
  );
}
