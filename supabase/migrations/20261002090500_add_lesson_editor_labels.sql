alter table public.lessons
  add column if not exists editor_labels jsonb;
