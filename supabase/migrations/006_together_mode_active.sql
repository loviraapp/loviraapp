-- Track whether a couple currently has a live Together Mode session
alter table public.couples
  add column if not exists together_mode_active boolean not null default false;
