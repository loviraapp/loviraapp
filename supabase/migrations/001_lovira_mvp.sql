-- Lovira MVP: weekly Together Mode between two partners
-- Run in Supabase SQL editor (Dashboard → SQL → New query)

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

-- Couple space
create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'active')),
  created_at timestamptz not null default now()
);

create table if not exists public.couple_members (
  couple_id uuid not null references public.couples (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('owner', 'partner')),
  display_name text not null default '',
  joined_at timestamptz not null default now(),
  primary key (couple_id, user_id)
);

-- Together sessions (host drives step; partner syncs via poll)
create table if not exists public.together_sessions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  host_user_id uuid not null references public.profiles (id),
  activity_id text not null default 'talk',
  duration_minutes int not null default 15,
  opening_prompt text not null default '',
  status text not null default 'waiting'
    check (status in ('waiting', 'activity', 'prompt', 'presence', 'reflection', 'completed')),
  partner_user_id uuid references public.profiles (id),
  partner_joined_at timestamptz,
  presence_started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.session_reflections (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.together_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  feelings text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (session_id, user_id)
);

create index if not exists idx_couples_invite_code on public.couples (invite_code);
create index if not exists idx_sessions_couple_created on public.together_sessions (couple_id, created_at desc);
create index if not exists idx_members_user on public.couple_members (user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'You')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.together_sessions enable row level security;
alter table public.session_reflections enable row level security;

create or replace function public.user_couple_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select couple_id from public.couple_members where user_id = auth.uid();
$$;

-- Profiles: read/update own
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Couples: members can read their couple
create policy "couples_select_member" on public.couples
  for select using (id in (select public.user_couple_ids()));

-- Couple members: see co-members
create policy "couple_members_select" on public.couple_members
  for select using (couple_id in (select public.user_couple_ids()));
create policy "couple_members_insert_self" on public.couple_members
  for insert with check (auth.uid() = user_id);

-- Sessions: couple members
create policy "sessions_select_member" on public.together_sessions
  for select using (couple_id in (select public.user_couple_ids()));
create policy "sessions_insert_member" on public.together_sessions
  for insert with check (
    couple_id in (select public.user_couple_ids())
    and auth.uid() = host_user_id
  );
create policy "sessions_update_member" on public.together_sessions
  for update using (couple_id in (select public.user_couple_ids()));

-- Reflections: own insert + couple can read all for their sessions
create policy "reflections_select_member" on public.session_reflections
  for select using (
    session_id in (
      select id from public.together_sessions
      where couple_id in (select public.user_couple_ids())
    )
  );
create policy "reflections_insert_own" on public.session_reflections
  for insert with check (auth.uid() = user_id);

-- Allow couple creation (owner inserts couple + self as member via service role in API)
-- For client: use service role in API routes only for create couple

grant usage on schema public to anon, authenticated;
grant select, insert, update on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
