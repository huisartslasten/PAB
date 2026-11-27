do $assert$
declare
  v_count integer;
  v_policy_exists boolean;
  v_constraint text;
begin
  if to_regclass('public.curriculum_registry_versions') is null
     or to_regclass('public.student_evidence') is null
     or to_regclass('public.student_longitudinal_state') is null
     or to_regclass('public.curriculum_decision_trace') is null
     or to_regclass('public.learner_profiles') is null
     or to_regclass('public.learner_guardians') is null
     or to_regclass('public.learner_profile_links') is null then
    raise exception 'Curriculum persistence tables were not created';
  end if;

  if to_regprocedure('private.persist_curriculum_learning_cycle(text,uuid,text,jsonb,jsonb,jsonb)') is null
     or to_regprocedure('public.persist_curriculum_learning_cycle(text,uuid,text,jsonb,jsonb,jsonb)') is null then
    raise exception 'Curriculum atomic-write functions are missing';
  end if;

  if not exists (
    select 1 from pg_indexes
    where schemaname='public' and tablename='skill_assignments'
      and indexname='skill_assignments_student_skill_id_key'
  ) then
    raise exception 'Skill assignment natural-key index is missing';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='lesson_items'
      and column_name='content_data' and data_type='jsonb'
  ) then
    raise exception 'lesson_items.content_data was not added';
  end if;

  select pg_get_constraintdef(oid) into v_constraint
  from pg_constraint
  where conrelid='public.game_results'::regclass
    and conname='game_results_game_key_canonical_check';
  if v_constraint is null or position('rock-paper-scissors' in v_constraint)=0 then
    raise exception 'RPS is not accepted by the canonical game_results constraint';
  end if;

  select exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='lesson_order'
      and policyname='Public can read lesson order'
  ) into v_policy_exists;
  if v_policy_exists then
    raise exception 'Anonymous lesson-order read policy must not exist';
  end if;

  select count(*) into v_count from public.lessons;
  if v_count <> 16 then raise exception 'Expected 16 total lessons after additive import; found %',v_count; end if;

  select count(*) into v_count from public.lesson_items;
  if v_count <> 25 then raise exception 'Expected 25 imported lesson items; found %',v_count; end if;

  select count(*) into v_count from public.test_attempts;
  if v_count <> 11 then raise exception 'Expected 11 imported attempts; found %',v_count; end if;

  select count(*) into v_count from public.test_attempt_answers;
  if v_count <> 54 then raise exception 'Expected 54 imported answers; found %',v_count; end if;

  select count(*) into v_count from public.game_results;
  if v_count <> 7 then raise exception 'Expected 7 total game results (3 existing + 4 imported); found %',v_count; end if;

  select count(*) into v_count from public.lesson_order;
  if v_count <> 8 then raise exception 'LIVE lesson_order rows changed; expected 8, found %',v_count; end if;

  select count(*) into v_count from public.learning_topics;
  if v_count <> 8 then raise exception 'Expected 7 existing topics + distinct Topografie; found %',v_count; end if;

  select count(*) into v_count from public.game_access_settings;
  if v_count <> 2 then raise exception 'Expected 2 imported game-access settings; found %',v_count; end if;

  select count(*) into v_count from public.game_access_cycles;
  if v_count <> 2 then raise exception 'Expected 2 imported game-access cycles; found %',v_count; end if;

  select count(*) into v_count from public.game_access_state;
  if v_count <> 4 then raise exception 'Expected 4 imported game-access states; found %',v_count; end if;

  if not exists (
    select 1 from public.lessons
    where student='Zephon' and subject='Rekenen' and title='Aftrekken tot en met 5'
      and archived=false and deleted=false
  ) then raise exception 'New Zephon lesson was not imported as active'; end if;

  if not exists (
    select 1 from public.lessons
    where student='Zyon' and subject='Aardrijkskunde' and title='Azie'
      and subvak='Topografie' and archived=false and deleted=false
  ) then raise exception 'New Zyon Topografie lesson was not imported as active'; end if;

  if not exists (
    select 1 from public.lessons
    where student='Zenith' and title='Thema 2: week 3'
      and archived=true and deleted=false
  ) then raise exception 'TEST lesson 20 history snapshot was not hidden in archive'; end if;

  if not exists (
    select 1 from public.lessons
    where student='Zenith' and title='Les 2: Caribisch gebied'
      and archived=true and deleted=false
  ) then raise exception 'TEST lesson 21 history snapshot was not hidden in archive'; end if;

  if not exists (
    select 1 from public.lessons
    where student='Zenith' and title='Woordendictee'
      and archived=true and deleted=false
  ) then raise exception 'TEST lesson 39 history snapshot was not hidden in archive'; end if;

  if not exists (
    select 1 from public.lessons
    where student='Zyon' and title='Woordendictee'
      and deleted=true and archived=false
  ) then raise exception 'TEST lesson 40 deleted history snapshot was not preserved'; end if;

  if not exists (
    select 1 from public.lessons
    where id=20 and explanation='LIVE_ONLY_KEEP'
      and ai_instruction='LIVE_AI_KEEP' and editor_labels='["keep"]'::jsonb
  ) then raise exception 'LIVE-only lesson fields were overwritten';
  end if;

  if not exists (
    select 1 from public.game_results
    where id=1 and lesson_id=41 and student='Zyon' and score=9 and game_key='memory'
  ) or not exists (
    select 1 from public.game_results
    where id=3 and lesson_id=13 and student='Zephon' and score=10240 and game_key='double-or-nothing'
  ) then
    raise exception 'Existing LIVE game results were overwritten or lost';
  end if;

  if not exists (
    select 1 from public.challenge_configurations
    where challenge_key='millionaire'
      and enabled=true
      and unlock_policy ->> 'minimumScore'='4'
      and unlock_policy -> 'allowedLessonTypes'='["*"]'::jsonb
      and game_settings ->> 'questionCount'='11'
      and game_settings -> 'lifelines'='{"askSomeone":true,"fiftyFifty":true,"askAudience":true}'::jsonb
  ) then raise exception 'Millionaire target configuration did not verify'; end if;

  if not exists (
    select 1 from storage.buckets
    where id='lesson-photos' and public=false and file_size_limit=5242880
      and allowed_mime_types=array['image/jpeg','image/png','image/webp','image/heic','image/heif']::text[]
  ) then raise exception 'Private lesson-photos bucket contract did not verify'; end if;

  if not exists (
    select 1 from public.learning_topics
    where student='Zyon' and subject='Aardrijkskunde'
      and subvak='Topografie' and deleted=false and archived=false
  ) then raise exception 'Distinct active Topografie topic was not created'; end if;

  if not exists (
    select 1 from public.learning_topics
    where id=15 and student='Zyon' and subject='Aardrijkskunde'
      and subvak='Azie' and deleted=true
  ) then raise exception 'Existing deleted Azie topic was changed'; end if;
end;
$assert$;
