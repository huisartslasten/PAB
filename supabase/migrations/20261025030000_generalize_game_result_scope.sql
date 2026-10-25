-- Game results are activity-scoped by default and may optionally be scoped to a lesson.
-- This keeps the canonical game-result persistence boundary reusable for
-- lesson-based games and independent Skills without introducing a second service.

alter table public.game_results
  alter column lesson_id drop not null;

create index game_results_game_student_idx
  on public.game_results (game_id, student);

insert into public.games (key, name)
values
  ('math-skill-subtraction', 'Skill Rekenen — Aftellen'),
  ('math-skill-addition', 'Skill Rekenen — Optellen'),
  ('math-skill-multiplication', 'Skill Rekenen — Vermenigvuldigen'),
  ('math-skill-mixed', 'Skill Rekenen — Gemengd')
on conflict (key) do nothing;
