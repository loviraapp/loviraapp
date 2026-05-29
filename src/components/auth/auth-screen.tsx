"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { LoviraLogo } from "@/components/intro/lovira-logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  formatCooldownRemaining,
  getAuthEmailCooldownRemainingMs,
  setAuthEmailCooldown,
} from "@/lib/auth-email-cooldown";

function sentConfirmationMessage(inviteNext: string | null): string {
  if (inviteNext?.includes("/invite/")) {
    return "Invite sent. If they don't see it, check spam — sending another too soon may delay delivery.";
  }
  return "Sign-in link sent. If they don't see it, check spam — sending another too soon may delay delivery.";
}

function formatAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("rate limit") || lower.includes("rate_limit")) {
    return "Email limit reached for this project. Wait for the timer below before trying again.";
  }
  if (lower.includes("code verifier") || lower.includes("pkce")) {
    return "The email link opened in a different browser than where you requested it. Use the 6-digit code from the same email instead (below), or open the link in Chrome on the same port you started from.";
  }
  if (lower.includes("expired") || lower.includes("invalid")) {
    return "That link expired or was already used. Wait for the timer, then request one new link.";
  }
  return message;
}

function authCallbackErrorMessage(
  errorCode: string | null,
  detail: string | null
): string | null {
  if (errorCode !== "auth") return null;
  if (detail) return formatAuthError(detail);
  return "Sign-in link didn't work. Use the same browser and port, then try one new link after the cooldown.";
}

export function AuthScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteNext = searchParams.get("next");
  const callbackError = authCallbackErrorMessage(
    searchParams.get("error"),
    searchParams.get("message")
  );
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(callbackError);
  const [loading, setLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [resolvingAuth, setResolvingAuth] = useState(false);
  const hasHandledSession = useRef(false);

  const configured = isSupabaseConfigured();
  const cooldownActive = cooldownMs > 0;

  const resolveAuthenticatedRoute = useCallback(async () => {
    const res = await fetch("/api/me", { cache: "no-store" });
    const data = (await res.json()) as {
      user: { onboardingComplete?: boolean } | null;
    };
    const onboardingComplete = Boolean(data.user?.onboardingComplete);
    router.replace(onboardingComplete ? "/dashboard" : "/onboarding");
  }, [router]);

  useEffect(() => {
    setError(callbackError);
  }, [callbackError]);

  useEffect(() => {
    const remaining = getAuthEmailCooldownRemainingMs();
    if (remaining > 0) {
      setCooldownMs(remaining);
      setSent(true);
    }

    const tick = window.setInterval(() => {
      const ms = getAuthEmailCooldownRemainingMs();
      setCooldownMs(ms);
    }, 1000);

    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    let cancelled = false;

    const handleSession = async (
      session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]
    ) => {
      if (!session?.user || cancelled || hasHandledSession.current) return;
      hasHandledSession.current = true;
      setResolvingAuth(true);
      try {
        await resolveAuthenticatedRoute();
      } catch {
        setResolvingAuth(false);
        hasHandledSession.current = false;
      }
    };

    void supabase.auth.getSession().then(({ data }) => {
      void handleSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void handleSession(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [configured, resolveAuthenticatedRoute]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured || cooldownActive) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(inviteNext ?? "/onboarding")}`;
      const { error: signError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo },
      });
      if (signError) throw signError;
      setAuthEmailCooldown();
      setCooldownMs(getAuthEmailCooldownRemainingMs());
      setSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not send link";
      if (message === "Failed to fetch") {
        setError(
          "Could not reach Supabase. Check that your project is active (not paused), disable ad blockers for localhost, and confirm NEXT_PUBLIC_SUPABASE_URL in .env.local — then restart npm run dev."
        );
      } else {
        setError(formatAuthError(message));
        if (
          message.toLowerCase().includes("rate limit") ||
          message.toLowerCase().includes("rate_limit")
        ) {
          setAuthEmailCooldown();
          setCooldownMs(getAuthEmailCooldownRemainingMs());
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!configured || !email.trim() || !otpCode.trim()) return;
    setVerifyingCode(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: "email",
      });
      if (verifyError) throw verifyError;
      setResolvingAuth(true);
      await resolveAuthenticatedRoute();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid code";
      setError(formatAuthError(message));
      setResolvingAuth(false);
      hasHandledSession.current = false;
    } finally {
      setVerifyingCode(false);
    }
  }

  function handleUseDifferentEmail() {
    if (cooldownActive) return;
    setSent(false);
    setError(null);
  }

  if (resolvingAuth) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <LoviraLogo className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-8 text-sm text-muted">Signing you in…</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <LoviraLogo className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-6 font-display text-2xl text-foreground">
          Supabase not configured
        </h1>
        <p className="mt-3 text-sm text-muted">
          Copy <code className="text-foreground">.env.example</code> to{" "}
          <code className="text-foreground">.env.local</code>, add your Supabase
          keys, and run the SQL migration in{" "}
          <code className="text-foreground">supabase/migrations/</code>.
        </p>
        <Link href="/" className="mt-8 inline-block text-sm text-primary">
          ← Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <Link href="/" className="flex items-center gap-2 text-foreground">
        <LoviraLogo className="h-8 w-8 text-primary" />
        <span className="font-display text-lg">Lovira</span>
      </Link>

      <h1 className="mt-10 font-display text-2xl tracking-tight text-foreground">
        Sign in with your email
      </h1>
      <p className="mt-2 text-sm text-muted">
        We&apos;ll send a magic link — no password. Your partner will use their
        own email to join you.
      </p>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary-soft/30 px-5 py-6">
          <p className="text-sm text-foreground">
            {sentConfirmationMessage(inviteNext)}
          </p>
          <p className="mt-3 text-sm text-muted">
            Open the link in this same browser (Chrome, Edge, etc.) — not a
            different device or in-app email viewer.
          </p>

          {cooldownActive ? (
            <p className="mt-4 rounded-xl bg-card/80 px-4 py-3 text-center text-sm text-muted">
              Send another link in{" "}
              <span className="font-mono font-medium text-foreground">
                {formatCooldownRemaining(cooldownMs)}
              </span>
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <form
            onSubmit={handleVerifyCode}
            className="mt-6 space-y-3 border-t border-border pt-6"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Or enter code from email
            </p>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\s/g, ""))}
              placeholder="6-digit code"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-center font-mono tracking-widest text-foreground outline-none focus:border-primary/50"
              maxLength={8}
            />
            <button
              type="submit"
              disabled={verifyingCode || otpCode.length < 6}
              className="w-full rounded-full border border-primary/30 py-2.5 text-sm text-primary disabled:opacity-60"
            >
              {verifyingCode ? "Verifying…" : "Continue with code"}
            </button>
          </form>

          <button
            type="button"
            disabled={cooldownActive}
            onClick={handleUseDifferentEmail}
            className="mt-4 text-sm text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/50"
              placeholder="you@example.com"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {cooldownActive ? (
            <p className="text-center text-sm text-muted">
              Try again in{" "}
              <span className="font-mono font-medium text-foreground">
                {formatCooldownRemaining(cooldownMs)}
              </span>
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading || cooldownActive}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading
              ? "Sending…"
              : cooldownActive
                ? `Wait ${formatCooldownRemaining(cooldownMs)}`
                : "Send magic link"}
          </button>
        </form>
      )}

      <p className="mt-10 text-center text-xs text-muted">
        One account per person. Couples share a space after invite.
      </p>
    </div>
  );
}
