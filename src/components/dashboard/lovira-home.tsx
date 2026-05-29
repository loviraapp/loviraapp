"use client";

import Link from "next/link";
import type { HomeConnection, HomeInsight } from "@/lib/lovira-home";

type LoviraHomeProps = {
  insight: HomeInsight;
  connection: HomeConnection;
  onConnectionTap: () => void;
};

export function LoviraHome({
  insight,
  connection,
  onConnectionTap,
}: LoviraHomeProps) {
  return (
    <div className="lv-home">
      <article className="lv-card lv-card--insight">
        <p className="lv-card-label">Emotional Insight</p>
        <p className="lv-card-line">{insight.line}</p>
        {insight.note ? <p className="lv-card-note">{insight.note}</p> : null}
      </article>

      <button
        type="button"
        className="lv-card lv-card--connection"
        onClick={onConnectionTap}
      >
        <p className="lv-card-label">Today&apos;s Connection</p>
        <p className="lv-card-line">{connection.line}</p>
        {connection.needsCheckIn ? (
          <p className="lv-card-action">Tap for today&apos;s check-in →</p>
        ) : null}
      </button>

      <Link href="/connection-moment" className="lv-card lv-card--together">
        <p className="lv-card-label">Together Mode</p>
        <p className="lv-card-together font-display">
          Phones down.
          <br />
          Your person is here.
        </p>
        <span className="lv-card-cta">Start Together Mode</span>
      </Link>
    </div>
  );
}
