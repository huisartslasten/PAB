create or replace function public.list_student_passed_test_lesson_ids(p_student text, p_minimum_score numeric)
returns table (lesson_id bigint)
language sql
security definer
set search_path = ''
stable
as $$
  select distinct ta.lesson_id
  from public.test_attempts as ta
  where ta.is_test = true
    and ta.student = nullif(trim(p_student), '')
    and ta.total_questions > 0
    and ta.score >= greatest(coalesce(p_minimum_score, 0), 0)
    and ta.score <= ta.total_questions
    and ta.lesson_id is not null
  order by ta.lesson_id
$$;

revoke all on function public.list_student_passed_test_lesson_ids(text, numeric) from public;
grant execute on function public.list_student_passed_test_lesson_ids(text, numeric) to anon, authenticated;
