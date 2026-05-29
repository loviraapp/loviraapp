"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IconCheck, IconEye, IconHeart } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import type { CoupleContext } from "@/types/together-session";
import type { TogetherSessionRow } from "@/types/together-session";
import {
  HER_CHECK_IN_LABELS,
  type HerCheckInOption,
  getHerCheckInForDate,
  getHerCycleLength,
  getHerLastPeriod,
  getTodayKey,
  setHerCheckInForDate,
} from "@/lib/her-wellness-storage";
import { calculateHerCyclePhase } from "@/lib/her-cycle-phase";
import { getDailyPhaseInsight } from "@/lib/phase-insights";
import { syncHerWellnessShareToServer } from "@/lib/sync-her-wellness-share";
import { SessionHistory } from "./session-history";

type HerLiveHomeProps = {
  displayName: string;
  partnerName: string | null;
  couple: CoupleContext;
  myUserId: string;
  sessions: TogetherSessionRow[];
  activeSession: TogetherSessionRow | null;
};

type ConnectionState = "waiting" | "thinking";

const CHECK_IN_OPTIONS: HerCheckInOption[] = [
  "quiet_rest",
  "feel_heard",
  "physical_closeness",
  "space_process",
];
const STATUS_ICON_SIZE = 14;
const STATUS_ICON_STROKE = 2;
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function getPhaseTheme(phaseId: string | undefined): {
  background: string;
  emoji: string;
  opacity: number;
} {
  switch (phaseId) {
    case "menstrual":
      return {
        background: "linear-gradient(135deg, #FDF0F5 0%, #F5D5E8 100%)",
        emoji: "🌙",
        opacity: 0.35,
      };
    case "follicular":
      return {
        background: "linear-gradient(135deg, #EDFAF3 0%, #C8EDD8 100%)",
        emoji: "🌿",
        opacity: 0.4,
      };
    case "ovulation":
      return {
        background: "linear-gradient(135deg, #FFFBEC 0%, #FFE9A0 100%)",
        emoji: "✨",
        opacity: 0.4,
      };
    default:
      return {
        background: "linear-gradient(135deg, #EEEDFE 0%, #D4D0F5 100%)",
        emoji: "🌸",
        opacity: 0.4,
      };
  }
}

function getCheckInTheme(option: HerCheckInOption): {
  background: string;
  emoji: string;
} {
  switch (option) {
    case "quiet_rest":
      return { background: "#F0EEF8", emoji: "🌙" };
    case "feel_heard":
      return { background: "#FFF0F5", emoji: "🫂" };
    case "physical_closeness":
      return { background: "#F0F4FF", emoji: "🤍" };
    case "space_process":
      return { background: "#F0F8F0", emoji: "🌿" };
  }
}

