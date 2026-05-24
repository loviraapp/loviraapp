"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ComfortPreferenceId, HarderTriggerId } from "@/types/support-preferences";
import type { LoviraHelpId } from "@/types/couple-profile";
import { setUserRole } from "@/lib/role";
import { saveCoupleProfile, getCoupleProfile } from "@/lib/couple-profile";
import { saveSupportProfile } from "@/lib/support-profile";
import {
  ONBOARDING_COMFORT_OPTIONS,
  TRIGGER_OPTIONS,
  LOVIRA_HELP_OPTIONS,
} from "@/lib/support-preferences";
import { OnboardingShell } from "./onboarding-shell";
import { OnboardingHero } from "./onboarding-hero";
import { CoupleSetupStep } from "./couple-setup-step";
import { OnboardingComplete } from "./onboarding-complete";
import { PreferenceStep } from "./preference-step";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [comforts, setComforts] = useState<ComfortPreferenceId[]>([]);
  const [triggers, setTriggers] = useState<HarderTriggerId[]>([]);
  const [loviraHelp, setLoviraHelp] = useState<LoviraHelpId[]>([
    "daily_checkins",
    "relationship_rituals",
    "gentle_insights",
  ]);

  useEffect(() => {
    const existing = getCoupleProfile();
    if (existing) {
      setYourName(existing.yourName);
      setPartnerName(existing.partnerName);
      setAnniversary(existing.anniversary ?? "");
      setComforts(existing.comforts);
      setTriggers(existing.triggers);
      setLoviraHelp(existing.loviraHelp);
    }
  }, []);

  function toggle<T extends string>(list: T[], id: T, setter: (v: T[]) => void) {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function finishSetup() {
    saveCoupleProfile({
      yourName: yourName.trim(),
      partnerName: partnerName.trim(),
      anniversary: anniversary || undefined,
      comforts,
      triggers,
      loviraHelp,
    });
    setUserRole("tracking");
    saveSupportProfile("tracking", {
      comforts,
      triggers,
      supportStyles: [],
    });
    setStep(6);
  }

  function enterDashboard() {
    router.replace("/dashboard");
  }

  function exploreDemo() {
    saveCoupleProfile({
      yourName: "Alex",
      partnerName: "Jordan",
      comforts: ["listening", "tea_coffee", "quiet_time"],
      triggers: ["immediate_fixing"],
      loviraHelp: ["daily_checkins", "relationship_rituals", "gentle_insights"],
    });
    setUserRole("tracking");
    saveSupportProfile("tracking", {
      comforts: ["listening", "tea_coffee", "quiet_time"],
      triggers: ["immediate_fixing"],
      supportStyles: [],
    });
    router.replace("/dashboard");
  }

  if (step === 1) {
    return (
      <OnboardingShell>
        <OnboardingHero onBegin={() => setStep(2)} onExploreDemo={exploreDemo} />
      </OnboardingShell>
    );
  }

  if (step === 6) {
    return (
      <OnboardingShell>
        <OnboardingComplete
          yourName={yourName.trim()}
          partnerName={partnerName.trim()}
          onEnter={enterDashboard}
        />
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell className="mx-auto max-w-md">
      {step === 2 ? (
        <CoupleSetupStep
          yourName={yourName}
          partnerName={partnerName}
          anniversary={anniversary}
          onYourNameChange={setYourName}
          onPartnerNameChange={setPartnerName}
          onAnniversaryChange={setAnniversary}
          onContinue={() => setStep(3)}
        />
      ) : null}

      {step === 3 ? (
        <div className="px-6 pb-10 pt-8">
          <PreferenceStep
            step={1}
            totalSteps={3}
            title="What helps you feel cared for?"
            subtitle="Choose what feels true — your partner can learn this gently, never as a score."
            options={ONBOARDING_COMFORT_OPTIONS}
            selected={comforts}
            onToggle={(id) =>
              toggle(comforts, id as ComfortPreferenceId, setComforts)
            }
            onContinue={() => setStep(4)}
          />
        </div>
      ) : null}

      {step === 4 ? (
        <div className="px-6 pb-10 pt-8">
          <PreferenceStep
            step={2}
            totalSteps={3}
            title="What tends to make difficult days harder?"
            subtitle="Optional — knowing what to avoid is a form of care."
            options={TRIGGER_OPTIONS}
            selected={triggers}
            onToggle={(id) =>
              toggle(triggers, id as HarderTriggerId, setTriggers)
            }
            onContinue={() => setStep(5)}
            onSkip={() => setStep(5)}
            requireSelection={false}
          />
        </div>
      ) : null}

      {step === 5 ? (
        <div className="px-6 pb-10 pt-8">
          <PreferenceStep
            step={3}
            totalSteps={3}
            title="How should Lovira help?"
            subtitle="Pick what you want from your daily ritual together."
            options={LOVIRA_HELP_OPTIONS}
            selected={loviraHelp}
            onToggle={(id) =>
              toggle(loviraHelp, id as LoviraHelpId, setLoviraHelp)
            }
            onContinue={finishSetup}
            continueLabel="Finish setup"
            requireSelection={false}
          />
        </div>
      ) : null}
    </OnboardingShell>
  );
}
