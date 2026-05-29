# Lovira MVP — Supabase setup

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. Copy **Project URL**, **anon key**, and **service role key**.

## 2. Environment variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Run the migration

In Supabase Dashboard → **SQL** → New query, paste and run:

`supabase/migrations/001_lovira_mvp.sql`

Then run `supabase/migrations/002_service_role_grants.sql` (fixes **permission denied for table couples** on onboarding).

Then run `supabase/migrations/003_partner_thinking_signals.sql` (partner “thinking of you” signal + realtime).

In Supabase → **Database** → **Replication**, ensure `partner_thinking_signals` is enabled for realtime if the migration does not add it automatically.

## 4. Auth settings

In Supabase → **Authentication** → **URL configuration**:

- **Site URL:** `http://localhost:3000` (or your Vercel URL)
- **Redirect URLs:** add `http://localhost:3000/auth/callback`

Enable **Email** provider (magic link is default).

### Magic link loop / “PKCE code verifier not found”

If the email link sends you back to sign-in, the link was opened in a **different browser or port** than where you requested it.

1. Pick **one** dev URL (e.g. `http://localhost:3002`) and always use it.
2. In **URL configuration**, set **Site URL** to that exact URL and add:
   - `http://localhost:3002/auth/callback` (or `:3000` if you use 3000)
3. Request the link in Chrome, then open the email with **Open in Chrome** (not Gmail in-app).
4. Optional (works across browsers): **Authentication → Email Templates → Magic Link** — set the link to:
   ```
   {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email&next=/onboarding
   ```

### Email rate limit exceeded

Supabase’s built-in mailer allows only a few auth emails per hour per project. The app enforces a **60-minute cooldown** after each send attempt so partners aren’t tempted to click repeatedly (which makes limits worse).

**Long-term fix — custom SMTP (removes the low cap):**

1. Sign up at [resend.com](https://resend.com) or [sendgrid.com](https://sendgrid.com)
2. Verify a domain (or use the provider’s dev sender)
3. Supabase → **Authentication** → **Emails** → **SMTP Settings**
4. Enable custom SMTP (Resend: host `smtp.resend.com`, port `465`, user `resend`, password = API key)
5. Set **Sender email** to a verified address
6. **Authentication** → **Rate Limits** → raise “Email sent” if needed
7. Save and send one test magic link

Guide: [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)

## 5. Test the flow

1. `npm run dev`
2. Open `/` → **Get started** → magic link sign-in
3. Onboarding → create couple → copy invite link
4. Second browser/incognito → invite link → partner signs in
5. Dashboard → **Start Together Mode** → partner **Join session**

Success metric: both partners complete reflection; session appears under **Your memories**.
