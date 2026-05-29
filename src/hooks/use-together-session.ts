"use client";

import { useCallback, useEffect, useState } from "react";
import type { TogetherSessionRow } from "@/types/together-session";

export function useTogetherSession(sessionId: string | null, pollMs = 2000) {
  const [session, setSession] = useState<TogetherSessionRow | null>(null);
  const [reflections, setReflections] = useState<
    { user_id: string; feelings: string[] }[]
  >([]);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [userId, setUserId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!sessionId) return;
    const res = await fetch(`/api/session/${sessionId}`);
    if (!res.ok) return;
    const data = await res.json();
    const s = data.session;
    setSession(s);
    setReflections(
      (s?.session_reflections as { user_id: string; feelings: string[] }[]) ?? []
    );
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setUserId(d.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    refresh();
    const id = window.setInterval(refresh, pollMs);
    return () => window.clearInterval(id);
  }, [sessionId, pollMs, refresh]);

  const patch = useCallback(
    async (body: Record<string, unknown>) => {
      if (!sessionId) return null;
      const res = await fetch(`/api/session/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) setSession(data.session);
      return data.session;
    },
    [sessionId]
  );

  const join = useCallback(async () => {
    if (!sessionId) return;
    await fetch(`/api/session/${sessionId}/join`, { method: "POST" });
    await refresh();
  }, [sessionId, refresh]);

  const isHost = session && userId ? session.host_user_id === userId : false;
  const partnerJoined = Boolean(session?.partner_joined_at);

  return {
    session,
    reflections,
    loading,
    userId,
    isHost,
    partnerJoined,
    refresh,
    patch,
    join,
  };
}
