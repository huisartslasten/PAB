alter table public.lesson_items
  add column if not exists question_parts jsonb not null default '[]'::jsonb,
  add column if not exists answer_parts jsonb not null default '[]'::jsonb;

update public.lesson_items
set
  question_parts = case
    when coalesce(trim(question), '') = '' then '[]'::jsonb
    else to_jsonb(string_to_array(question, E'\n'))
  end,
  answer_parts = case
    when coalesce(trim(answer), '') = '' then '[]'::jsonb
    else (
      select coalesce(jsonb_agg(jsonb_build_object('text', part, 'role', 'answer') order by ord), '[]'::jsonb)
      from unnest(string_to_array(answer, E'\n')) with ordinality as value(part, ord)
      where trim(part) <> ''
    )
  end;
