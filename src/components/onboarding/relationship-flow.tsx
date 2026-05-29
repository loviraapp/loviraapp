"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CoupleProfile,
  EmotionalPrefs,
  GenderId,
  HabitAnswer,
  RelationshipStageId,
  ScreenHabits,
  SupportStyleId,
} from "@/types/couple-profile";
import { setUserRole } from "@/lib/role";
import { saveCoupleProfile, getCoupleProfile } from "@/lib/couple-profile";
import { saveSupportProfile } from "@/lib/support-profile";
import { comfortsFromSupportStyle } from "@/lib/support-style-map";
import {
  EMOTIONAL_TOGGLE_PARTNER,
  EMOTIONAL_TOGGLES_FEMALE,
  GENDER_OPTIONS,
  HABIT_OPTIONS,
  RELATIONSHIP_STAGE_OPTIONS,
  SUPPORT_STYLE_OPTIONS,
  setupProgressIndex,
  type OnboardingStep,
} from "@/lib/onboarding-flow";
import { OnboardingShell } from "./onboarding-shell";
import { GuidedScreen } from "./guided-screen";
import { CoupleIllustration } from "./couple-illustration";

const DEFAULT_HELP: CoupleProfile["loviraHelp"] = [
  "together_mode",
  "daily_checkins",
  "connection_prompts",
];

