-- Manage the allowlist through the Supabase Table Editor or SQL Editor.
-- One lowercase Google account email per row. No env email list is needed.
-- Example: insert into public.startup_week_admins(email) values ('you@umich.edu');
begin;
create table if not exists public.startup_week_admins (
  email text primary key check (
    email = lower(btrim(email)) and email like '%@%' and length(email) > 3
  ),
  created_at timestamptz not null default now()
);
alter table public.startup_week_admins enable row level security;
revoke all on table public.startup_week_admins from public, anon, authenticated;
grant select, insert, update, delete on table public.startup_week_admins to service_role;
commit;
