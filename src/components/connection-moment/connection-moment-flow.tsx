"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LoviraLogo } from "@/components/intro/lovira-logo";
import { ConnectionMomentShell } from "./connection-moment-shell";
import { TogetherModeStepStart } from "./step-start";
import { TogetherModeStepActivity } from "./step-activity";
import { TogetherModeStepWaitPartner } from "./step-wait-partner";
import { TogetherModeStepOpeningPrompt } from "./step-opening-prompt";
import { TogetherModeStepPresence } from "./step-presence";
import { TogetherModeStepReflection } from "./step-reflection";
import { useTogetherSession } from "@/hooks/use-together-session";
import type { TogetherDuration } from "@/lib/connection-moment";
import {
  getTogetherActivity,
  pickOpeningPromptForActivity,
  type TogetherActivityId,
} from "@/lib/together-activities";
import type { TogetherSessionStatus } from "@/types/together-session";

type LocalStep = "start" | "wait" | "activity" | "prompt" | "presence" | "reflection";

function statusToStep(status: TogetherSessionStatus): LocalStep {
  switch (status) {
    case "waiting":
      return "wait";
    case "activity":
      return "activity";
    case "prompt":
      return "prompt";
    case "presence":
      return "presence";
    case "reflection":
    case "completed":
      return "reflection";
    default:
      return "wait";
  }
}

export function ConnectionMomentFlow() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const {
    session,
    loading,
    isHost,
    partnerJoined,
    patch,
    join,
    userId,
    reflections,
  } = useTogetherSession(sessionId);

  const [hostStep, setHostStep] = useState<LocalStep>("start");
  const [duration, setDuration] = useState<TogetherDuration>(15);
  const [activityId, setActivityId] = useState<TogetherActivityId>("talk");
  const [couplePartnerName, setCouplePartnerName] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    if (!isHost) join();
  }, [sessionId, isHost, join]);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setCouplePartnerName(d.couple?.partnerName ?? null));
  }, []);

  useEffect(() => {
    if (session) {
      setDuration(session.duration_minutes as TogetherDuration);
      setActivityId(session.activity_id as TogetherActivityId);
    }
  }, [session]);

  useEffect(() => {
    if (!session || !isHost || !sessionId) return;
    if (session.status === "waiting") {
      const setupDone = sessionStorage.getItem(`lovira:host-setup:${sessionId}`);
      if (setupDone) setHostStep("wait");
      return;
    }
    setHostStep(statusToStep(session.status));
  }, [session, isHost, sessionId]);

  const activity = useMemo(() => getTogetherActivity(activityId), [activityId]);

  const openingPrompt =
    session?.opening_prompt ||
    pickOpeningPromptForActivity(activityId, duration * 7);

  const partnerStep = session ? statusToStep(session.status) : "wait";

  if (!sessionId) {
    return (
      <ConnectionMomentShell>
        <div className="cm-step cm-step--center px-6 text-center">
          <p className="text-muted">Start Together Mode from your home screen.</p>
          <Link href="/dashboard" className="cm-btn cm-btn--primary mt-6">
            Go to home
          </Link>
        </div>
      </ConnectionMomentShell>
    );
  }

  if (loading || !session) {
    return (
      <ConnectionMomentShell>
        <div className="cm-step cm-step--center animate-pulse text-muted">
          Loading your moment…
        </div>
      </ConnectionMomentShell>
    );
  }

  const step = isHost ? hostStep : partnerStep;

  async function hostBeginWait(minutes: TogetherDuration) {
    setDuration(minutes);
    if (sessionId) {
      sessionStorage.setItem(`lovira:host-setup:${sessionId}`, "1");
    }
    await patch({ durationMinutes: minutes, status: "waiting" });
    setHostStep("wait");
  }

  async function hostContinueFromWait() {
    if (!partnerJoined) return;
    setHostStep("activity");
    await patch({ status: "activity" });
  }

  async function hostContinueFromActivity(id: TogetherActivityId) {
    setActivityId(id);
    const prompt = pickOpeningPromptForActivity(id, duration * 11);
    await patch({
      activityId: id,
      openingPrompt: prompt,
      status: "prompt",
    });
    setHostStep("prompt");
  }

  async function hostContinueToPresence() {
    await patch({ presenceStarted: true });
    setHostStep("presence");
  }

  async function hostCompletePresence() {
    await patch({ status: "reflection" });
    setHostStep("reflection");
  }

  return (
    <ConnectionMomentShell>
      <header className="cm-header">
        <Link href="/dashboard" className="cm-header-brand" aria-label="Lovira home">
          <LoviraLogo className="cm-header-logo" />
          <span className="cm-header-wordmark font-display">Lovira</span>
        </Link>
        {step === "presence" ? (
          <button
            type="button"
            className="cm-header-exit"
            onClick={() => {
              if (isHost) hostCompletePresence();
            }}
          >
            End gently
          </button>
        ) : null}
      </header>

      <AnimatePresence mode="wait" initial={false}>
        {step === "start" && isHost && (
          <TogetherModeStepStart
            key="start"
            onBegin={hostBeginWait}
          />
        )}

        {step === "wait" && (
          <div key="wait">
            <TogetherModeStepWaitPartner
              partnerName={couplePartnerName}
              joined={partnerJoined}
              isHost={isHost}
            />
            {isHost && partnerJoined && (
              <div className="px-6 pb-8">
                <button
                  type="button"
                  className="cm-btn cm-btn--primary mx-auto block w-full max-w-xs"
                  onClick={hostContinueFromWait}
                >
                  Continue together
                </button>
              </div>
            )}
          </div>
        )}

        {step === "activity" && (
          <TogetherModeStepActivity
            key="activity"
            readOnly={!isHost}
            initialActivityId={activityId}
            onContinue={isHost ? hostContinueFromActivity : undefined}
          />
        )}

        {step === "prompt" && (
          <TogetherModeStepOpeningPrompt
            key="prompt"
            prompt={openingPrompt}
            activityLabel={activity.shortLabel}
            readOnly={!isHost}
            onContinue={isHost ? hostContinueToPresence : undefined}
          />
        )}

        {step === "presence" && (
          <TogetherModeStepPresence
            key="presence"
            durationMinutes={duration}
            activityPresenceLine={activity.presenceLine}
            startedAt={session.presence_started_at}
            onComplete={isHost ? hostCompletePresence : undefined}
          />
        )}

        {step === "reflection" && sessionId && (
          <TogetherModeStepReflection
            key="reflection"
            sessionId={sessionId}
            durationMinutes={duration}
            activityId={activityId}
            userId={userId}
            reflections={reflections}
          />
        )}
      </AnimatePresence>
    </ConnectionMomentShell>
  );
}
