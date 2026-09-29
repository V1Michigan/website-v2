-- Apply to the existing website Supabase project before using /admin.
-- Company portals: /startupweek/company/<slug>. Tally: /api/startup-week/tally/webhook.
-- This adds new tables; it does not migrate data from another Supabase project.
begin;
set local search_path = public;

-- Startup Week platform schema (Supabase / Postgres)
-- Run this in the Supabase SQL editor to provision the backend.
--
-- Core entities:
--   startup_week_students     -- one row per resume ingested from Tally
--   startup_week_companies    -- participating startups
--   startup_week_preferences  -- a company's interest in a student (their "pick list")
--   startup_week_matches      -- confirmed student<->company pairings + email state

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Students (sourced from the Tally resume form)
-- ---------------------------------------------------------------------------
create table if not exists startup_week_students (
  id                uuid primary key default gen_random_uuid(),
  tally_response_id text unique,                 -- dedupe key from Tally
  name              text not null,
  email             text not null,
  school            text,
  grad_year         text,
  major             text,
  resume_url        text,                        -- link to uploaded resume file
  raw               jsonb,                       -- full Tally payload for reference
  created_at        timestamptz not null default now()
);

create index if not exists startup_week_students_email_idx on startup_week_students (lower(email));

-- ---------------------------------------------------------------------------
-- Companies (participating startups)
-- ---------------------------------------------------------------------------
create table if not exists startup_week_companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique not null,            -- used in company-facing URLs
  contact_email text not null,
  description   text,                            -- what they do / who they want (for AI pairing)
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Preferences (a company's ranked interest in startup_week_students)
-- ---------------------------------------------------------------------------
create table if not exists startup_week_preferences (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid not null references startup_week_companies (id) on delete cascade,
  student_id uuid not null references startup_week_students (id) on delete cascade,
  rank       integer,                            -- lower = higher priority
  note       text,
  created_at timestamptz not null default now(),
  unique (company_id, student_id)
);

create index if not exists startup_week_preferences_company_idx on startup_week_preferences (company_id);

-- ---------------------------------------------------------------------------
-- Matches (confirmed pairings + email outreach state)
-- ---------------------------------------------------------------------------
do $$ begin
  create type startup_week_match_status as enum ('pending', 'scheduled', 'sent', 'cancelled');
exception when duplicate_object then null; end $$;

create table if not exists startup_week_matches (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references startup_week_companies (id) on delete cascade,
  student_id      uuid not null references startup_week_students (id) on delete cascade,
  status          startup_week_match_status not null default 'pending',
  email_send_at   timestamptz,                   -- when the outreach email should go out
  email_sent_at   timestamptz,                   -- when it actually went out
  created_at      timestamptz not null default now(),
  unique (company_id, student_id)
);

create index if not exists startup_week_matches_status_idx on startup_week_matches (status);

-- ---------------------------------------------------------------------------
-- Recommendations (admin-curated student <-> company "good fit" links)
-- ---------------------------------------------------------------------------
create table if not exists startup_week_recommendations (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references startup_week_students (id) on delete cascade,
  company_id uuid not null references startup_week_companies (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (student_id, company_id)
);

create index if not exists startup_week_recommendations_company_idx on startup_week_recommendations (company_id);

-- Fresh installs are private immediately; server APIs use service_role.
alter table startup_week_students enable row level security;
alter table startup_week_companies enable row level security;
alter table startup_week_preferences enable row level security;
alter table startup_week_matches enable row level security;
alter table startup_week_recommendations enable row level security;


-- Run after schema.sql, before deploying the API changes.
-- Each call is a transaction: invalid rows roll back the entire replacement.
-- Lock the parent row to serialize simultaneous saves for the same owner.
create or replace function public.startup_week_replace_preferences(target_company uuid, picks jsonb)
returns void language plpgsql security invoker set search_path = public as $$
begin
  perform id from startup_week_companies where id = target_company for update;
  if not found then raise exception 'Company not found'; end if;
  if jsonb_typeof(picks) is distinct from 'array' then
    raise exception 'Expected picks array';
  end if;
  delete from startup_week_preferences where company_id = target_company;
  insert into startup_week_preferences (company_id, student_id, rank, note)
  select target_company, p.student_id, p.rank, p.note
  from jsonb_to_recordset(picks) as p(student_id uuid, rank integer, note text);
end;
$$;

create or replace function public.startup_week_replace_recommendations(target_student uuid, company_ids uuid[])
returns void language plpgsql security invoker set search_path = public as $$
begin
  perform id from startup_week_students where id = target_student for update;
  if not found then raise exception 'Student not found'; end if;
  if company_ids is null then raise exception 'Expected company IDs'; end if;
  delete from startup_week_recommendations where student_id = target_student;
  insert into startup_week_recommendations (student_id, company_id)
  select target_student, unnest(company_ids);
end;
$$;

revoke all on function public.startup_week_replace_preferences(uuid, jsonb) from public, anon, authenticated;
revoke all on function public.startup_week_replace_recommendations(uuid, uuid[]) from public, anon, authenticated;
grant execute on function public.startup_week_replace_preferences(uuid, jsonb) to service_role;
grant execute on function public.startup_week_replace_recommendations(uuid, uuid[]) to service_role;


-- Run before deploying the notification worker. Claims persist across crashes.
-- Ambiguous sends are held for operator review, never automatically re-sent.
alter table public.startup_week_matches add column if not exists email_claimed_at timestamptz;
alter table public.startup_week_matches add column if not exists email_error text;
alter table public.startup_week_matches add column if not exists email_provider_id text;

create or replace function public.startup_week_claim_match_email()
returns setof public.startup_week_matches language sql security invoker set search_path = public as $$
  update startup_week_matches set email_claimed_at = now(), email_error = null
  where id = (
    select id from startup_week_matches
    where status in ('pending', 'scheduled')
      and (email_send_at is null or email_send_at <= now())
      and email_claimed_at is null
    order by created_at, id
    for update skip locked limit 1
  ) returning *;
$$;
revoke all on function public.startup_week_claim_match_email() from public, anon, authenticated;
grant execute on function public.startup_week_claim_match_email() to service_role;


revoke all on table public.startup_week_students from anon, authenticated;
grant all on table public.startup_week_students to service_role;
revoke all on table public.startup_week_companies from anon, authenticated;
grant all on table public.startup_week_companies to service_role;
revoke all on table public.startup_week_preferences from anon, authenticated;
grant all on table public.startup_week_preferences to service_role;
revoke all on table public.startup_week_matches from anon, authenticated;
grant all on table public.startup_week_matches to service_role;
revoke all on table public.startup_week_recommendations from anon, authenticated;
grant all on table public.startup_week_recommendations to service_role;
commit;
