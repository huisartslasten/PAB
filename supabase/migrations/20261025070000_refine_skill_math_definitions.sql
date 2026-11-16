-- Move persisted math Skills to the extensible operand schema.
-- Gemengd is a practice composition, not a Skill definition, so it is removed from this catalog.

update public.skill_definitions
set
  title = 'Optellen tot 20',
  description = 'Optellen met uitkomsten tot 20.',
  definition = '{"kind":"math","operation":"addition","operands":[{"min":1,"max":19},{"min":1,"max":19}],"resultMax":20}'::jsonb,
  updated_at = now()
where id = 'addition-easy';

update public.skill_definitions
set definition = '{"kind":"math","operation":"addition","operands":[{"min":1,"max":99},{"min":1,"max":99}],"resultMax":100}'::jsonb, updated_at = now()
where id = 'addition-100';

update public.skill_definitions
set definition = '{"kind":"math","operation":"addition","operands":[{"min":1,"max":999},{"min":1,"max":999}],"resultMax":1000}'::jsonb, updated_at = now()
where id = 'addition-1000';

update public.skill_definitions
set definition = '{"kind":"math","operation":"addition","operands":[{"min":1,"max":9999},{"min":1,"max":9999}],"resultMax":10000}'::jsonb, updated_at = now()
where id = 'addition-10000';

update public.skill_definitions
set
  title = 'Aftrekken tot 20',
  description = 'Aftrekken met getallen tot 20.',
  definition = '{"kind":"math","operation":"subtraction","operands":[{"min":1,"max":20},{"min":1,"max":20}]}'::jsonb,
  updated_at = now()
where id = 'subtraction-easy';

update public.skill_definitions
set definition = '{"kind":"math","operation":"subtraction","operands":[{"min":1,"max":100},{"min":1,"max":100}]}'::jsonb, updated_at = now()
where id = 'subtraction-100';

update public.skill_definitions
set definition = '{"kind":"math","operation":"subtraction","operands":[{"min":1,"max":1000},{"min":1,"max":1000}]}'::jsonb, updated_at = now()
where id = 'subtraction-1000';

update public.skill_definitions
set definition = '{"kind":"math","operation":"subtraction","operands":[{"min":1,"max":10000},{"min":1,"max":10000}]}'::jsonb, updated_at = now()
where id = 'subtraction-10000';

update public.skill_definitions
set
  title = 'Vermenigvuldigen 2–5',
  description = 'De twee factoren liggen tussen 2 en 5.',
  definition = '{"kind":"math","operation":"multiplication","operands":[{"min":2,"max":5},{"min":2,"max":5}]}'::jsonb,
  updated_at = now()
where id = 'multiplication-easy';

update public.skill_definitions
set definition = '{"kind":"math","operation":"multiplication","operands":[{"min":1,"max":5},{"min":1,"max":5}]}'::jsonb, updated_at = now()
where id = 'multiplication-1-5';

update public.skill_definitions
set definition = '{"kind":"math","operation":"multiplication","operands":[{"min":1,"max":10},{"min":1,"max":10}]}'::jsonb, updated_at = now()
where id = 'multiplication-1-10';

delete from public.skill_definitions
where id = 'math-mixed';

delete from public.games
where key = 'math-mixed'
  and not exists (
    select 1 from public.game_results where game_key = 'math-mixed'
  );
