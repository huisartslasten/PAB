alter table public.lesson_items
  add column if not exists response_type text not null default 'text',
  add column if not exists answer_options jsonb not null default '[]'::jsonb;

alter table public.lesson_items
  drop constraint if exists lesson_items_response_type_check;

alter table public.lesson_items
  add constraint lesson_items_response_type_check
  check (response_type in ('text', 'number', 'fraction', 'multiple_choice'));
