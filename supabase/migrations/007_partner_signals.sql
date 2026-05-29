create table if not exists public.partner_signals (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references public.couples(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete cascade,
  receiver_id uuid references auth.users(id) on delete cascade,
  signal_type text not null,
  date date not null,
  created_at timestamptz default now()
);

create unique index if not exists idx_partner_signals_daily_unique
  on public.partner_signals (couple_id, sender_id, receiver_id, signal_type, date);

alter table public.partner_signals enable row level security;

drop policy if exists "Partners can insert signals" on public.partner_signals;
create policy "Partners can insert signals"
on public.partner_signals for insert
with check (auth.uid() = sender_id);

drop policy if exists "Partners can read their signals" on public.partner_signals;
create policy "Partners can read their signals"
on public.partner_signals for select
using (auth.uid() = receiver_id or auth.uid() = sender_id);

grant select, insert on public.partner_signals to authenticated;
grant all on public.partner_signals to service_role;

do $$
begin
  alter publication supabase_realtime add table public.partner_signals;
exception
  when duplicate_object then null;
end $$;
