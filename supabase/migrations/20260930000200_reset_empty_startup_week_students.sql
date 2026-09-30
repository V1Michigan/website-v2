-- Recreate the empty student table with project_url immediately before project_description.
-- Removes expertise_fields, relocation, additional_project_url, and tally_response_id.
-- Also omits school, grad_year, major, raw, and created_at.
-- CSV imports are supported; the existing Tally webhook requires tally_response_id.
-- Run after the original Startup Week migration; the profile migration is optional.
begin;
set local search_path = public;

-- Prevent writes between the empty-table check and restoration of foreign keys.
lock table public.startup_week_students,
  public.startup_week_preferences,
  public.startup_week_matches,
  public.startup_week_recommendations in access exclusive mode;

do $$
begin
  if exists (select 1 from public.startup_week_students) then
    raise exception 'Student table is not empty. Reset cancelled; no changes made.';
  end if;
end;
$$;

-- Remove only the known foreign keys. Unexpected dependencies abort the reset.
alter table public.startup_week_preferences
  drop constraint if exists startup_week_preferences_student_id_fkey;
alter table public.startup_week_matches
  drop constraint if exists startup_week_matches_student_id_fkey;
alter table public.startup_week_recommendations
  drop constraint if exists startup_week_recommendations_student_id_fkey;

drop table public.startup_week_students;

create table public.startup_week_students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  tier text,
  linkedin_url text,
  resume_url text,
  website_url text,
  github_url text,
  roles text,
  company_types text,
  full_time_seasons text,
  part_time_seasons text,
  expertise text,
  project_url text,
  project_description text
);

create index startup_week_students_email_idx
  on public.startup_week_students (lower(email));

alter table public.startup_week_students enable row level security;
revoke all on table public.startup_week_students from public, anon, authenticated;
grant all on table public.startup_week_students to service_role;

alter table public.startup_week_preferences
  add constraint startup_week_preferences_student_id_fkey
  foreign key (student_id) references public.startup_week_students (id) on delete cascade;
alter table public.startup_week_matches
  add constraint startup_week_matches_student_id_fkey
  foreign key (student_id) references public.startup_week_students (id) on delete cascade;
alter table public.startup_week_recommendations
  add constraint startup_week_recommendations_student_id_fkey
  foreign key (student_id) references public.startup_week_students (id) on delete cascade;

notify pgrst, 'reload schema';
commit;