export function HerLiveHome({
  displayName,
  partnerName,
  couple,
  myUserId,
  sessions,
  activeSession,
}: HerLiveHomeProps) {
  const router = useRouter();
  const todayKey = getTodayKey();
  const [draftCheckIn, setDraftCheckIn] = useState<HerCheckInOption | null>(null);
  const [savedCheckIn, setSavedCheckIn] = useState<HerCheckInOption | null>(null);
  const [savingCheckIn, setSavingCheckIn] = useState(false);
  const [starting, setStarting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>("waiting");

  useEffect(() => {
    const local = getHerCheckInForDate(todayKey);
    setSavedCheckIn(local);
    setDraftCheckIn(local);

    void fetch("/api/checkin")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const selection = data?.checkin?.selection as HerCheckInOption | undefined;
        if (!selection) return;
        setHerCheckInForDate(todayKey, selection);
        setSavedCheckIn(selection);
        setDraftCheckIn(selection);
      })
      .catch(() => {
        // keep local backup state
      });

    setHydrated(true);
    void syncHerWellnessShareToServer();
  }, [todayKey]);

  useEffect(() => {
    if (!couple.isComplete || !myUserId) {
      setConnectionState("waiting");
      return;
    }
    let cancelled = false;

    async function loadThinkingState() {
      const res = await fetch("/api/partner/thinking");
      if (!res.ok || cancelled) return;
      const data = (await res.json()) as {
        received: { id: string } | null;
      };
      if (!cancelled) {
        setConnectionState(data.received ? "thinking" : "waiting");
      }
    }

    void loadThinkingState();

    const supabase = createClient();
    const channel = supabase
      .channel(`her-thinking-${couple.coupleId}-${todayKey}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "partner_signals",
          filter: `receiver_id=eq.${myUserId}`,
        },
        (payload) => {
          const row = payload.new as {
            receiver_id: string;
            signal_type: string;
            date: string;
          };
          if (
            row.receiver_id !== myUserId ||
            row.signal_type !== "thinking_of_you" ||
            row.date !== todayIso()
          ) {
            return;
          }
          setConnectionState("thinking");
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [couple.coupleId, couple.isComplete, myUserId, todayKey]);

  const phase = useMemo(
    () =>
      calculateHerCyclePhase(
        getHerLastPeriod(),
        getHerCycleLength()
      ),
    [todayKey]
  );

  const dailyInsight = useMemo(
    () =>
      getDailyPhaseInsight(getHerLastPeriod(), getHerCycleLength()),
    [todayKey]
  );
  const phaseTheme = getPhaseTheme(phase?.id);

  const selectCheckIn = useCallback((option: HerCheckInOption) => {
    setDraftCheckIn(option);
  }, []);

  const saveCheckIn = useCallback(async () => {
    if (!draftCheckIn) return;
    setSavingCheckIn(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selection: draftCheckIn }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save check-in");

      setHerCheckInForDate(todayKey, draftCheckIn);
      setSavedCheckIn(draftCheckIn);
      void syncHerWellnessShareToServer();
    } catch {
      // keep draft selected for retry
    } finally {
      setSavingCheckIn(false);
    }
  }, [draftCheckIn, todayKey]);

  function resetCheckInSelection() {
    setDraftCheckIn(savedCheckIn);
    setSavedCheckIn(null);
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

  if (!hydrated) {
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
          Good to see you
        </p>
        <h1 className="mt-1 font-display text-2xl text-foreground">
          {displayName}
        </h1>
      </header>

      <section
        className="relative mt-6 overflow-hidden rounded-3xl border border-[#D9D7F7] p-5"
        style={{ background: phaseTheme.background, minHeight: 120 }}
      >
        <div className="relative z-[1]">
          <span
            aria-hidden
            className="mb-[10px] block text-left select-none"
            style={{
              fontSize: 40,
              opacity: phaseTheme.opacity,
            }}
          >
            {phaseTheme.emoji}
          </span>
          {phase ? (
            <>
              <p className="text-xs font-medium uppercase tracking-wider text-[#534AB7]">
                {phase.label} · Day {phase.dayInCycle}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#7F77DD]">
                Today&apos;s affirmation
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#3C3489]">
                {dailyInsight?.her ?? phase.description}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Your rhythm
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Add a cycle start date anytime in settings to see your phase here.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="her-wellness-card mt-4">
        <h2 className="font-display text-lg text-foreground">
          What does your body need most today?
        </h2>
        {savedCheckIn ? (
          <div
            className="mt-4 overflow-hidden rounded-2xl border-2 border-[#7F77DD] p-4"
            style={{ backgroundColor: getCheckInTheme(savedCheckIn).background }}
          >
            <div className="p-4">
              <span
                aria-hidden
                className="mb-3 block text-center leading-none"
                style={{ fontSize: 36, opacity: 0.85 }}
              >
                {getCheckInTheme(savedCheckIn).emoji}
              </span>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#3C3489]">
                  {HER_CHECK_IN_LABELS[savedCheckIn]}
                </p>
                <span
                  aria-hidden
                  className="ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#7F77DD] text-xs font-bold text-white"
                >
                  <IconCheck size={STATUS_ICON_SIZE} stroke={STATUS_ICON_STROKE} />
                </span>
              </div>
              <p className="mt-3 text-sm text-[#3C3489]">
                {(partnerName ?? "Your partner")} will know you need{" "}
                {HER_CHECK_IN_LABELS[savedCheckIn].toLowerCase()} today.
              </p>
              <button
                type="button"
                onClick={resetCheckInSelection}
                className="mt-2 text-xs font-medium text-[#5A52B8] underline underline-offset-2"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <>
            <ul className="mt-4 space-y-2">
              {CHECK_IN_OPTIONS.map((id) => {
                const selected = draftCheckIn === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => selectCheckIn(id)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                        selected
                          ? "border-2 border-[#7F77DD] bg-[#EEEDFE] font-medium text-[#3C3489]"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      <span>{HER_CHECK_IN_LABELS[id]}</span>
                      {selected ? (
                        <span
                          aria-hidden
                          className="ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#7F77DD] text-xs font-bold text-white"
                        >
                          <IconCheck size={STATUS_ICON_SIZE} stroke={STATUS_ICON_STROKE} />
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
            {draftCheckIn ? (
              <button
                type="button"
                onClick={() => void saveCheckIn()}
                disabled={savingCheckIn}
                className="her-wellness-btn-primary mt-4 w-full disabled:opacity-60"
              >
                {savingCheckIn ? "Saving…" : "Save check-in"}
              </button>
            ) : null}
          </>
        )}
      </section>

      {!couple.isComplete ? (
        <section className="mt-6 rounded-2xl border border-border bg-[var(--color-background-secondary)] px-4 py-4">
          <p className="text-sm text-foreground">
            Invite your partner to complete your couple space.
          </p>
          <Link href="/onboarding" className="mt-2 inline-block text-sm text-[var(--her-accent)]">
            Send invite →
          </Link>
        </section>
      ) : connectionState === "thinking" ? (
        <section className="mt-6 rounded-[0_12px_12px_0] border border-[#D4D1FA] border-l-[3px] border-l-[#7F77DD] bg-[#EEEDFE] px-4 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#6A62C8]">
            TODAY&apos;S CONNECTION
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[#3C3489]">
            <IconHeart
              aria-hidden
              size={STATUS_ICON_SIZE}
              stroke={STATUS_ICON_STROKE}
              className="text-[#6A62C8]"
            />
            {(partnerName ?? "Your partner")} is thinking of you today.
          </p>
          <p className="mt-1 text-xs text-[#5A52B8]">
            He saw your insight and wanted you to know he&apos;s here.
          </p>
        </section>
      ) : (
        <section className="mt-6 rounded-[0_12px_12px_0] border border-border border-l-[3px] border-l-[#7F77DD] bg-[var(--color-background-secondary)] px-4 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
            TODAY&apos;S CONNECTION
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-foreground">
            <IconEye
              aria-hidden
              size={STATUS_ICON_SIZE}
              stroke={STATUS_ICON_STROKE}
              className="text-muted"
            />
            Waiting for {(partnerName ?? "your partner")} to check in today.
          </p>
          <p className="mt-1 text-xs text-muted">
            You&apos;ll know when he sees your insight.
          </p>
        </section>
      )}

      {couple.togetherModeActive && activeSession ? (
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
          className={`lv-card lv-card--together relative mt-6 w-full overflow-hidden p-0 text-left ${!couple.isComplete ? "opacity-50" : ""}`}
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
