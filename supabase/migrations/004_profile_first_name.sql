-- Personal first name (wellness welcome); display_name remains partner-visible label
alter table public.profiles
  add column if not exists first_name text;
alter table public.profiles
  add column if not exists lovira_onboarding_complete boolean not null default false;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, first_name, lovira_onboarding_complete)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'You'),
    nullif(trim(coalesce(new.raw_user_meta_data->>'first_name', '')), ''),
    false
  );
  return new;
end;
$$;
