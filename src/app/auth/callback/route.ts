import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/server";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

async function getPostAuthPath(userId: string): Promise<string> {
  const admin = createServiceClient();
  const { data, error } = await admin
    .from("profiles")
    .select("lovira_onboarding_complete")
    .eq("id", userId)
    .maybeSingle();
  if (error) return "/onboarding";
  return data?.lovira_onboarding_complete ? "/dashboard" : "/onboarding";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash =
    searchParams.get("token_hash") ?? searchParams.get("token");
  const type = searchParams.get("type") as EmailOtpType | null;
  const requestedNext = safeNextPath(searchParams.get("next"));

  const cookieStore = await cookies();
  let response = NextResponse.redirect(`${origin}${requestedNext}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  let authError: Error | null = null;

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) authError = error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) authError = error;
  } else {
    return NextResponse.redirect(`${origin}/auth?error=auth`);
  }

  if (authError) {
    const message = encodeURIComponent(authError.message);
    return NextResponse.redirect(`${origin}/auth?error=auth&message=${message}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const nextPath = user
    ? await getPostAuthPath(user.id)
    : "/onboarding";
  response = NextResponse.redirect(`${origin}${nextPath}`);

  return response;
}
