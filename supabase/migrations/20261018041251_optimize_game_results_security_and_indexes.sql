create index game_results_lesson_idx
  on public.game_results (lesson_id);

drop policy "Parents can view game results" on public.game_results;

create policy "Parents can view game results"
  on public.game_results
  for select
  to authenticated
  using ((select auth.uid()) = 'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid);
