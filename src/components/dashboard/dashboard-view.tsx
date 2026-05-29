"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CoupleContext } from "@/types/together-session";
import type { TogetherSessionRow } from "@/types/together-session";
import { isHerOnboardingComplete } from "@/lib/her-wellness-storage";
import { HerLiveHome } from "./her-live-home";
import { PartnerLiveHome } from "./partner-live-home";

type MeResponse = {
  user: { id: string; email?: string } | null;
  couple: CoupleContext | null;
};

type SessionsResponse = {
  active: TogetherSessionRow | null;
  sessions: TogetherSessionRow[];
};

export function DashboardView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [sessions, setSessions] = useState<SessionsResponse | null>(null);

  const load = useCallback(async () => {
    const [meRes, sessRes] = await Promise.all([
      fetch("/api/me"),
      fetch("/api/session"),
    ]);
    const meData = (await meRes.json()) as MeResponse;
    const sessData = (await sessRes.json()) as SessionsResponse;

    if (!meData.user) {
      router.replace("/auth");
      return;
    }
    if (!meData.couple) {
      router.replace("/onboarding");
      return;
    }

    const myMember = meData.couple.members.find(
      (m) => m.user_id === meData.user?.id
    );
    const isPartner = myMember?.role === "partner";
    if (!isPartner && !isHerOnboardingComplete()) {
      router.replace("/onboarding");
      return;
    }

    setMe(meData);
    setSessions(sessData);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="her-wellness mx-auto max-w-md px-5 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded-lg bg-border/60" />
          <div className="h-44 rounded-3xl bg-[var(--her-accent-soft)]" />
        </div>
      </div>
    );
  }

  if (!me?.couple || !sessions) {
    return null;
  }

  const myMember = me.couple.members.find((m) => m.user_id === me.user?.id);
  const displayName = myMember?.display_name ?? "You";
  const isPartner = myMember?.role === "partner";

  if (isPartner) {
    return (
      <PartnerLiveHome
        displayName={displayName}
        partnerName={me.couple.partnerName}
        couple={me.couple}
        myUserId={me.user?.id ?? ""}
        sessions={sessions.sessions}
        activeSession={sessions.active}
      />
    );
  }

  return (
    <HerLiveHome
      displayName={displayName}
      partnerName={me.couple.partnerName}
      couple={me.couple}
      myUserId={me.user?.id ?? ""}
      sessions={sessions.sessions}
      activeSession={sessions.active}
    />
  );
}
