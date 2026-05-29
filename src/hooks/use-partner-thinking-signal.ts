"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ThinkingPayload = {
  sender_id: string;
  receiver_id: string;
  signal_type: string;
  date: string;
};

export function usePartnerThinkingSignal(
  coupleId: string | null,
  forUserId: string | null
) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!coupleId || !forUserId) return;

    let cancelled = false;

    async function loadInitial() {
      const res = await fetch("/api/partner/thinking");
      if (!res.ok) return;
      const data = (await res.json()) as {
        received: { id: string } | null;
      };
      if (!cancelled && data.received?.id) {
        setMessage("Your partner is thinking of you today.");
      }
    }

    loadInitial();

    const supabase = createClient();
    const channel = supabase
      .channel(`partner-signal-${coupleId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "partner_signals",
          filter: `receiver_id=eq.${forUserId}`,
        },
        (payload) => {
          const row = payload.new as ThinkingPayload;
          if (row.receiver_id !== forUserId) return;
          if (row.signal_type === "thinking_of_you") {
            setMessage("Your partner is thinking of you today.");
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [coupleId, forUserId]);

  return message;
}
