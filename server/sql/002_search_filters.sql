-- ==========================================================================
-- 002_search_filters.sql
-- --------------------------------------------------------------------------
-- Adds the traditional matrimony filters used by the Search page:
--   minimum age, marital status, sect, education, eating habits,
--   practicing level, smoking/drinking and financial status.
--
-- Run this once in the Supabase SQL editor for an existing project. A fresh
-- project can run 001_init.sql only; it already contains the final function.
-- ==========================================================================

-- Income values are stored as monthly INR amounts everywhere in the product.
comment on column public.profiles.income is 'Monthly income in INR';

-- Remove the original 11-argument function so PostgREST does not keep two
-- overloads with the same name.
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
