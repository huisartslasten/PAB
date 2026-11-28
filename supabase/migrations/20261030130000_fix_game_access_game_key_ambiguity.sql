create or replace function public.get_game_access(p_student text)
returns table(game_key text, unlocked boolean, cycle integer, required_tests integer, minimum_score integer, credited_tests integer)
language sql
stable
set search_path to 'public'
as $function$
  with settings as (
    select coalesce(nullif(trim(p_student), ''), '') as student,
      coalesce(s.required_tests, 10) as required_tests,
      coalesce(s.minimum_score, 9) as minimum_score,
      coalesce(c.cycle, 1) as cycle
    from (select 1) seed
    left join public.game_access_settings s on s.student = trim(p_student)
    left join public.game_access_cycles c on c.student = trim(p_student)
  ),
  credited as (
    select count(*)::integer as credited_tests
    from public.game_access_cycle_tests ct
    where ct.student = trim(p_student)
      and ct.cycle = (select cycle from settings)
  ),
  games as (
    select gas.game_key as stored_game_key, gas.unlocked
    from public.game_access_state gas
    where gas.student = trim(p_student)
  )
  select catalog.game_key,
    case when catalog.game_key = 'double-or-nothing' then true else coalesce(g.unlocked, false) end,
    settings.cycle, settings.required_tests, settings.minimum_score, credited.credited_tests
  from (values ('double-or-nothing'), ('memory'), ('flash-question'), ('tic-tac-toe'), ('drop4'), ('connect-the-dots'), ('word-reveal'), ('word-chase'), ('lexo'), ('rock-paper-scissors')) as catalog(game_key)
  cross join settings
  cross join credited
  left join games g on g.stored_game_key = catalog.game_key;
$function$;
