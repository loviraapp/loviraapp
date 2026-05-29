"use client";

import { getTogetherActivity } from "@/lib/together-activities";
import type { CoupleMemberRow, TogetherSessionRow } from "@/types/together-session";
import { REFLECTION_FEELINGS } from "@/lib/connection-moment";

type SessionWithReflections = TogetherSessionRow & {
  session_reflections?: { user_id: string; feelings: string[]; created_at: string }[];
};

type SessionHistoryProps = {
  sessions: SessionWithReflections[];
  members: CoupleMemberRow[];
  myUserId: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function feelingLabels(ids: string[]) {
  return ids
    .map((id) => REFLECTION_FEELINGS.find((f) => f.id === id)?.label)
    .filter(Boolean)
    .join(", ");
}

export function SessionHistory({
  sessions,
  members,
  myUserId,
}: SessionHistoryProps) {
  return (
    <section className="mt-12" aria-labelledby="memory-heading">
      <h2
        id="memory-heading"
        className="text-xs font-medium uppercase tracking-wider text-muted"
      >
        Your memories
      </h2>
      <ul className="mt-4 space-y-3">
        {sessions.map((session) => {
          const activity = getTogetherActivity(
            session.activity_id as "talk"
          );
          const reflections = session.session_reflections ?? [];
          const mine = reflections.find((r) => r.user_id === myUserId);
          const theirs = reflections.find((r) => r.user_id !== myUserId);
          const partnerMember = members.find((m) => m.user_id !== myUserId);

          return (
            <li
              key={session.id}
              className="rounded-2xl border border-border/80 bg-card/50 px-4 py-4"
            >
              <p className="text-xs text-muted">
                {formatDate(session.completed_at ?? session.created_at)} ·{" "}
                {session.duration_minutes} min · {activity.shortLabel}
              </p>
              <p className="mt-2 text-sm text-foreground line-clamp-2">
                {session.opening_prompt}
              </p>
              {(mine || theirs) && (
                <div className="mt-3 space-y-1 text-xs text-muted">
                  {mine ? (
                    <p>You felt: {feelingLabels(mine.feelings)}</p>
                  ) : null}
                  {theirs ? (
                    <p>
                      {partnerMember?.display_name ?? "Partner"} felt:{" "}
                      {feelingLabels(theirs.feelings)}
                    </p>
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
