"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LoviraLogo } from "@/components/intro/lovira-logo";
import { ReelShell } from "./reel-shell";
import { ReelStepShare } from "./step-share";
import { ReelStepInsight } from "./step-insight";
import { ReelStepPrompts } from "./step-prompts";
import { ReelStepOffline } from "./step-offline";
import { analyzeReelLink, type ReelAnalysis } from "@/lib/reel-to-real";

type FlowStep = "share" | "insight" | "prompts" | "offline";

export function ReelToRealFlow() {
  const [step, setStep] = useState<FlowStep>("share");
  const [analysis, setAnalysis] = useState<ReelAnalysis | null>(null);

  function handleAnalyze(url: string) {
    setAnalysis(analyzeReelLink(url));
    setStep("insight");
  }

  return (
    <ReelShell className={step === "offline" ? "rtr-shell--fullscreen" : ""}>
      {step !== "offline" ? (
        <header className="rtr-header">
          <Link href="/" className="rtr-header-brand" aria-label="Lovira home">
            <LoviraLogo className="rtr-header-logo" />
            <span className="rtr-header-wordmark font-display">Lovira</span>
          </Link>
          {step !== "share" ? (
            <button
              type="button"
              className="rtr-header-skip"
              onClick={() => setStep("offline")}
            >
              Skip to moment
            </button>
          ) : null}
        </header>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        {step === "share" && (
          <ReelStepShare key="share" onAnalyze={handleAnalyze} />
        )}
        {step === "insight" && analysis ? (
          <ReelStepInsight
            key="insight"
            analysis={analysis}
            onContinue={() => setStep("prompts")}
          />
        ) : null}
        {step === "prompts" && analysis ? (
          <ReelStepPrompts
            key="prompts"
            prompts={analysis.prompts}
            onContinue={() => setStep("offline")}
          />
        ) : null}
        {step === "offline" ? <ReelStepOffline key="offline" /> : null}
      </AnimatePresence>
    </ReelShell>
  );
}
