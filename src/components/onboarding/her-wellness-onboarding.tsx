"use client";

import { useState } from "react";
import { LoviraLogo } from "@/components/intro/lovira-logo";
import type { HerPrivacySetting } from "@/lib/her-wellness-storage";
import {
  setHerCycleLength,
  setHerLastPeriod,
  setHerOnboardingComplete,
  setHerPrivacySetting,
} from "@/lib/her-wellness-storage";
import { syncHerWellnessShareToServer } from "@/lib/sync-her-wellness-share";

type Step = 1 | 2 | 3 | 4;

type HerWellnessOnboardingProps = {
  firstName: string | null;
  onFirstNameSave: (firstName: string) => Promise<void>;
  onComplete: () => void;
};

const PRIVACY_OPTIONS: {
  id: HerPrivacySetting;
  title: string;
  body: string;
  recommended?: boolean;
}[] = [
  {
    id: "phase_only",
    title: "Phase only",
    body: "They'll see something like \"she's in a high-emotion week\" — nothing more.",
  },
  {
    id: "phase_and_mood",
    title: "Phase + daily mood",
    body: "They see your phase and what you check in with each day — no raw details.",
    recommended: true,
  },
  {
    id: "manual",
    title: "I'll decide each time",
    body: "Nothing is shared automatically. You manually choose what to send.",
  },
];

export function HerWellnessOnboarding({
  firstName,
  onFirstNameSave,
  onComplete,
}: HerWellnessOnboardingProps) {
  const [step, setStep] = useState<Step>(1);
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [privacy, setPrivacy] = useState<HerPrivacySetting>("phase_and_mood");
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const greetingName = firstName?.trim() || null;

  async function continueFromWelcome() {
    if (greetingName) {
      setStep(2);
      return;
    }
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setSavingName(true);
    setNameError(null);
    try {
      await onFirstNameSave(trimmed);
      setStep(2);
    } catch (e) {
      setNameError(
        e instanceof Error ? e.message : "Could not save your name"
      );
    } finally {
      setSavingName(false);
    }
  }

  function finish(skippedPeriod: boolean) {
    if (!skippedPeriod && lastPeriod) {
      setHerLastPeriod(lastPeriod);
    } else {
      setHerLastPeriod(null);
    }
    setHerCycleLength(cycleLength);
    setHerPrivacySetting(privacy);
    setHerOnboardingComplete();
    void fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboardingComplete: true }),
    });
    void syncHerWellnessShareToServer();
    onComplete();
  }

  return (
    <div className="her-wellness mx-auto min-h-dvh max-w-md px-6 py-10">
      <LoviraLogo className="h-8 w-8 text-[var(--her-accent)]" />

      <div className="mt-6 flex gap-1.5" aria-hidden>
        {([1, 2, 3, 4] as Step[]).map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full transition-colors ${
              n <= step ? "bg-[var(--her-accent)]" : "bg-border"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="mt-10">
          <h1 className="font-display text-2xl leading-snug text-foreground">
            {greetingName
              ? `Let's make Lovira work for you, ${greetingName}.`
              : "Let's make Lovira work for you."}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We need just a few things to give your partner the right emotional
            context. Takes about 60 seconds.
          </p>
          {!greetingName ? (
            <div className="mt-6 space-y-2">
              <label
                htmlFor="her-first-name"
                className="text-sm font-medium text-foreground"
              >
                What&apos;s your first name?
              </label>
              <input
                id="her-first-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="First name"
                autoComplete="given-name"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground"
              />
              {nameError ? (
                <p className="text-sm text-red-400">{nameError}</p>
              ) : null}
            </div>
          ) : null}
          <p className="mt-6 rounded-2xl border border-[var(--her-accent)]/20 bg-[var(--her-accent-soft)] px-4 py-3 text-sm text-foreground">
            Your data is private by default. You decide what your partner sees —
            always.
          </p>
          <button
            type="button"
            onClick={() => void continueFromWelcome()}
            disabled={savingName || (!greetingName && !nameInput.trim())}
            className="her-wellness-btn-primary mt-8 w-full disabled:opacity-50"
          >
            {savingName ? "Saving…" : "Let's go"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-10">
          <h1 className="font-display text-2xl text-foreground">
            When did your last cycle start?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            This is how Lovira knows where you are emotionally — and what your
            partner might gently need to know.
          </p>
          <label className="mt-8 block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Start date
            </span>
            <input
              type="date"
              value={lastPeriod}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setLastPeriod(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-[var(--her-accent)]/50"
            />
          </label>
          <p className="mt-3 text-xs text-muted">
            Only shared if you choose to
          </p>
          <button
            type="button"
            disabled={!lastPeriod}
            onClick={() => setStep(3)}
            className="her-wellness-btn-primary mt-6 w-full disabled:opacity-50"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => {
              setLastPeriod("");
              setStep(3);
            }}
            className="mt-3 w-full py-2 text-sm text-muted"
          >
            My cycle is irregular — skip for now
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="mt-10">
          <h1 className="font-display text-2xl text-foreground">
            How long is your typical cycle?
          </h1>
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="Decrease cycle length"
              onClick={() => setCycleLength((n) => Math.max(21, n - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-xl text-foreground"
            >
              −
            </button>
            <span className="font-display text-4xl text-foreground">
              {cycleLength}
            </span>
            <button
              type="button"
              aria-label="Increase cycle length"
              onClick={() => setCycleLength((n) => Math.min(40, n + 1))}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-xl text-foreground"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-muted">days</p>
          <input
            type="range"
            min={21}
            max={40}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="mt-6 w-full accent-[var(--her-accent)]"
          />
          <button
            type="button"
            onClick={() => setStep(4)}
            className="her-wellness-btn-primary mt-8 w-full"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => {
              setCycleLength(28);
              setStep(4);
            }}
            className="mt-3 w-full py-2 text-sm text-muted"
          >
            Not sure — use 28 days
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="mt-10">
          <h1 className="font-display text-2xl text-foreground">
            What can your partner see?
          </h1>
          <ul className="mt-6 space-y-3">
            {PRIVACY_OPTIONS.map((opt) => {
              const selected = privacy === opt.id;
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => setPrivacy(opt.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                      selected
                        ? "border-[var(--her-accent)] bg-[var(--her-accent-soft)]"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-foreground">
                        {opt.title}
                      </span>
                      {opt.recommended ? (
                        <span className="rounded-full bg-[var(--her-accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--her-accent)]">
                          Recommended
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-muted">{opt.body}</p>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => finish(!lastPeriod)}
            className="her-wellness-btn-primary mt-8 w-full"
          >
            Continue to invite your partner
          </button>
        </div>
      )}
    </div>
  );
}
