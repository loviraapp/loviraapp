"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types/role";
import type {
  ComfortPreferenceId,
  HarderTriggerId,
  SupportStyleId,
} from "@/types/support-preferences";
import {
  COMFORT_OPTIONS,
  TRIGGER_OPTIONS,
  SUPPORT_STYLE_OPTIONS,
} from "@/lib/support-preferences";
import { getSupportProfile, saveSupportProfile } from "@/lib/support-profile";
import { PreferenceStep } from "./preference-step";

type SupportPreferencesFlowProps = {
  role: UserRole;
  onComplete?: () => void;
};

export function SupportPreferencesFlow({
  role,
  onComplete,
}: SupportPreferencesFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [comforts, setComforts] = useState<ComfortPreferenceId[]>([]);
  const [triggers, setTriggers] = useState<HarderTriggerId[]>([]);
  const [supportStyles, setSupportStyles] = useState<SupportStyleId[]>([]);
  const [customComfort, setCustomComfort] = useState("");
  const [customTrigger, setCustomTrigger] = useState("");

  useEffect(() => {
    const existing = getSupportProfile(role);
    if (existing) {
      setComforts(existing.comforts);
      setTriggers(existing.triggers);
      setSupportStyles(existing.supportStyles);
      setCustomComfort(existing.customComfort ?? "");
      setCustomTrigger(existing.customTrigger ?? "");
    }
  }, [role]);

  function toggle<T extends string>(list: T[], id: T, setter: (v: T[]) => void) {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function finish() {
    saveSupportProfile(role, {
      comforts,
      triggers,
      supportStyles,
      customComfort: customComfort.trim() || undefined,
      customTrigger: customTrigger.trim() || undefined,
    });
    if (onComplete) {
      onComplete();
    } else {
      router.replace("/dashboard");
    }
  }

  if (step === 1) {
    return (
      <PreferenceStep
        step={1}
        totalSteps={3}
        title="When you're emotionally low, what usually helps?"
        subtitle="Choose what feels true for you — this helps your partner show up thoughtfully, not guess."
        options={COMFORT_OPTIONS}
        selected={comforts}
        onToggle={(id) =>
          toggle(comforts, id as ComfortPreferenceId, setComforts)
        }
        customValue={customComfort}
        onCustomChange={setCustomComfort}
        customPlaceholder="e.g. A warm shower, favorite blanket…"
        onContinue={() => setStep(2)}
      />
    );
  }

  if (step === 2) {
    return (
      <PreferenceStep
        step={2}
        totalSteps={3}
        title="What tends to make stressful days worse?"
        subtitle="Optional — knowing what to avoid is just as caring as knowing what helps."
        options={TRIGGER_OPTIONS}
        selected={triggers}
        onToggle={(id) =>
          toggle(triggers, id as HarderTriggerId, setTriggers)
        }
        customValue={customTrigger}
        onCustomChange={setCustomTrigger}
        customPlaceholder="e.g. Unsolicited advice…"
        onContinue={() => setStep(3)}
        onSkip={() => setStep(3)}
        requireSelection={false}
      />
    );
  }

  return (
    <PreferenceStep
      step={3}
      totalSteps={3}
      title="How do you usually show care?"
      subtitle="This isn't tracking — it's helping you both understand how love already shows up."
      options={SUPPORT_STYLE_OPTIONS}
      selected={supportStyles}
      onToggle={(id) =>
        toggle(supportStyles, id as SupportStyleId, setSupportStyles)
      }
      onContinue={finish}
      onSkip={finish}
      continueLabel="Save & begin"
      requireSelection={false}
    />
  );
}
