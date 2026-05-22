"use client";

import type { PartnerPreview } from "@/types/app";

type PartnerModePreviewProps = {
  preview: PartnerPreview;
  isOpen: boolean;
  onToggle: () => void;
};

export function PartnerModePreview({
  preview,
  isOpen,
  onToggle,
}: PartnerModePreviewProps) {
  return (
    <div className="rounded-2xl border border-lavender/25 bg-lavender-soft/30 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender-deep">
            Partner Mode preview
          </p>
          <p className="mt-1 text-sm text-muted">
            Support guidance only — no mood lists, no private notes.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary-soft"
        >
          {isOpen ? "Hide" : "Preview"}
        </button>
      </div>

      {isOpen ? (
        <div className="mt-4 space-y-4">
          <blockquote className="rounded-xl bg-card/95 p-4 text-sm leading-relaxed text-foreground ring-1 ring-border/60">
            {preview.awarenessLine}
          </blockquote>
          <p className="rounded-xl bg-primary-soft/60 px-4 py-3 text-sm leading-relaxed text-foreground/90 ring-1 ring-border/50">
            {preview.coupleLine}
          </p>
          <p className="text-sm leading-relaxed text-muted">{preview.supportGuidance}</p>
          <p className="rounded-full bg-card/90 px-4 py-2 text-xs font-medium text-primary ring-1 ring-border">
            {preview.gentleNudge}
          </p>
          <p className="text-xs text-muted">
            Not shown: individual mood selections, private reflections, or medical
            detail.
          </p>
        </div>
      ) : null}
    </div>
  );
}
