-- TEST verification exposed PL/pgSQL return-table name collisions in the
-- central game-access functions. Qualify table columns and use named constraints
-- so output columns never shadow SQL identifiers.

create or replace function public.claim_game_unlock(p_student text, p_game_key text)
returns table (game_key text, unlocked boolean, cycle integer, required_tests integer, minimum_score integer, credited_tests integer)
language plpgsql security definer set search_path = public
as $$
declare
  v_student text := trim(coalesce(p_student, ''));
  v_game_key text := trim(coalesce(p_game_key, ''));
  v_cycle integer;
  v_required integer;
  v_minimum integer;
  v_credited integer;
begin
  if v_student = '' then raise exception 'A student is required.'; end if;
  if v_game_key not in ('memory','flash-question','tic-tac-toe','drop4','connect-the-dots','word-reveal','word-chase','lexo') then raise exception 'Game is not unlockable.'; end if;

  insert into public.game_access_settings (student)
  values (v_student)
  on conflict (student) do nothing;

  insert into public.game_access_cycles (student)
  values (v_student)
  on conflict (student) do nothing;

  select c.cycle into v_cycle
  from public.game_access_cycles c
  where c.student = v_student
  for update;

  select s.required_tests, s.minimum_score into v_required, v_minimum
  from public.game_access_settings s
  where s.student = v_student;

  insert into public.game_access_cycle_tests (student, cycle, lesson_id, qualifying_score)
  select v_student, v_cycle, q.lesson_id, q.score
  from (
    select ta.lesson_id,
      max(round((ta.score::numeric / nullif(ta.total_questions, 0)) * 10, 2)) as score
    from public.test_attempts ta
    where ta.student = v_student
      and ta.is_test = true
      and ta.completed_at is not null
      and ta.total_questions > 0
    group by ta.lesson_id
  ) q
  where q.score >= v_minimum
    and not exists (
      select 1
      from public.game_access_cycle_tests existing
      where existing.student = v_student
        and existing.cycle = v_cycle
        and existing.lesson_id = q.lesson_id
    );

  select count(*)::integer into v_credited
  from public.game_access_cycle_tests ct
  where ct.student = v_student and ct.cycle = v_cycle;

  if v_credited < v_required then
    raise exception 'Not enough qualifying tests: % of %.', v_credited, v_required;
  end if;

  insert into public.game_access_state (student, game_key, unlocked)
  values (v_student, 'double-or-nothing', true)
  on conflict on constraint game_access_state_pkey do update
    set unlocked = true, updated_at = now();

  update public.game_access_state gas
    set unlocked = false, updated_at = now()
  where gas.student = v_student
    and gas.game_key <> 'double-or-nothing';

  insert into public.game_access_state (student, game_key, unlocked)
  values (v_student, v_game_key, true)
  on conflict on constraint game_access_state_pkey do update
    set unlocked = true, updated_at = now();

  update public.game_access_cycles gac
    set cycle = v_cycle + 1, updated_at = now()
  where gac.student = v_student;

  return query select * from public.get_game_access(v_student);
end;
$$;

create or replace function public.admin_set_game_access(p_student text, p_game_key text, p_unlocked boolean)
returns table (game_key text, unlocked boolean, cycle integer, required_tests integer, minimum_score integer, credited_tests integer)
language plpgsql security definer set search_path = public
as $$
declare
  v_student text := trim(coalesce(p_student, ''));
  v_game_key text := trim(coalesce(p_game_key, ''));
  v_cycle integer;
begin
  if auth.uid() is null or auth.uid() <> 'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'::uuid then raise exception 'Not authorized.'; end if;
  if v_student = '' then raise exception 'A student is required.'; end if;
  if v_game_key not in ('double-or-nothing','memory','flash-question','tic-tac-toe','drop4','connect-the-dots','word-reveal','word-chase','lexo') then raise exception 'Game is not available.'; end if;

  insert into public.game_access_settings (student)
  values (v_student)
  on conflict (student) do nothing;

  insert into public.game_access_cycles (student)
  values (v_student)
  on conflict (student) do nothing;

  select c.cycle into v_cycle
  from public.game_access_cycles c
  where c.student = v_student
  for update;

  if p_unlocked then
    update public.game_access_state gas
      set unlocked = false, updated_at = now()
    where gas.student = v_student and gas.game_key <> 'double-or-nothing';

    insert into public.game_access_state (student, game_key, unlocked)
    values (v_student, v_game_key, true)
    on conflict on constraint game_access_state_pkey do update
      set unlocked = true, updated_at = now();

    update public.game_access_cycles gac
      set cycle = v_cycle + 1, updated_at = now()
    where gac.student = v_student;
  elsif v_game_key <> 'double-or-nothing' then
    update public.game_access_state gas
      set unlocked = false, updated_at = now()
    where gas.student = v_student and gas.game_key = v_game_key;
  end if;

  return query select * from public.get_game_access(v_student);
end;
$$;
