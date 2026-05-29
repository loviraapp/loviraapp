-- Fix: "permission denied for table couples" when API uses service_role
-- Run in Supabase SQL editor if couple creation fails on onboarding

grant usage on schema public to service_role;

grant all on table public.profiles to service_role;
grant all on table public.couples to service_role;
grant all on table public.couple_members to service_role;
grant all on table public.together_sessions to service_role;
grant all on table public.session_reflections to service_role;

grant all on all sequences in schema public to service_role;
