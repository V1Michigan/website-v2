alter table public.startup_week_companies
  add column if not exists company_question text;

notify pgrst, 'reload schema';
