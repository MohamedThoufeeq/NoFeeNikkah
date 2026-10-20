-- ============================================================================
-- NoFeeNikkah backend schema
-- Run this file in the Supabase SQL editor (or via `supabase db push`).
-- The backend uses the service-role key and bypasses RLS; the policies below
-- protect the tables if the anon/authenticated keys are ever used directly.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- profiles --
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  email text,
  full_name text not null default '',
  registered_for text not null default '',
  gender text not null default '',
  date_of_birth date,
  blood_group text not null default '',
  marital_status text not null default '',
  children text not null default '',
  children_count integer,
  pwd text not null default '',
  pwd_type text not null default '',
  languages text[] not null default '{}',
  country text not null default '',
  state text not null default '',
  city text not null default '',
  permanent_country text not null default '',
  permanent_state text not null default '',
  permanent_city text not null default '',
  ethnicity text[] not null default '{}',
  education text not null default '',
  ug_course text not null default '',
  pg_course text not null default '',
  occupations text[] not null default '{}',
  income numeric(14, 2),
  company text not null default '',
  work_location text not null default '',
  work_experience integer,
  father_occupations text[] not null default '{}',
  mother_occupations text[] not null default '{}',
  no_of_brothers integer,
  no_of_sisters integer,
  financial_status text not null default '',
  family_living_in text not null default '',
  mobile_number text not null default '',
  parent text not null default '',
  parent_name text not null default '',
  parent_number text not null default '',
  social_links text not null default '',
  about_me text not null default '',
  my_expectation text not null default '',
  quran_verse text not null default '',
  is_revert text not null default '',
  reverted_from text not null default '',
  started_practicing date,
  sect text not null default '',
  salah_pattern text not null default '',
  quran_read text not null default '',
  practicing_level text not null default '',
  scholars text[] not null default '{}',
  inspirations text[] not null default '{}',
  youtube_channels text not null default '',
  social_media_influencers text not null default '',
  political text not null default '',
  hobbies text[] not null default '{}',
  eating_habits text not null default '',
  smoke_and_drink text not null default '',
  partner_educated text not null default '',
  partner_education text not null default '',
  partner_professional text not null default '',
  partner_professions text[] not null default '{}',
  partner_from_age integer,
  partner_to_age integer,
  partner_sect text not null default '',
  partner_country text not null default '',
  partner_state text not null default '',
  partner_city text not null default '',
  image_url text not null default '',
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.profiles.income is 'Monthly income in INR';

create unique index if not exists profiles_username_lower_key
  on public.profiles (lower(username));
create unique index if not exists profiles_email_lower_key
  on public.profiles (lower(email))
  where email is not null and email <> '';

create index if not exists profiles_gender_idx on public.profiles (gender);
create index if not exists profiles_country_idx on public.profiles (country);
create index if not exists profiles_state_idx on public.profiles (state);
create index if not exists profiles_city_idx on public.profiles (city);
create index if not exists profiles_income_idx on public.profiles (income);
create index if not exists profiles_dob_idx on public.profiles (date_of_birth);
create index if not exists profiles_public_created_idx on public.profiles (is_public, created_at desc);
create index if not exists profiles_languages_idx on public.profiles using gin (languages);
create index if not exists profiles_occupations_idx on public.profiles using gin (occupations);

-- ---------------------------------------------------------------- sessions --
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  last_used_at timestamptz not null default now(),
  user_agent text,
  ip_address text,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists sessions_user_idx on public.sessions (user_id);
create index if not exists sessions_expiry_idx on public.sessions (expires_at);
create index if not exists sessions_active_idx
  on public.sessions (token_hash)
  where revoked_at is null;

-- --------------------------------------------------------------- interests --
create table if not exists public.interests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  target_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint interests_no_self check (sender_id <> target_id),
  constraint interests_sender_target_key unique (sender_id, target_id)
);

create index if not exists interests_target_idx on public.interests (target_id);
create index if not exists interests_sender_idx on public.interests (sender_id);

-- -------------------------------------------------------- updated_at trigger --
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists interests_set_updated_at on public.interests;
create trigger interests_set_updated_at
before update on public.interests
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------ profile search --
-- One round trip returns both the page and the total count. Language and
-- occupation filters use case-insensitive partial matching against the arrays.
-- The old 11-argument signature is dropped first so projects upgrading from an
-- earlier version do not end up with two overloads of the same function.
drop function if exists public.search_profiles(
  text, text, text, text, text, text, integer, numeric, uuid, integer, integer
);

