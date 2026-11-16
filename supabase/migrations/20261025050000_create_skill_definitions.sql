-- Canonical persisted Skill definitions.
-- The Skill Editor owns these definitions; learner assignments remain a separate concern.

create table public.skill_definitions (
  id text primary key,
  category text not null,
  title text not null,
  description text not null default '',
  definition jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index skill_definitions_category_sort_idx
  on public.skill_definitions (category, sort_order, id);

alter table public.skill_definitions enable row level security;

create policy "Public can read skill definitions"
  on public.skill_definitions
  for select
  to anon, authenticated
  using (true);

create policy "Parents can manage skill definitions"
  on public.skill_definitions
  for all
  to authenticated
  using ((select auth.uid()) in (
    '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
    '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid,
    'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid
  ))
  with check ((select auth.uid()) in (
    '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
    '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid,
    'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid
  ));

insert into public.skill_definitions (id, category, title, description, definition, sort_order)
values
  ('addition-easy', 'math', 'Makkelijk', 'Optellen op een laag niveau.', '{"kind":"math","operation":"addition","operandMin":1,"resultMax":20}'::jsonb, 10),
  ('addition-100', 'math', 'Tot 100', 'Optellen tot 100.', '{"kind":"math","operation":"addition","operandMin":1,"resultMax":100}'::jsonb, 20),
  ('addition-1000', 'math', 'Tot 1.000', 'Optellen tot 1.000.', '{"kind":"math","operation":"addition","operandMin":1,"resultMax":1000}'::jsonb, 30),
  ('addition-10000', 'math', 'Tot 10.000', 'Optellen tot 10.000.', '{"kind":"math","operation":"addition","operandMin":1,"resultMax":10000}'::jsonb, 40),
  ('subtraction-easy', 'math', 'Makkelijk', 'Aftrekken op een laag niveau.', '{"kind":"math","operation":"subtraction","operandMin":0,"resultMax":20}'::jsonb, 50),
  ('subtraction-100', 'math', 'Tot 100', 'Aftrekken tot 100.', '{"kind":"math","operation":"subtraction","operandMin":0,"resultMax":100}'::jsonb, 60),
  ('subtraction-1000', 'math', 'Tot 1.000', 'Aftrekken tot 1.000.', '{"kind":"math","operation":"subtraction","operandMin":0,"resultMax":1000}'::jsonb, 70),
  ('subtraction-10000', 'math', 'Tot 10.000', 'Aftrekken tot 10.000.', '{"kind":"math","operation":"subtraction","operandMin":0,"resultMax":10000}'::jsonb, 80),
  ('multiplication-easy', 'math', 'Makkelijk', 'Vermenigvuldigen op een laag niveau.', '{"kind":"math","operation":"multiplication","factorMin":2,"factorMax":5}'::jsonb, 90),
  ('multiplication-1-5', 'math', 'Tafels 1–5', 'De tafels van 1 tot en met 5.', '{"kind":"math","operation":"multiplication","factorMin":1,"factorMax":5}'::jsonb, 100),
  ('multiplication-1-10', 'math', 'Tafels 1–10', 'De tafels van 1 tot en met 10.', '{"kind":"math","operation":"multiplication","factorMin":1,"factorMax":10}'::jsonb, 110),
  ('math-mixed', 'math', 'Gemengd', 'Een mix van geselecteerde rekenprofielen.', '{"kind":"mixed","profileIds":["addition-easy","addition-100","addition-1000","addition-10000","subtraction-easy","subtraction-100","subtraction-1000","subtraction-10000","multiplication-easy","multiplication-1-5","multiplication-1-10"]}'::jsonb, 120)
on conflict (id) do nothing;

insert into public.games (key, name)
select id, 'Skill — ' || title
from public.skill_definitions
on conflict (key) do nothing;
