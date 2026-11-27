begin;

-- LIVE-only additive runtime contract and authorization alignment.
-- Apply only to Supabase LIVE after backup and migration validation.
-- Do not replay this migration as part of the TEST migration chain.

do $preflight$
begin
  if to_regclass('public.lesson_items') is null
     or to_regclass('public.skill_assignments') is null
     or to_regclass('public.game_results') is null
     or to_regclass('public.lesson_order') is null
     or to_regclass('public.challenge_configurations') is null
     or to_regclass('public.skill_definitions') is null then
    raise exception 'LIVE runtime contract target tables are missing; stop and reconcile the schema';
  end if;

  if exists (
    select 1
    from public.skill_assignments
    group by student, skill_id
    having count(*) > 1
  ) then
    raise exception 'LIVE contains duplicate student/skill assignments; do not create the unique index until reconciled';
  end if;
end;
$preflight$;

-- The current lesson writer persists this additive JSON model.
-- Existing LIVE-only columns (min_words, required_terms, explanation,
-- ai_instruction and editor_labels) are deliberately untouched.
alter table public.lesson_items
  add column if not exists content_data jsonb;

-- Required by the current Skill configuration service's upsert conflict target.
create unique index if not exists skill_assignments_student_skill_id_key
  on public.skill_assignments (student, skill_id);

-- Align the game-access RPCs with the current LIVE game catalogue.
-- Keep LIVE's qualifying-test cycle gate in claim_game_unlock. The TEST database's
-- current function body is a simplified override and is deliberately not copied.
create or replace function public.get_game_access(p_student text)
returns table (game_key text, unlocked boolean, cycle integer, required_tests integer, minimum_score integer, credited_tests integer)
language sql stable
set search_path = public
as $function$
  with settings as (
    select
      coalesce(nullif(trim(p_student), ''), '') as student,
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
    select game_key, unlocked
    from public.game_access_state
    where student = trim(p_student)
  )
  select
    catalog.game_key,
    case when catalog.game_key = 'double-or-nothing' then true else coalesce(g.unlocked, false) end,
    settings.cycle,
    settings.required_tests,
    settings.minimum_score,
    credited.credited_tests
  from (
    values
      ('double-or-nothing'),
      ('memory'),
      ('flash-question'),
      ('tic-tac-toe'),
      ('drop4'),
      ('connect-the-dots'),
      ('word-reveal'),
      ('word-chase'),
      ('lexo'),
      ('rock-paper-scissors')
  ) as catalog(game_key)
  cross join settings
  cross join credited
  left join games g on g.game_key = catalog.game_key;
$function$;

create or replace function public.claim_game_unlock(p_student text, p_game_key text)
returns table (game_key text, unlocked boolean, cycle integer, required_tests integer, minimum_score integer, credited_tests integer)
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_student text := trim(coalesce(p_student, ''));
  v_game_key text := trim(coalesce(p_game_key, ''));
  v_cycle integer;
  v_required integer;
  v_minimum integer;
  v_credited integer;
begin
  if v_student = '' then raise exception 'A student is required.'; end if;
  if v_game_key not in ('memory','flash-question','tic-tac-toe','drop4','connect-the-dots','word-reveal','word-chase','lexo','rock-paper-scissors') then raise exception 'Game is not unlockable.'; end if;

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
$function$;

create or replace function public.admin_set_game_access(p_student text, p_game_key text, p_unlocked boolean)
returns table (game_key text, unlocked boolean, cycle integer, required_tests integer, minimum_score integer, credited_tests integer)
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_student text := trim(coalesce(p_student, ''));
  v_game_key text := trim(coalesce(p_game_key, ''));
  v_cycle integer;
begin
  if auth.uid() is null or auth.uid() <> '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid then raise exception 'Not authorized.'; end if;
  if v_student = '' then raise exception 'A student is required.'; end if;
  if v_game_key not in ('double-or-nothing','memory','flash-question','tic-tac-toe','drop4','connect-the-dots','word-reveal','word-chase','lexo','rock-paper-scissors') then raise exception 'Game is not available.'; end if;

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
$function$;

