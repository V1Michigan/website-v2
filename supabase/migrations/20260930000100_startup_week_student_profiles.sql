-- Additive fields for the Startup Week student CSV. Multi-select answers stay
-- comma-separated text for Supabase CSV import; APIs return parsed arrays.
-- Existing student IDs, matching relationships, and access policies are unchanged.
alter table public.startup_week_students
  add column if not exists tier text,
  add column if not exists linkedin_url text,
  add column if not exists website_url text,
  add column if not exists github_url text,
  add column if not exists roles text,
  add column if not exists company_types text,
  add column if not exists full_time_seasons text,
  add column if not exists part_time_seasons text,
  add column if not exists expertise text,
  add column if not exists project_url text,
  add column if not exists project_description text;