export function RelationshipFlow() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("welcome");

  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [gender, setGender] = useState<GenderId | null>(null);
  const [relationshipStage, setRelationshipStage] = useState<RelationshipStageId | null>(
    null
  );
  const [anniversary, setAnniversary] = useState("");
  const [emotionalPrefs, setEmotionalPrefs] = useState<EmotionalPrefs>({});
  const [screenHabits, setScreenHabits] = useState<ScreenHabits>({});
  const [supportStyle, setSupportStyle] = useState<SupportStyleId | null>(null);

  useEffect(() => {
    const existing = getCoupleProfile();
    if (!existing) return;
    setYourName(existing.yourName);
    setPartnerName(existing.partnerName);
    setGender(existing.gender ?? null);
    setRelationshipStage(existing.relationshipStage ?? null);
    setAnniversary(existing.anniversary ?? "");
    setEmotionalPrefs(existing.emotionalPrefs ?? {});
    setScreenHabits(existing.screenHabits ?? {});
    setSupportStyle(existing.supportStyle ?? null);
  }, []);

  function persistAndEnter() {
    if (!supportStyle || !gender) return;
    const comforts = comfortsFromSupportStyle(supportStyle);
    saveCoupleProfile({
      yourName: yourName.trim(),
      partnerName: partnerName.trim(),
      gender,
      relationshipStage: relationshipStage ?? undefined,
      anniversary: anniversary || undefined,
      emotionalPrefs,
      screenHabits,
      supportStyle,
      comforts,
      triggers: [],
      loviraHelp: DEFAULT_HELP,
      onboardingVersion: 2,
    });
    setUserRole("tracking");
    saveSupportProfile("tracking", { comforts, triggers: [], supportStyles: [] });
    router.replace("/dashboard");
  }

  function toggleEmotional(key: keyof EmotionalPrefs) {
    setEmotionalPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  const setupReady =
    yourName.trim() && partnerName.trim() && gender && relationshipStage;

  if (step === "welcome") {
    return (
      <OnboardingShell className="lv-onboarding-shell">
        <div className="lv-onboarding mx-auto max-w-md px-6 pb-12 pt-16">
          <figure className="lv-welcome-art">
            <CoupleIllustration className="h-full w-full" />
          </figure>
          <h1 className="lv-welcome-headline font-display">
            Relationships deserve more than distracted moments.
          </h1>
          <p className="lv-welcome-lead">
            Lovira helps couples emotionally understand each other better —
            especially during stressful, overwhelming, or emotionally sensitive phases.
          </p>
          <div className="lv-guided-footer">
            <button
              type="button"
              className="lv-btn lv-btn--primary"
              onClick={() => setStep("setup")}
            >
              Continue
            </button>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  if (step === "philosophy") {
    return (
      <OnboardingShell className="lv-onboarding-shell">
        <div className="lv-onboarding mx-auto max-w-md px-6 pb-12 pt-16 text-center">
          <div className="lv-philosophy-glow" aria-hidden />
          <h2 className="lv-welcome-headline font-display">
            Small moments build strong relationships.
          </h2>
          <p className="lv-welcome-lead mx-auto mt-4 max-w-xs">
            Lovira isn&apos;t built to keep you scrolling. It&apos;s built to help you feel
            more connected when life gets distracted.
          </p>
          <button
            type="button"
            className="lv-btn lv-btn--primary mt-12"
            onClick={persistAndEnter}
          >
            Start Your Journey
          </button>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell className="lv-onboarding-shell">
      <div className="lv-onboarding mx-auto max-w-md px-6 pb-10 pt-10">
        {step === "setup" ? (
          <GuidedScreen
            stepKey="setup"
            progressStep={setupProgressIndex("setup")}
            eyebrow="Your relationship"
            title="Who are you sharing this with?"
            subtitle="Just the basics — elegant, private, on this device only."
            footer={
              <button
                type="button"
                className="lv-btn lv-btn--primary"
                disabled={!setupReady}
                onClick={() => setStep("emotional")}
              >
                Continue
              </button>
            }
          >
            <div className="lv-field-stack">
              <label className="lv-field">
                <span>Your name</span>
                <input
                  className="onboarding-input"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="Alex"
                />
              </label>
              <label className="lv-field">
                <span>Partner&apos;s name</span>
                <input
                  className="onboarding-input"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Jordan"
                />
              </label>
              <fieldset className="lv-field">
                <legend>Your gender</legend>
                <div className="lv-chip-row">
                  {GENDER_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className={`lv-choice ${gender === o.id ? "lv-choice--on" : ""}`}
                      onClick={() => setGender(o.id)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="lv-field">
                <legend>Relationship stage</legend>
                <div className="lv-chip-col">
                  {RELATIONSHIP_STAGE_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className={`lv-choice lv-choice--wide ${relationshipStage === o.id ? "lv-choice--on" : ""}`}
                      onClick={() => setRelationshipStage(o.id)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="lv-field">
                <span>Anniversary (optional)</span>
                <input
                  type="date"
                  className="onboarding-input"
                  value={anniversary}
                  onChange={(e) => setAnniversary(e.target.value)}
                />
              </label>
            </div>
          </GuidedScreen>
        ) : null}

        {step === "emotional" ? (
          <GuidedScreen
            stepKey="emotional"
            progressStep={setupProgressIndex("emotional")}
            eyebrow="Emotional understanding"
            title={
              gender === "female"
                ? "Would you like gentle emotional awareness?"
                : "Support your partner with care"
            }
            subtitle="Lovira focuses on emotional understanding and support — not medical tracking."
            onBack={() => setStep("setup")}
            footer={
              <button
                type="button"
                className="lv-btn lv-btn--primary"
                onClick={() => setStep("connection")}
              >
                Continue
              </button>
            }
          >
            {gender === "female" ? (
              <ul className="lv-toggle-list">
                {EMOTIONAL_TOGGLES_FEMALE.map((t) => (
                  <li key={t.key}>
                    <button
                      type="button"
                      className={`lv-toggle ${emotionalPrefs[t.key] ? "lv-toggle--on" : ""}`}
                      onClick={() => toggleEmotional(t.key)}
                    >
                      <span className="lv-toggle-label">{t.label}</span>
                      <span className="lv-toggle-hint">{t.hint}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <button
                type="button"
                className={`lv-toggle ${emotionalPrefs.partnerSupportGuidance ? "lv-toggle--on" : ""}`}
                onClick={() => toggleEmotional("partnerSupportGuidance")}
              >
                <span className="lv-toggle-label">
                  {EMOTIONAL_TOGGLE_PARTNER.label}
                </span>
                <span className="lv-toggle-hint">{EMOTIONAL_TOGGLE_PARTNER.hint}</span>
              </button>
            )}
          </GuidedScreen>
        ) : null}

        {step === "connection" ? (
          <GuidedScreen
            stepKey="connection"
            progressStep={setupProgressIndex("connection")}
            eyebrow="Connection & presence"
            title="When you're together, does the phone still win?"
            subtitle="Many couples feel close in proximity but far in attention. Lovira helps gently reconnect."
            onBack={() => setStep("emotional")}
            footer={
              <button
                type="button"
                className="lv-btn lv-btn--primary"
                onClick={() => setStep("support")}
              >
                Continue
              </button>
            }
          >
            <HabitQuestion
              label="Do you often spend time together while both on phones?"
              value={screenHabits.phonesTogether}
              onChange={(v) => setScreenHabits((h) => ({ ...h, phonesTogether: v }))}
            />
            <HabitQuestion
              label="Do you sometimes feel emotionally disconnected despite being together?"
              value={screenHabits.feelDisconnected}
              onChange={(v) => setScreenHabits((h) => ({ ...h, feelDisconnected: v }))}
            />
            <div className="lv-habit-block">
              <p className="lv-habit-label">Would gentle reconnect reminders help?</p>
              <div className="lv-chip-row">
                <button
                  type="button"
                  className={`lv-choice ${screenHabits.reconnectReminders === true ? "lv-choice--on" : ""}`}
                  onClick={() =>
                    setScreenHabits((h) => ({ ...h, reconnectReminders: true }))
                  }
                >
                  Yes, gently
                </button>
                <button
                  type="button"
                  className={`lv-choice ${screenHabits.reconnectReminders === false ? "lv-choice--on" : ""}`}
                  onClick={() =>
                    setScreenHabits((h) => ({ ...h, reconnectReminders: false }))
                  }
                >
                  Not needed
                </button>
              </div>
            </div>
          </GuidedScreen>
        ) : null}

        {step === "support" ? (
          <GuidedScreen
            stepKey="support"
            progressStep={setupProgressIndex("support")}
            eyebrow="How you feel supported"
            title="How do you usually feel most supported?"
            subtitle="Choose what feels most true — Lovira will remember gently."
            onBack={() => setStep("connection")}
            footer={
              <button
                type="button"
                className="lv-btn lv-btn--primary"
                disabled={!supportStyle}
                onClick={() => setStep("philosophy")}
              >
                Continue
              </button>
            }
          >
            <div className="lv-support-grid">
              {SUPPORT_STYLE_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`lv-support-card ${supportStyle === o.id ? "lv-support-card--on" : ""}`}
                  onClick={() => setSupportStyle(o.id)}
                >
                  <span aria-hidden>{o.emoji}</span>
                  {o.label}
                </button>
              ))}
            </div>
          </GuidedScreen>
        ) : null}
      </div>
    </OnboardingShell>
  );
}

function HabitQuestion({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: HabitAnswer;
  onChange: (v: HabitAnswer) => void;
}) {
  return (
    <div className="lv-habit-block">
      <p className="lv-habit-label">{label}</p>
      <div className="lv-chip-col">
        {HABIT_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`lv-choice lv-choice--wide ${value === o.id ? "lv-choice--on" : ""}`}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
