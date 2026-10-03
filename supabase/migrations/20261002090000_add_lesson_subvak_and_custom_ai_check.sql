alter table public.lessons
  add column if not exists subvak text,
  add column if not exists ai_check_answers boolean not null default false;
