-- Supplemental form data, joined to the original student roster by email.
-- Does not delete or modify existing student rows or response columns.
begin;
create table if not exists public.startup_week_student_details (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (btrim(email) <> ''),
  interested text,
  year text check (year in ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Masters', 'PhD', 'New Grad')),
  work_authorization text,
  advanced_spade_company_response text,
  agentmail_response text,
  asi_response text,
  authentic_insurance_response text,
  dryft_response text,
  embedder_response text,
  khosla_ventures_response text,
  latent_variables_response text,
  lumaril_response text,
  miter_response text,
  monaco_response text,
  phoebe_response text,
  rational_response text,
  scope_health_response text,
  spacexai_response text,
  tavus_response text
);

create or replace function public.startup_week_normalize_detail_email()
returns trigger language plpgsql set search_path = public as $$
begin
  new.email := lower(btrim(new.email));
  new.year := nullif(btrim(new.year), '');
  return new;
end;
$$;

drop trigger if exists normalize_student_detail_email on public.startup_week_student_details;
create trigger normalize_student_detail_email
before insert or update on public.startup_week_student_details
for each row execute function public.startup_week_normalize_detail_email();

alter table public.startup_week_student_details enable row level security;
revoke all on table public.startup_week_student_details from public, anon, authenticated;
grant all on table public.startup_week_student_details to service_role;
notify pgrst, 'reload schema';
commit;
