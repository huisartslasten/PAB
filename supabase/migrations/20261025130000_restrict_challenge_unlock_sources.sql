-- Challenge unlocks are opt-in by source type.
-- An empty source list must never unlock a Challenge from an arbitrary assessment.

drop function if exists public.list_student_passed_test_lesson_ids(text, numeric);

create or replace function public.list_student_passed_test_lesson_ids(
  p_student text,
  p_minimum_score numeric,
  p_allowed_lesson_types text[]
)
returns table (lesson_id bigint)
language sql
security definer
set search_path = ''
stable
as $$
  select distinct ta.lesson_id
  from public.test_attempts as ta
  join public.lessons as lesson on lesson.id = ta.lesson_id
  where ta.is_test = true
    and ta.student = nullif(trim(p_student), '')
    and ta.total_questions > 0
    and ta.score >= greatest(coalesce(p_minimum_score, 0), 0)
    and ta.score <= ta.total_questions
    and ta.lesson_id is not null
    and lesson.type = any(coalesce(p_allowed_lesson_types, '{}'::text[]))
  order by ta.lesson_id
$$;

revoke all on function public.list_student_passed_test_lesson_ids(text, numeric, text[]) from public;
grant execute on function public.list_student_passed_test_lesson_ids(text, numeric, text[]) to anon, authenticated;

update public.challenge_configurations
set unlock_policy = jsonb_set(
  unlock_policy,
  '{allowedLessonTypes}',
  '["dictation"]'::jsonb,
  true
)
where challenge_key = 'millionaire';
