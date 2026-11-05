-- Integration test for 20261104230000_add_learner_ownership_and_rls.sql.
-- Run as the database owner against PacoGO TEST after applying that migration.
-- All synthetic auth users, learner profiles and learner records are rolled back.
begin;

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('a1000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
   'pacogo-rls-parent-a@example.invalid', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('b2000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated',
   'pacogo-rls-parent-b@example.invalid', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now());

set local role authenticated;

select set_config('request.jwt.claim.sub', 'a1000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claims',
  '{"sub":"a1000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select set_config(
  'test.learner_a',
  public.create_learner_profile('Synthetic learner A'),
  true
);

select set_config('request.jwt.claim.sub', 'b2000000-0000-4000-8000-000000000002', true);
select set_config('request.jwt.claims',
  '{"sub":"b2000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select set_config(
  'test.learner_b',
  public.create_learner_profile('Synthetic learner B'),
  true
);

select set_config(
  'test.registry_id',
  (
    select id::text
    from public.curriculum_registry_versions
    where registry_key = 'pacogo-curriculum'
    order by created_at desc
    limit 1
  ),
  true
);

-- Parent B records one complete learning cycle for learner B.
select public.persist_curriculum_learning_cycle(
  current_setting('test.learner_b'),
  current_setting('test.registry_id')::uuid,
  'TEST-SKILL-B',
  '{"source_event_id":"rls-test-event-b","performance":{"correct":true},"observation":{"response":12},"evidence_assessment":{"status":"observed"}}'::jsonb,
  '{"state":{"status":"in_progress"},"last_observed_at":"2026-11-04T12:00:00Z"}'::jsonb,
  '{"observation_ids":[],"inference":{"status":"insufficient"},"decision":{"next_action":"continue"}}'::jsonb
);

-- Parent A records one complete learning cycle for learner A.
select set_config('request.jwt.claim.sub', 'a1000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claims',
  '{"sub":"a1000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select public.persist_curriculum_learning_cycle(
  current_setting('test.learner_a'),
  current_setting('test.registry_id')::uuid,
  'TEST-SKILL-A',
  '{"source_event_id":"rls-test-event-a","performance":{"correct":true},"observation":{"response":12},"evidence_assessment":{"status":"observed"}}'::jsonb,
  '{"state":{"status":"in_progress"},"last_observed_at":"2026-11-04T12:00:00Z"}'::jsonb,
  '{"observation_ids":[],"inference":{"status":"insufficient"},"decision":{"next_action":"continue"}}'::jsonb
);

-- Parent B also sees only its own learner and records.
do $
begin
  if not exists (
    select 1 from public.learner_profiles
    where learner_key = current_setting('test.learner_b')
  ) or exists (
    select 1 from public.learner_profiles
    where learner_key = current_setting('test.learner_a')
  ) then
    raise exception 'Parent B learner-profile isolation failed';
  end if;

  if not exists (
    select 1 from public.student_evidence
    where student_key = current_setting('test.learner_b')
  ) or exists (
    select 1 from public.student_evidence
    where student_key = current_setting('test.learner_a')
  ) then
    raise exception 'Parent B evidence isolation failed';
  end if;
end;
$;

-- Parent A sees its own learner and data, but cannot see Parent B's learner or data.
do $$
begin
  if not exists (
    select 1 from public.learner_profiles
    where learner_key = current_setting('test.learner_a')
  ) then
    raise exception 'Parent A cannot read its own learner profile';
  end if;

  if exists (
    select 1 from public.learner_profiles
    where learner_key = current_setting('test.learner_b')
  ) then
    raise exception 'Parent A can read Parent B learner profile';
  end if;

  if not exists (
    select 1 from public.student_evidence
    where student_key = current_setting('test.learner_a')
  ) then
    raise exception 'Parent A cannot read its own evidence';
  end if;

  if exists (
    select 1 from public.student_evidence
    where student_key = current_setting('test.learner_b')
  ) then
    raise exception 'Parent A can read Parent B evidence';
  end if;

  if exists (
    select 1 from public.student_longitudinal_state
    where student_key = current_setting('test.learner_b')
  ) or exists (
    select 1 from public.curriculum_decision_trace
    where student_key = current_setting('test.learner_b')
  ) then
    raise exception 'Parent A can read Parent B state or decision trace';
  end if;
end;
$$;

-- Parent A cannot add itself to Parent B's learner or persist for Parent B.
do $$
begin
  begin
    insert into public.learner_guardians (
      learner_key, guardian_user_id, membership_role
    ) values (
      current_setting('test.learner_b'),
      'a1000000-0000-4000-8000-000000000001',
      'owner'
    );
    raise exception 'Direct membership self-enrollment unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;

  begin
    perform public.persist_curriculum_learning_cycle(
      current_setting('test.learner_b'),
      current_setting('test.registry_id')::uuid,
      'TEST-SKILL-B',
      '{"source_event_id":"rls-cross-write","performance":{},"observation":{},"evidence_assessment":{}}'::jsonb,
      '{"state":{}}'::jsonb,
      '{"observation_ids":[],"inference":{},"decision":{}}'::jsonb
    );
    raise exception 'Cross-guardian persistence unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Replaying the same event is idempotent: one evidence row and one trace row.
select public.persist_curriculum_learning_cycle(
  current_setting('test.learner_a'),
  current_setting('test.registry_id')::uuid,
  'TEST-SKILL-A',
  '{"source_event_id":"rls-test-event-a","performance":{"correct":true},"observation":{"response":12},"evidence_assessment":{"status":"observed"}}'::jsonb,
  '{"state":{"status":"in_progress"},"last_observed_at":"2026-11-04T12:00:00Z"}'::jsonb,
  '{"observation_ids":[],"inference":{"status":"insufficient"},"decision":{"next_action":"continue"}}'::jsonb
);

do $$
begin
  if (select count(*) from public.student_evidence
      where student_key = current_setting('test.learner_a')
        and source_event_id = 'rls-test-event-a') <> 1 then
    raise exception 'Duplicate evidence event was stored more than once';
  end if;

  if (select count(*) from public.curriculum_decision_trace
      where student_key = current_setting('test.learner_a')
        and source_event_id = 'rls-test-event-a') <> 1 then
    raise exception 'Duplicate decision trace was stored more than once';
  end if;
end;
$$;

-- A malformed final trace constraint must roll back evidence and state writes too.
select set_config(
  'test.state_before_atomic_failure',
  (
    select state::text
    from public.student_longitudinal_state
    where student_key = current_setting('test.learner_a')
      and skill_id = 'TEST-SKILL-A'
  ),
  true
);

do $$
begin
  begin
    perform public.persist_curriculum_learning_cycle(
      current_setting('test.learner_a'),
      current_setting('test.registry_id')::uuid,
      'TEST-SKILL-A',
      '{"source_event_id":"rls-test-atomic-failure","performance":{},"observation":{},"evidence_assessment":{}}'::jsonb,
      '{"state":{"status":"must-rollback"}}'::jsonb,
      '{"observation_ids":"not-an-array","inference":{},"decision":{}}'::jsonb
    );
    raise exception 'Malformed trace unexpectedly passed its database constraint';
  exception
    when check_violation then null;
  end;

  if exists (
    select 1 from public.student_evidence
    where student_key = current_setting('test.learner_a')
      and source_event_id = 'rls-test-atomic-failure'
  ) then
    raise exception 'Evidence survived a failed learning-cycle transaction';
  end if;

  if exists (
    select 1 from public.curriculum_decision_trace
    where student_key = current_setting('test.learner_a')
      and source_event_id = 'rls-test-atomic-failure'
  ) then
    raise exception 'Decision trace survived a failed learning-cycle transaction';
  end if;

  if (
    select state::text
    from public.student_longitudinal_state
    where student_key = current_setting('test.learner_a')
      and skill_id = 'TEST-SKILL-A'
  ) <> current_setting('test.state_before_atomic_failure') then
    raise exception 'Longitudinal state changed despite failed learning-cycle transaction';
  end if;
end;
$$;

-- Learner identity cannot be reassigned through direct table updates.
do $$
begin
  begin
    update public.student_longitudinal_state
    set student_key = current_setting('test.learner_b')
    where student_key = current_setting('test.learner_a')
      and skill_id = 'TEST-SKILL-A';
    raise exception 'Direct learner-state reassignment unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

-- Anonymous role has no table privileges even before row-level policy evaluation.
reset role;
do $$
begin
  if has_table_privilege('anon', 'public.student_evidence', 'SELECT')
     or has_table_privilege('anon', 'public.student_longitudinal_state', 'SELECT')
     or has_table_privilege('anon', 'public.curriculum_decision_trace', 'SELECT')
     or has_table_privilege('anon', 'public.learner_profiles', 'SELECT') then
    raise exception 'Anonymous role retains learner-data table privileges';
  end if;
end;
$$;

rollback;
