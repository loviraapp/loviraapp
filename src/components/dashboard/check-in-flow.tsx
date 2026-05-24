"use client";

import { useState } from "react";
import type { MoodId, NeedId } from "@/types/app";
import { RitualStepMoods } from "./ritual-step-moods";
import { RitualStepNeeds } from "./ritual-step-needs";
import { RitualProgress } from "./ritual-progress";

type CheckInFlowProps = {
  moods: MoodId[];
  needs: NeedId[];
  onMoodToggle: (mood: MoodId) => void;
  onNeedToggle: (need: NeedId) => void;
  onComplete: () => void;
};

export function CheckInFlow({
  moods,
  needs,
  onMoodToggle,
  onNeedToggle,
  onComplete,
}: CheckInFlowProps) {
  const [step, setStep] = useState<1 | 2>(moods.length > 0 ? 2 : 1);

  function handleContinue() {
    if (step === 1 && moods.length > 0) {
      setStep(2);
      return;
    }
    if (step === 2 && needs.length > 0) {
      onComplete();
    }
  }

  const canContinue = step === 1 ? moods.length > 0 : needs.length > 0;

  return (
    <div className="space-y-8">
      <RitualProgress step={step} />
      {step === 1 ? (
        <RitualStepMoods selected={moods} onToggle={onMoodToggle} />
      ) : (
        <RitualStepNeeds selected={needs} onToggle={onNeedToggle} />
      )}
      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-opacity disabled:opacity-40"
      >
        {step === 1 ? "Continue" : "See tonight's vibe"}
      </button>
    </div>
  );
}
