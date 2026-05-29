"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoviraLogo } from "@/components/intro/lovira-logo";
import { HerWellnessOnboarding } from "@/components/onboarding/her-wellness-onboarding";
import { isHerOnboardingComplete } from "@/lib/her-wellness-storage";
import type { CoupleContext } from "@/types/together-session";

type Step = "wellness" | "name" | "invite";

type MeResponse = {
  user: {
    id: string;
    email?: string;
    firstName?: string | null;
    displayName?: string | null;
  } | null;
  couple: CoupleContext | null;
};

export function MvpOnboardingFlow({ inviteCode }: { inviteCode?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [displayName, setDisplayName] = useState("");
  const [couple, setCouple] = useState<CoupleContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [wellnessName, setWellnessName] = useState<string | null>(null);

  const isJoining = Boolean(inviteCode);
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    if (hasCheckedSession.current) return;
    hasCheckedSession.current = true;

    let cancelled = false;

    async function verifySession() {
      let showForm = true;
      try {
        const res = await fetch("/api/me");
        const data = (await res.json()) as MeResponse;
        if (cancelled) return;

        if (!data.user) {
          showForm = false;
          const next = inviteCode
            ? `/invite/${inviteCode}`
            : "/onboarding";
          router.replace(`/auth?next=${encodeURIComponent(next)}`);
          return;
        }

        const firstName = data.user.firstName?.trim() || null;
        if (firstName) {
          setWellnessName(firstName);
          setDisplayName((prev) => prev || firstName);
        }

        if (data.couple?.isComplete) {
          showForm = false;
          router.replace("/dashboard");
          return;
        }

        if (data.couple) {
          setCouple(data.couple);
          if (isJoining) {
            showForm = false;
            router.replace("/dashboard");
            return;
          }
          if (!isHerOnboardingComplete()) {
            setStep("wellness");
          } else {
            setStep("invite");
          }
          return;
        }

        if (isJoining) {
          setStep("name");
          return;
        }

        if (!isHerOnboardingComplete()) {
          setStep("wellness");
        } else {
          setStep("name");
        }
      } catch {
        if (!cancelled) {
          setError("Could not verify your session. Try signing in again.");
        }
      } finally {
        if (!cancelled && showForm) {
          setCheckingSession(false);
        }
      }
    }

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [router, inviteCode, isJoining]);

  async function saveFirstName(firstName: string) {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: firstName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "Could not save your name");
    }
    setWellnessName(firstName.trim());
    setDisplayName((prev) => prev || firstName.trim());
  }

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;
    setLoading(true);
    setError(null);

    try {
      if (isJoining && inviteCode) {
        const res = await fetch("/api/couple/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inviteCode,
            displayName: displayName.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not join");
        router.replace("/dashboard");
        return;
      }

      const res = await fetch("/api/couple/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create space");
      setCouple(data.couple);
      setStep("invite");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      if (message.toLowerCase().includes("invalid api key")) {
        setError(
          "Server API key missing. In .env.local set SUPABASE_SERVICE_ROLE_KEY to the service_role key from Supabase → Settings → API (not the anon key). Save the file, then restart npm run dev."
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  const inviteUrl =
    typeof window !== "undefined" && couple
      ? `${window.location.origin}/invite/${couple.inviteCode}`
      : "";

  async function copyInvite() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (checkingSession) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <LoviraLogo className="mx-auto h-9 w-9 text-primary" />
        <p className="mt-8 text-sm text-muted">Loading…</p>
      </div>
    );
  }

  if (step === "wellness") {
    return (
      <HerWellnessOnboarding
        firstName={wellnessName}
        onFirstNameSave={saveFirstName}
        onComplete={() => setStep("name")}
      />
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <LoviraLogo className="h-9 w-9 text-primary" />

      {step === "name" && (
        <>
          <h1 className="mt-8 font-display text-2xl text-foreground">
            {isJoining ? "Join your partner" : "Almost there"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isJoining
              ? "What should your partner see as your name?"
              : wellnessName
                ? `${wellnessName}, what should your partner see as your name?`
                : "Your rhythm is set. What should we call you?"}
          </p>
          <form onSubmit={handleNameSubmit} className="mt-8 space-y-4">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your first name"
              className="w-full rounded-xl border border-border bg-card px-4 py-3"
              required
            />
            {error ? (
              <p className="text-sm text-red-400">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-medium text-white"
            >
              {loading ? "…" : isJoining ? "Join couple space" : "Continue"}
            </button>
          </form>
        </>
      )}

      {step === "invite" && couple && (
        <>
          <h1 className="mt-8 font-display text-2xl text-foreground">
            Invite your partner
          </h1>
          <p className="mt-2 text-sm text-muted">
            You&apos;ve chosen what to share. Send this link when you&apos;re
            ready — they&apos;ll sign in with their own email.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted">
              Invite code
            </p>
            <p className="mt-1 font-mono text-2xl tracking-widest text-foreground">
              {couple.inviteCode}
            </p>
            <p className="mt-4 break-all text-sm text-muted">{inviteUrl}</p>
            <button
              type="button"
              onClick={copyInvite}
              className="mt-4 w-full rounded-full border border-primary/30 py-2.5 text-sm text-primary"
            >
              {copied ? "Copied" : "Copy invite link"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.replace("/dashboard")}
            className="mt-6 w-full text-center text-sm text-muted"
          >
            I&apos;ll invite them later →
          </button>
        </>
      )}
    </div>
  );
}
