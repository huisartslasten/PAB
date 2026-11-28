begin;

-- Additive TEST -> LIVE transfer of learner game-access state and game
-- history that references lessons already present in LIVE.
-- No lessons, lesson items, learning topics, lesson order, test attempts,
-- test answers, or challenge configuration are imported or modified.
-- Existing LIVE rows are never updated or deleted.

create temporary table pacogo_test_live_payload (
  payload jsonb not null
) on commit drop;

insert into pg_temp.pacogo_test_live_payload(payload)
values ($paco_test_payload${"game_results":[{"id":3,"score":18,"student":"Zenith","game_key":"word-reveal","lesson_id":14,"played_at":"2026-10-22T23:34:01.448632+00:00"},{"id":4,"score":10240,"student":"Zephon","game_key":"double-or-nothing","lesson_id":13,"played_at":"2026-10-27T20:25:24.984684+00:00"}],"game_access_settings":[{"student":"Zenith","updated_at":"2026-10-29T19:50:29.658478+00:00","minimum_score":9,"required_tests":10},{"student":"Zephon","updated_at":"2026-10-30T17:43:48.126212+00:00","minimum_score":9,"required_tests":10}],"game_access_cycles":[{"cycle":3,"student":"Zenith","updated_at":"2026-10-29T19:50:32.707388+00:00"},{"cycle":5,"student":"Zephon","updated_at":"2026-10-30T17:44:11.381765+00:00"}],"game_access_state":[{"student":"Zenith","game_key":"memory","unlocked":false,"updated_at":"2026-10-29T19:50:33.383929+00:00"},{"student":"Zephon","game_key":"lexo","unlocked":false,"updated_at":"2026-10-30T17:44:11.381765+00:00"},{"student":"Zephon","game_key":"rock-paper-scissors","unlocked":true,"updated_at":"2026-10-30T17:44:11.381765+00:00"},{"student":"Zephon","game_key":"word-chase","unlocked":false,"updated_at":"2026-10-30T17:44:11.381765+00:00"}]}$paco_test_payload$::jsonb);

do $import$
declare
  v_payload jsonb;
  v_inserted integer;
begin
  select payload into strict v_payload
  from pg_temp.pacogo_test_live_payload;

  if jsonb_array_length(v_payload -> 'game_results') <> 2
     or jsonb_array_length(v_payload -> 'game_access_settings') <> 2
     or jsonb_array_length(v_payload -> 'game_access_cycles') <> 2
     or jsonb_array_length(v_payload -> 'game_access_state') <> 4 then
    raise exception 'TEST game transfer manifest counts changed; transfer stopped';
  end if;

  if exists (
    select 1 from public.game_access_settings where student in ('Zenith','Zephon')
  ) or exists (
    select 1 from public.game_access_cycles where student in ('Zenith','Zephon')
  ) or exists (
    select 1 from public.game_access_state where student in ('Zenith','Zephon')
  ) then
    raise exception 'LIVE already contains game-access rows for Zenith or Zephon; reconcile instead of overwriting';
  end if;

  if not exists (
    select 1 from public.lessons
    where id=13 and student='Zephon' and subject='Rekenen' and title='Optellen tot 10'
  ) or not exists (
    select 1 from public.lessons
    where id=14 and student='Zenith' and subject='Nederlands' and title='Thema 2: week 2'
  ) then
    raise exception 'The LIVE lesson references for retained TEST game results 13/14 no longer match';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(v_payload -> 'game_results') as x(
      id bigint, score integer, student text, game_key text,
      lesson_id bigint, played_at timestamptz
    )
    where lesson_id not in (13,14)
  ) then
    raise exception 'A retained TEST game result references a lesson not approved for LIVE';
  end if;

  insert into public.game_results(lesson_id,student,score,played_at,game_key)
  select lesson_id,student,score,played_at,game_key
  from jsonb_to_recordset(v_payload -> 'game_results') as x(
    id bigint, score integer, student text, game_key text,
    lesson_id bigint, played_at timestamptz
  )
  order by id;

  get diagnostics v_inserted = row_count;
  if v_inserted <> 2 then
    raise exception 'Expected 2 imported game results; inserted %', v_inserted;
  end if;

  insert into public.game_access_settings(student,required_tests,minimum_score,updated_at)
  select student,required_tests,minimum_score,updated_at
  from jsonb_to_recordset(v_payload -> 'game_access_settings') as x(
    student text,updated_at timestamptz,minimum_score integer,required_tests integer
  );
  get diagnostics v_inserted = row_count;
  if v_inserted <> 2 then
    raise exception 'Expected 2 imported game-access settings; inserted %', v_inserted;
  end if;

  insert into public.game_access_cycles(student,cycle,updated_at)
  select student,cycle,updated_at
  from jsonb_to_recordset(v_payload -> 'game_access_cycles') as x(
    cycle integer,student text,updated_at timestamptz
  );
  get diagnostics v_inserted = row_count;
  if v_inserted <> 2 then
    raise exception 'Expected 2 imported game-access cycles; inserted %', v_inserted;
  end if;

  insert into public.game_access_state(student,game_key,unlocked,updated_at)
  select student,game_key,unlocked,updated_at
  from jsonb_to_recordset(v_payload -> 'game_access_state') as x(
    student text,game_key text,unlocked boolean,updated_at timestamptz
  )
  order by student,unlocked,game_key;
  get diagnostics v_inserted = row_count;
  if v_inserted <> 4 then
    raise exception 'Expected 4 imported game-access states; inserted %', v_inserted;
  end if;
end;
$import$;

commit;
