"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { CoupleContext } from "@/types/together-session";
import type { TogetherSessionRow } from "@/types/together-session";
import type { HerWellnessShare } from "@/types/partner-thinking";
import { SessionHistory } from "./session-history";

type PartnerLiveHomeProps = {
  displayName: string;
  partnerName: string | null;
  couple: CoupleContext;
  myUserId: string;
  sessions: TogetherSessionRow[];
  activeSession: TogetherSessionRow | null;
};

export function PartnerLiveHome({
  displayName,
  partnerName,
  couple,
  myUserId,
  sessions,
  activeSession,
}: PartnerLiveHomeProps) {
  const router = useRouter();
  const [share, setShare] = useState<HerWellnessShare | null>(null);
  const [thinkingSent, setThinkingSent] = useState(false);
  const [sendingThinking, setSendingThinking] = useState(false);
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [thinkingSentLocal, setThinkingSentLocal] = useState(false);

  const herLabel = partnerName ?? "her";
  const todayKey = new Date().toISOString().slice(0, 10);
  const sentKey = `lovira_thinking_sent_${todayKey}`;

  const load = useCallback(async () => {
    const localSent = typeof window !== "undefined" && localStorage.getItem(sentKey) === "true";
    setThinkingSentLocal(localSent);

    const [insightRes, thinkingRes] = await Promise.all([
      fetch("/api/partner/insight"),
      fetch("/api/partner/thinking"),
    ]);
    if (insightRes.ok) {
      const insightData = (await insightRes.json()) as { share: HerWellnessShare | null };
      setShare(insightData.share);
    }
    if (thinkingRes.ok) {
      const thinkingData = (await thinkingRes.json()) as { sent: { id: string } | null };
      const sent = Boolean(thinkingData.sent) || localSent;
      setThinkingSent(sent);
      if (sent && typeof window !== "undefined") {
        localStorage.setItem(sentKey, "true");
        setThinkingSentLocal(true);
      }
    }
    setLoading(false);
  }, [sentKey]);

  useEffect(() => {
    load();
  }, [load]);

  async function sendThinkingSignal() {
    setSendingThinking(true);
    try {
      const res = await fetch("/api/partner/thinking", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setThinkingSent(true);
      if (typeof window !== "undefined") {
        localStorage.setItem(sentKey, "true");
        setThinkingSentLocal(true);
      }
    } catch {
      // keep button available for retry
    } finally {
      setSendingThinking(false);
    }
  }

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
    if (!activeSession) return;
    router.push(`/connection-moment?session=${activeSession.id}`);
  }

  const insightTitle = share?.phase_label
    ? `${share.phase_label}${share.phase_day ? ` · Day ${share.phase_day}` : ""}`
    : "Gentle context for today";

  const insightBody =
    share?.privacy_setting === "manual"
      ? `${herLabel} is keeping details private today. Your presence still matters.`
      : share?.phase_description ??
        `When ${herLabel} shares more, you'll see gentle context here — never raw cycle data.`;

  const insightNote =
    share?.privacy_setting === "phase_and_mood" && share.check_in_key
      ? `Today she needs ${share.check_in_key.toLowerCase()}.`
      : null;

  const phaseId = share?.phase_label?.toLowerCase().includes("luteal")
    ? "luteal"
    : share?.phase_label?.toLowerCase().includes("menstrual")
      ? "menstrual"
      : share?.phase_label?.toLowerCase().includes("follicular")
        ? "follicular"
        : share?.phase_label?.toLowerCase().includes("ovulation")
          ? "ovulation"
          : "luteal";

  const phaseBackground =
    phaseId === "menstrual"
      ? "linear-gradient(135deg, #FDF0F5 0%, #F5D5E8 100%)"
      : phaseId === "follicular"
        ? "linear-gradient(135deg, #EDFAF3 0%, #C8EDD8 100%)"
        : phaseId === "ovulation"
          ? "linear-gradient(135deg, #FFFBEC 0%, #FFE9A0 100%)"
          : "linear-gradient(135deg, #EEEDFE 0%, #D4D0F5 100%)";

  const oneThingToday =
    share?.check_in_key === "To feel heard"
      ? "Ask her how she's really doing — then just listen. No fixing needed."
      : share?.check_in_key === "Quiet and rest"
        ? "Let her have quiet tonight. Check in with a gentle text instead."
        : share?.check_in_key === "Physical closeness"
          ? "A hug or sitting close matters more than any words right now."
          : share?.check_in_key === "Space to process"
            ? "Give her room today. Let her know you're there when she's ready."
            : "Stay close with one gentle check-in today.";

  if (loading) {
    return (
      <div className="her-wellness mx-auto max-w-md px-5 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-lg bg-border/60" />
          <div className="h-32 rounded-3xl bg-[var(--her-accent-soft)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="her-wellness mx-auto max-w-md px-5 pb-28 pt-8">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--her-accent)]">
          Supporting {herLabel}
        </p>
        <h1 className="mt-1 font-display text-2xl text-foreground">
          {displayName}
        </h1>
      </header>

      <section className="her-wellness-card mt-6" style={{ background: phaseBackground }}>
        <p className="mb-2 text-[32px] leading-none">🌸</p>
        <p className="text-xs font-medium uppercase tracking-wider text-[#534AB7]">
          Today&apos;s insight
        </p>
        <h2 className="mt-2 font-display text-lg text-[#3C3489]">
          {insightTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#534AB7]">
          {insightBody}
        </p>
        {insightNote ? (
          <p className="mt-2 text-sm text-muted">{insightNote}</p>
        ) : null}

        <button
          type="button"
          disabled={thinkingSent || thinkingSentLocal || sendingThinking || !couple.isComplete}
          onClick={sendThinkingSignal}
          className={`mt-5 w-full rounded-[12px] border-none py-[14px] text-sm font-medium text-white disabled:cursor-not-allowed ${
            thinkingSent
              ? "bg-[#1D9E75] opacity-100"
              : "bg-[#7F77DD] disabled:opacity-50"
          }`}
        >
          {thinkingSent || thinkingSentLocal
            ? "💜 She knows you're thinking of her"
            : sendingThinking
              ? "Sending…"
              : "Let her know you're thinking of her"}
        </button>
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-[var(--color-background-secondary)] px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          ONE THING TODAY
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{oneThingToday}</p>
      </section>

      {!couple.isComplete ? (
        <p className="mt-6 text-sm text-muted">
          Waiting for {herLabel} to join your couple space.
        </p>
      ) : couple.togetherModeActive && activeSession ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--her-accent)]/25 bg-[var(--her-accent-soft)] p-0">
          <div className="px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-[var(--her-accent)]">
              Session in progress
            </p>
            <button
              type="button"
              onClick={joinActiveSession}
              className="her-wellness-btn-primary mt-3 w-full"
            >
              Join Together Mode
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={starting}
          onClick={startTogetherMode}
          className={`lv-card lv-card--together relative mt-6 w-full overflow-hidden p-0 text-left`}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute right-[-20px] top-[-30px] h-[120px] w-[120px] rounded-full"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[-20px] left-[-10px] h-20 w-20 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
          <div className="px-[1.375rem] pb-[1.25rem] pt-0">
            <p className="mb-2 text-[32px] leading-none">💜</p>
            <p className="lv-card-label">Together Mode</p>
            <p className="lv-card-together font-display">
              Phones down.
              <br />
              Your person is here.
            </p>
            <span className="lv-card-cta">
              {starting ? "Starting…" : "Start Together Mode"}
            </span>
          </div>
        </button>
      )}

      {sessions.length > 0 ? (
        <SessionHistory
          sessions={sessions}
          members={couple.members}
          myUserId={myUserId}
        />
      ) : null}

    </div>
  );
}
