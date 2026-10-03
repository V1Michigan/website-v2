begin;
alter table public.startup_week_companies
  add column if not exists shortlist_version uuid not null default gen_random_uuid();

-- Return the revision and all picks from the same database snapshot.
create or replace function public.startup_week_read_shortlist(target_company uuid)
returns jsonb language sql stable security invoker set search_path = public as $$
  select jsonb_build_object('version', c.shortlist_version, 'preferences',
    coalesce((select jsonb_agg(jsonb_build_object('student_id', p.student_id, 'rank', p.rank, 'note', p.note) order by p.rank nulls last, p.student_id)
      from startup_week_preferences p where p.company_id = c.id), '[]'::jsonb))
  from startup_week_companies c where c.id = target_company;
$$;

create or replace function public.startup_week_save_shortlist(target_company uuid, picks jsonb, expected_version uuid)
returns uuid language plpgsql security invoker set search_path = public as $$
declare current_version uuid; next_version uuid;
begin
  select shortlist_version into current_version from startup_week_companies where id = target_company for update;
  if not found then raise exception 'Company not found'; end if;
  if expected_version is distinct from current_version then
    raise exception using errcode = 'P0001', message = 'Shortlist changed';
  end if;
  if jsonb_typeof(picks) is distinct from 'array' then raise exception 'Expected picks array'; end if;
  delete from startup_week_preferences where company_id = target_company;
  insert into startup_week_preferences (company_id, student_id, rank, note)
    select target_company, p.student_id, p.rank, p.note
    from jsonb_to_recordset(picks) as p(student_id uuid, rank integer, note text);
  next_version := gen_random_uuid();
  update startup_week_companies set shortlist_version = next_version where id = target_company;
  return next_version;
end;
$$;

-- Old open clients must not bypass the revision check through the former API.
create or replace function public.startup_week_replace_preferences(target_company uuid, picks jsonb)
returns void language plpgsql security invoker set search_path = public as $$
begin
  raise exception 'Please refresh the portal before saving. Versioned shortlist saves are required.';
end;
$$;
revoke all on function public.startup_week_read_shortlist(uuid) from public, anon, authenticated;
revoke all on function public.startup_week_save_shortlist(uuid, jsonb, uuid) from public, anon, authenticated;
grant execute on function public.startup_week_read_shortlist(uuid) to service_role;
grant execute on function public.startup_week_save_shortlist(uuid, jsonb, uuid) to service_role;
notify pgrst, 'reload schema';
commit;