CREATE OR REPLACE FUNCTION public.admin_set_game_access_settings(p_student text, p_required_tests integer, p_minimum_score integer)
 RETURNS TABLE(required_tests integer, minimum_score integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if auth.uid() is null or auth.uid() <> '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid then raise exception 'Not authorized.'; end if;
  if trim(coalesce(p_student, '')) = '' then raise exception 'A student is required.'; end if;
  if p_required_tests is null or p_required_tests < 1 then raise exception 'Required tests must be at least 1.'; end if;
  if p_minimum_score is null or p_minimum_score < 0 or p_minimum_score > 10 then raise exception 'Minimum score must be between 0 and 10.'; end if;
  insert into public.game_access_settings (student, required_tests, minimum_score)
  values (trim(p_student), p_required_tests, p_minimum_score)
  on conflict (student) do update set required_tests = excluded.required_tests, minimum_score = excluded.minimum_score, updated_at = now();
  return query select s.required_tests, s.minimum_score from public.game_access_settings s where s.student = trim(p_student);
end;
$function$;


-- Game results are readable by both actual LIVE parent accounts.
drop policy if exists "Parents can view game results" on public.game_results;
create policy "Parents can view game results"
  on public.game_results
  for select
  to authenticated
  using (
    (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  );

-- Lesson order is readable by learners and writable by either LIVE parent.
drop policy if exists "Public can read lesson order" on public.lesson_order;
create policy "Public can read lesson order"
  on public.lesson_order
  for select
  to anon, authenticated
  using (true);

drop policy if exists "parents manage lesson order" on public.lesson_order;
create policy "parents manage lesson order"
  on public.lesson_order
  for all
  to authenticated
  using (
    (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  )
  with check (
    (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  );

-- Skill assignment writes are restricted to the LIVE main administrator.
drop policy if exists "Main administrator can insert Skill assignments" on public.skill_assignments;
create policy "Main administrator can insert Skill assignments"
  on public.skill_assignments
  for insert
  to authenticated
  with check ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid);

drop policy if exists "Main administrator can update Skill assignments" on public.skill_assignments;
create policy "Main administrator can update Skill assignments"
  on public.skill_assignments
  for update
  to authenticated
  using ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid)
  with check ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid);

drop policy if exists "Main administrator can delete Skill assignments" on public.skill_assignments;
create policy "Main administrator can delete Skill assignments"
  on public.skill_assignments
  for delete
  to authenticated
  using ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid);

-- Challenge configuration is readable by LIVE parents, but writable only by the main administrator.
drop policy if exists "Parents can manage challenge configurations" on public.challenge_configurations;
drop policy if exists "Parents can read challenge configurations" on public.challenge_configurations;
drop policy if exists "Main administrator can manage challenge configurations" on public.challenge_configurations;
create policy "Parents can read challenge configurations"
  on public.challenge_configurations
  for select
  to authenticated
  using (
    (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  );

create policy "Main administrator can manage challenge configurations"
  on public.challenge_configurations
  for all
  to authenticated
  using ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid)
  with check ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid);

-- Skill definitions remain publicly readable as before; only the main administrator may write them.
drop policy if exists "Parents can manage skill definitions" on public.skill_definitions;
drop policy if exists "Main administrator can manage skill definitions" on public.skill_definitions;
create policy "Main administrator can manage skill definitions"
  on public.skill_definitions
  for all
  to authenticated
  using ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid)
  with check ((select auth.uid()) = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid);

-- The learning-topic media service requires a private bucket. No TEST media objects
-- are copied; the 19 TEST objects belong to placeholder topics.
do $bucket$
declare
  existing_bucket storage.buckets%rowtype;
  expected_mime_types text[] := array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]::text[];
begin
  select * into existing_bucket
  from storage.buckets
  where id = 'lesson-photos';

  if not found then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('lesson-photos', 'lesson-photos', false, 5242880, expected_mime_types);
  elsif existing_bucket.public is distinct from false
     or existing_bucket.file_size_limit is distinct from 5242880
     or existing_bucket.allowed_mime_types is distinct from expected_mime_types then
    raise exception 'LIVE lesson-photos bucket exists with an unexpected configuration; stop and reconcile';
  end if;
end;
$bucket$;

drop policy if exists lesson_photos_storage_select on storage.objects;
create policy lesson_photos_storage_select
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'lesson-photos');

drop policy if exists lesson_photos_storage_insert on storage.objects;
create policy lesson_photos_storage_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'lesson-photos'
    and (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  );

drop policy if exists lesson_photos_storage_delete on storage.objects;
create policy lesson_photos_storage_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'lesson-photos'
    and (select auth.uid()) = any (array[
      '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09'::uuid,
      '418833d5-049a-4ec9-8072-2d48a85f04b1'::uuid
    ])
  );

do $verify$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'lesson_items'
      and column_name = 'content_data'
      and data_type = 'jsonb'
  ) then
    raise exception 'LIVE content_data column verification failed';
  end if;

  if to_regclass('public.skill_assignments_student_skill_id_key') is null then
    raise exception 'LIVE Skill assignment unique-index verification failed';
  end if;

  if not exists (
    select 1 from storage.buckets
    where id = 'lesson-photos'
      and public = false
      and file_size_limit = 5242880
  ) then
    raise exception 'LIVE private lesson-photos bucket verification failed';
  end if;
end;
$verify$;

commit;
