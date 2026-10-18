-- Game results belong to a lesson. Removing the lesson must remove its
-- historical game results as well; the central games catalog remains intact.

alter table public.game_results
  drop constraint game_results_lesson_id_fkey;

alter table public.game_results
  add constraint game_results_lesson_id_fkey
  foreign key (lesson_id)
  references public.lessons(id)
  on delete cascade;
