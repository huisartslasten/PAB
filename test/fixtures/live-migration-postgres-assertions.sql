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

  -- The disposable LIVE baseline starts with 10 lessons, 7 topics,
  -- 3 game results and no lesson items or test history. The approved
  -- transfer must leave all of those datasets unchanged.
  select count(*) into v_count from public.lessons;
  if v_count <> 10 then raise exception 'LIVE lesson baseline changed; expected 10, found %',v_count; end if;

  select count(*) into v_count from public.lesson_items;
  if v_count <> 0 then raise exception 'Lesson items must not be transferred; found %',v_count; end if;

  select count(*) into v_count from public.test_attempts;
  if v_count <> 0 then raise exception 'Test attempts must not be transferred; found %',v_count; end if;

  select count(*) into v_count from public.test_attempt_answers;
  if v_count <> 0 then raise exception 'Test answers must not be transferred; found %',v_count; end if;

  select count(*) into v_count from public.game_results;
  if v_count <> 5 then raise exception 'Expected 3 existing + 2 approved game results; found %',v_count; end if;

  select count(*) into v_count from public.lesson_order;
  if v_count <> 8 then raise exception 'LIVE lesson_order rows changed; expected 8, found %',v_count; end if;

  select count(*) into v_count from public.learning_topics;
  if v_count <> 7 then raise exception 'LIVE learning_topics must remain unchanged at 7; found %',v_count; end if;

  select count(*) into v_count from public.game_access_settings;
  if v_count <> 2 then raise exception 'Expected 2 imported game-access settings; found %',v_count; end if;

  select count(*) into v_count from public.game_access_cycles;
  if v_count <> 2 then raise exception 'Expected 2 imported game-access cycles; found %',v_count; end if;

  select count(*) into v_count from public.game_access_state;
  if v_count <> 4 then raise exception 'Expected 4 imported game-access states; found %',v_count; end if;

  -- Existing LIVE lesson 20 is also titled 'Thema 2: week 3';
  -- only check the excluded lesson identities that do not exist in LIVE.
  if exists (
    select 1 from public.lessons
    where (student='Zephon' and title='Aftrekken tot en met 5')
       or (student='Zyon' and subject='Aardrijkskunde' and title='Azie')
  ) then raise exception 'Unapproved TEST lessons were transferred'; end if;

  if exists (
    select 1 from public.learning_topics
    where student='Zyon' and subject='Aardrijkskunde' and subvak='Topografie'
  ) then raise exception 'Topografie topic must not be transferred'; end if;

  if not exists (
    select 1 from public.lessons
    where id=20 and explanation='LIVE_ONLY_KEEP'
      and ai_instruction='LIVE_AI_KEEP' and editor_labels='["keep"]'::jsonb
  ) then raise exception 'LIVE-only lesson fields were overwritten'; end if;

  if not exists (
    select 1 from public.game_results
    where id=1 and lesson_id=41 and student='Zyon' and score=9 and game_key='memory'
  ) or not exists (
    select 1 from public.game_results
    where id=2 and lesson_id=41 and student='Zyon' and score=8 and game_key='memory'
  ) or not exists (
    select 1 from public.game_results
    where id=3 and lesson_id=13 and student='Zephon' and score=10240 and game_key='double-or-nothing'
  ) then
    raise exception 'Existing LIVE game results were overwritten or lost'; end if;

  if not exists (
    select 1 from public.game_results
    where lesson_id=14 and student='Zenith' and score=18 and game_key='word-reveal'
      and played_at='2026-10-22T23:34:01.448632+00:00'::timestamptz
  ) or not exists (
    select 1 from public.game_results
    where lesson_id=13 and student='Zephon' and score=10240 and game_key='double-or-nothing'
      and played_at='2026-10-27T20:25:24.984684+00:00'::timestamptz
  ) then
    raise exception 'Approved TEST game history was not appended correctly'; end if;

  if not exists (
    select 1 from public.game_access_settings
    where student='Zenith' and required_tests=10 and minimum_score=9
  ) or not exists (
    select 1 from public.game_access_settings
    where student='Zephon' and required_tests=10 and minimum_score=9
  ) then raise exception 'Approved game-access settings did not transfer'; end if;

  if not exists (
    select 1 from public.game_access_cycles where student='Zenith' and cycle=3
  ) or not exists (
    select 1 from public.game_access_cycles where student='Zephon' and cycle=5
  ) then raise exception 'Approved game-access cycles did not transfer'; end if;

  if not exists (
    select 1 from public.game_access_state
    where student='Zenith' and game_key='memory' and unlocked=false
  ) or not exists (
    select 1 from public.game_access_state
    where student='Zephon' and game_key='lexo' and unlocked=false
  ) or not exists (
    select 1 from public.game_access_state
    where student='Zephon' and game_key='rock-paper-scissors' and unlocked=true
  ) or not exists (
    select 1 from public.game_access_state
    where student='Zephon' and game_key='word-chase' and unlocked=false
  ) then raise exception 'Approved per-game access state did not transfer'; end if;

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
    where id=15 and student='Zyon' and subject='Aardrijkskunde'
      and subvak='Azie' and deleted=true
  ) then raise exception 'Existing deleted Azie topic was changed'; end if;
end;
$assert$;
