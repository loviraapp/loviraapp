"use client";

import type { ReactNode } from "react";

export type EmotionalCardTone = "ivory" | "lavender" | "plum" | "warm";

type EmotionalCardProps = {
  emoji: string;
  title: string;
  line: string;
  subline?: string;
  tone?: EmotionalCardTone;
  featured?: boolean;
  scene?: ReactNode;
  onClick?: () => void;
  action?: ReactNode;
};

const toneClass: Record<EmotionalCardTone, string> = {
  ivory: "emotional-card--ivory",
  lavender: "emotional-card--lavender",
  plum: "emotional-card--plum",
  warm: "emotional-card--warm",
};

export function EmotionalCard({
  emoji,
  title,
  line,
  subline,
  tone = "ivory",
  featured = false,
  scene,
  onClick,
  action,
}: EmotionalCardProps) {
  const Tag = onClick ? "button" : "article";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`emotional-card ${toneClass[tone]} ${featured ? "emotional-card--featured" : ""} ${onClick ? "emotional-card--interactive" : ""}`}
    >
      {scene ? (
        <div className="emotional-card-scene">
          {scene}
          <span className="emotional-card-badge" aria-hidden>
            {emoji}
          </span>
        </div>
      ) : null}
      <div className="emotional-card-body">
        {!scene ? (
          <span className="emotional-card-emoji-inline" aria-hidden>
            {emoji}
          </span>
        ) : null}
        <h3 className="emotional-card-title">{title}</h3>
        <p className="emotional-card-line">{line}</p>
        {subline ? <p className="emotional-card-subline">{subline}</p> : null}
        {action}
      </div>
    </Tag>
  );
}
