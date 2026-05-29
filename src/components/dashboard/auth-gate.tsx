"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";

type AuthGateProps = { children: React.ReactNode };

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          router.replace("/auth");
          return;
        }
        if (!data.couple) {
          router.replace("/onboarding");
          return;
        }
        setReady(true);
      })
      .catch(() => setReady(true));
  }, [router]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="font-display text-xl text-foreground">Setup required</p>
        <p className="mt-2 text-sm text-muted">
          Add Supabase keys to <code>.env.local</code> and run the migration in{" "}
          <code>supabase/migrations/</code>.
        </p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-md animate-pulse px-5 py-12">
        <div className="h-8 w-32 rounded-lg bg-border/80" />
      </div>
    );
  }

  return <>{children}</>;
}