create or replace function public.search_profiles(
  p_gender text default null,
  p_country text default null,
  p_state text default null,
  p_city text default null,
  p_language text default null,
  p_occupation text default null,
  p_min_age integer default null,
  p_max_age integer default null,
  p_max_income numeric default null,
  p_marital_status text default null,
  p_sect text default null,
  p_education text default null,
  p_eating_habits text default null,
  p_practicing_level text default null,
  p_smoke_and_drink text default null,
  p_financial_status text default null,
  p_exclude_user uuid default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns table (profile jsonb, total_count bigint)
language sql
stable
security invoker
set search_path = public
as $$
  with filtered as (
    select
      p.*,
      count(*) over() as total_count
    from public.profiles p
    where p.is_public = true
      and (p_exclude_user is null or p.id <> p_exclude_user)
      and (p_gender is null or p.gender = p_gender)
      and (p_country is null or p.country = p_country)
      and (p_state is null or p.state = p_state)
      and (p_city is null or p.city = p_city)
      and (
        p_language is null
        or exists (
          select 1
          from unnest(p.languages) as lang
          where lang ilike '%' || p_language || '%'
        )
      )
      and (
        p_occupation is null
        or exists (
          select 1
          from unnest(p.occupations) as occupation
          where occupation ilike '%' || p_occupation || '%'
        )
      )
      and (
        p_min_age is null
        or p.date_of_birth <= (current_date - make_interval(years => p_min_age))::date
      )
      and (
        p_max_age is null
        or p.date_of_birth >=
          (current_date - make_interval(years => p_max_age + 1))::date + 1
      )
      and (p_max_income is null or p.income <= p_max_income)
      and (p_marital_status is null or p.marital_status = p_marital_status)
      and (p_sect is null or p.sect = p_sect)
      and (p_education is null or p.education = p_education)
      and (p_eating_habits is null or p.eating_habits = p_eating_habits)
      and (p_practicing_level is null or p.practicing_level = p_practicing_level)
      and (p_smoke_and_drink is null or p.smoke_and_drink = p_smoke_and_drink)
      and (p_financial_status is null or p.financial_status = p_financial_status)
    order by p.created_at desc
    limit greatest(1, least(coalesce(p_limit, 20), 100))
    offset greatest(0, coalesce(p_offset, 0))
  )
  select
    to_jsonb(filtered) - 'total_count',
    filtered.total_count
  from filtered;
$$;

revoke all on function public.search_profiles(
  text, text, text, text, text, text, integer, integer, numeric, text, text, text,
  text, text, text, text, uuid, integer, integer
) from public;
grant execute on function public.search_profiles(
  text, text, text, text, text, text, integer, integer, numeric, text, text, text,
  text, text, text, text, uuid, integer, integer
) to service_role;

-- ------------------------------------------------------------------- RLS ----
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.interests enable row level security;

drop policy if exists profiles_select_public_or_own on public.profiles;
create policy profiles_select_public_or_own
on public.profiles for select
to authenticated
using (is_public or auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists profiles_delete_own on public.profiles;
create policy profiles_delete_own
on public.profiles for delete
to authenticated
using (auth.uid() = id);

-- Sessions are backend-only. RLS with no policies denies anon/authenticated
-- access while the service role continues to work.
drop policy if exists sessions_owner_select on public.sessions;

drop policy if exists interests_participant_select on public.interests;
create policy interests_participant_select
on public.interests for select
to authenticated
using (auth.uid() = sender_id or auth.uid() = target_id);

drop policy if exists interests_sender_insert on public.interests;
create policy interests_sender_insert
on public.interests for insert
to authenticated
with check (auth.uid() = sender_id);

drop policy if exists interests_target_update on public.interests;
create policy interests_target_update
on public.interests for update
to authenticated
using (auth.uid() = target_id)
with check (auth.uid() = target_id);

drop policy if exists interests_sender_delete on public.interests;
create policy interests_sender_delete
on public.interests for delete
to authenticated
using (auth.uid() = sender_id);

-- ------------------------------------------------------------ housekeeping --
create or replace function public.delete_expired_sessions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.sessions
  where expires_at <= now() or revoked_at is not null;
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.delete_expired_sessions() from public;
grant execute on function public.delete_expired_sessions() to service_role;

-- Optional: schedule the cleanup if pg_cron is enabled.
-- select cron.schedule('nofeenikkah-cleanup-sessions', '0 * * * *', $$select public.delete_expired_sessions()$$);
