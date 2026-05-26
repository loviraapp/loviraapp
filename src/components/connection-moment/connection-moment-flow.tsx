"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LoviraLogo } from "@/components/intro/lovira-logo";
import { ConnectionMomentShell } from "./connection-moment-shell";
import { TogetherModeStepStart } from "./step-start";
import { TogetherModeStepOpeningPrompt } from "./step-opening-prompt";
import { TogetherModeStepPresence } from "./step-presence";
import { TogetherModeStepReflection } from "./step-reflection";
import {
  pickOpeningPrompt,
  type TogetherDuration,
} from "@/lib/connection-moment";

type FlowStep = "start" | "prompt" | "presence" | "reflection";

export function ConnectionMomentFlow() {
  const [step, setStep] = useState<FlowStep>("start");
  const [duration, setDuration] = useState<TogetherDuration>(15);
  const openingPrompt = useMemo(() => pickOpeningPrompt(), []);

  return (
    <ConnectionMomentShell>
      <header className="cm-header">
        <Link href="/" className="cm-header-brand" aria-label="Lovira home">
          <LoviraLogo className="cm-header-logo" />
          <span className="cm-header-wordmark font-display">Lovira</span>
        </Link>
        {step === "presence" ? (
          <button
            type="button"
            className="cm-header-exit"
            onClick={() => setStep("reflection")}
          >
            End gently
          </button>
        ) : null}
      </header>

      <AnimatePresence mode="wait" initial={false}>
        {step === "start" && (
          <TogetherModeStepStart
            key="start"
            onBegin={(minutes) => {
              setDuration(minutes);
              setStep("prompt");
            }}
          />
        )}
        {step === "prompt" && (
          <TogetherModeStepOpeningPrompt
            key="prompt"
            prompt={openingPrompt}
            onContinue={() => setStep("presence")}
          />
        )}
        {step === "presence" && (
          <TogetherModeStepPresence
            key="presence"
            durationMinutes={duration}
            onComplete={() => setStep("reflection")}
          />
        )}
        {step === "reflection" && (
          <TogetherModeStepReflection
            key="reflection"
            durationMinutes={duration}
          />
        )}
      </AnimatePresence>
    </ConnectionMomentShell>
  );
}
