-- Partner "thinking of you" signals + her shareable wellness context
-- Conceptual key: lovira_partner_thinking_YYYY-MM-DD per couple/sender/day

create table if not exists public.her_wellness_shares (
  couple_id uuid primary key references public.couples (id) on delete cascade,
  her_user_id uuid not null references public.profiles (id) on delete cascade,
  privacy_setting text not null default 'phase_and_mood'
    check (privacy_setting in ('phase_only', 'phase_and_mood', 'manual')),
  phase_label text,
  phase_day int,
  phase_description text,
  check_in_key text,
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_thinking_signals (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  from_user_id uuid not null references public.profiles (id) on delete cascade,
  for_user_id uuid not null references public.profiles (id) on delete cascade,
  signal_date date not null default (timezone('utc', now()))::date,
  sender_display_name text not null default '',
  created_at timestamptz not null default now(),
  unique (couple_id, from_user_id, signal_date)
);

create index if not exists idx_thinking_couple_date
  on public.partner_thinking_signals (couple_id, signal_date desc);

alter table public.her_wellness_shares enable row level security;
alter table public.partner_thinking_signals enable row level security;

-- Her wellness share: she writes; partner reads
create policy "her_wellness_share_upsert_own"
  on public.her_wellness_shares
  for all
  using (auth.uid() = her_user_id)
  with check (auth.uid() = her_user_id);

create policy "her_wellness_share_select_couple"
  on public.her_wellness_shares
  for select
  using (couple_id in (select public.user_couple_ids()));

-- Thinking signals: couple members read; sender inserts own
create policy "thinking_select_couple"
  on public.partner_thinking_signals
  for select
  using (couple_id in (select public.user_couple_ids()));

create policy "thinking_insert_sender"
  on public.partner_thinking_signals
  for insert
  with check (
    auth.uid() = from_user_id
    and couple_id in (select public.user_couple_ids())
  );

grant select, insert, update, delete on public.her_wellness_shares to authenticated;
grant select, insert on public.partner_thinking_signals to authenticated;
grant all on public.her_wellness_shares to service_role;
grant all on public.partner_thinking_signals to service_role;

-- Realtime: her home listens for new signals
alter publication supabase_realtime add table public.partner_thinking_signals;
