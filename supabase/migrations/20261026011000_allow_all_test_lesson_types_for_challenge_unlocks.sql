create or replace function public.list_student_passed_test_lesson_ids(
  p_student text,
  p_minimum_score numeric,
  p_allowed_lesson_types text[]
)
returns table(lesson_id bigint)
language sql
stable
security definer
set search_path to ''
as $function$
  select distinct ta.lesson_id
  from public.test_attempts as ta
  join public.lessons as lesson on lesson.id = ta.lesson_id
  where ta.is_test = true
    and ta.student = nullif(trim(p_student), '')
    and ta.total_questions > 0
    and ta.score >= greatest(coalesce(p_minimum_score, 0), 0)
    and ta.score <= ta.total_questions
    and ta.lesson_id is not null
    and (
      '*' = any(coalesce(p_allowed_lesson_types, '{}'::text[]))
      or lesson.type = any(coalesce(p_allowed_lesson_types, '{}'::text[]))
    )
  order by ta.lesson_id
$function$;
