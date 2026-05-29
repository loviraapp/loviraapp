"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CoupleContext } from "@/types/together-session";
import type { TogetherSessionRow } from "@/types/together-session";
import { SessionHistory } from "./session-history";

type MeResponse = {
  user: { id: string; email?: string } | null;
  couple: CoupleContext | null;
};

type SessionsResponse = {
  active: TogetherSessionRow | null;
  sessions: TogetherSessionRow[];
};

export function MvpDashboard() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [sessions, setSessions] = useState<SessionsResponse | null>(null);
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [meRes, sessRes] = await Promise.all([
      fetch("/api/me"),
      fetch("/api/session"),
    ]);
    const meData = await meRes.json();
    const sessData = await sessRes.json();

    if (!meData.user) {
      router.replace("/auth");
      return;
    }
    if (!meData.couple) {
      router.replace("/onboarding");
      return;
    }

    setMe(meData);
    setSessions(sessData);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
    const id = window.setInterval(load, 4000);
    return () => window.clearInterval(id);
  }, [load]);

  async function startTogetherMode() {
    setStarting(true);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/connection-moment?session=${data.session.id}`);
    } catch {
      setStarting(false);
    }
  }

  function joinActiveSession() {
    const active = sessions?.active;
    if (!active) return;
    router.push(`/connection-moment?session=${active.id}`);
  }

  if (loading) {
    return (
      <div className="lv-dashboard mx-auto max-w-md px-5 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded-lg bg-border/60" />
          <div className="h-44 rounded-3xl bg-primary-soft/40" />
        </div>
      </div>
    );
  }

  const couple = me?.couple;
  const active = sessions?.active;
  const myMember = couple?.members.find((m) => m.user_id === me?.user?.id);
  const displayName = myMember?.display_name ?? "You";
  const partnerLabel = couple?.partnerName ?? "your partner";

  return (
    <div className="lv-dashboard mx-auto max-w-md px-5 pb-28 pt-8">
      <header className="lv-dashboard-header">
        <p className="lv-dashboard-eyebrow">Your couple space</p>
        <h1 className="lv-dashboard-title font-display">
          {couple?.isComplete
            ? `${displayName} & ${partnerLabel}`
            : displayName}
        </h1>
        {!couple?.isComplete && (
          <p className="mt-2 text-sm text-muted">
            Invite {partnerLabel} to unlock Together Mode.{" "}
            <Link href="/onboarding" className="text-primary">
              Share invite →
            </Link>
          </p>
        )}
      </header>

      {active && couple?.isComplete ? (
        <div className="mt-6 rounded-2xl border border-primary/25 bg-primary-soft/20 px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-primary">
            Session in progress
          </p>
          <p className="mt-1 text-sm text-foreground">
            {active.host_user_id === me?.user?.id
              ? "Your Together Mode is waiting."
              : `${partnerLabel} started Together Mode.`}
          </p>
          <button
            type="button"
            onClick={joinActiveSession}
            className="mt-3 w-full rounded-full bg-primary py-2.5 text-sm font-medium text-white"
          >
            Join session
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={!couple?.isComplete || starting}
          onClick={() => couple?.isComplete && startTogetherMode()}
          className={`lv-card lv-card--together mt-6 w-full text-left ${!couple?.isComplete ? "opacity-50" : ""}`}
        >
          <p className="lv-card-label">Together Mode</p>
          <p className="lv-card-together font-display">
            Phones down.
            <br />
            Your person is here.
          </p>
          <span className="lv-card-cta">
            {starting ? "Starting…" : "Start Together Mode"}
          </span>
        </button>
      )}

      <p className="mt-6 text-center text-xs text-muted">
        One intentional moment per week — that&apos;s the whole point.
      </p>

      {sessions?.sessions?.length ? (
        <SessionHistory
          sessions={sessions.sessions}
          members={couple?.members ?? []}
          myUserId={me?.user?.id ?? ""}
        />
      ) : null}
    </div>
  );
}
