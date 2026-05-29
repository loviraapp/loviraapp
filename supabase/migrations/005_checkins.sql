-- Daily check-ins saved by her, with local backup in browser storage
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  couple_id uuid not null references public.couples (id) on delete cascade,
  checkin_date date not null,
  selection text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

create index if not exists idx_checkins_couple_date
  on public.checkins (couple_id, checkin_date desc);

alter table public.checkins enable row level security;

drop policy if exists "checkins_select_own" on public.checkins;
drop policy if exists "checkins_insert_own" on public.checkins;
drop policy if exists "checkins_update_own" on public.checkins;

create policy "checkins_select_own"
  on public.checkins
  for select
  using (auth.uid() = user_id);

create policy "checkins_insert_own"
  on public.checkins
  for insert
  with check (auth.uid() = user_id and couple_id in (select public.user_couple_ids()));

create policy "checkins_update_own"
  on public.checkins
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.checkins to authenticated;
grant all on public.checkins to service_role;
