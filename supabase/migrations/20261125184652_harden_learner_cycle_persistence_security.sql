-- Security correction: custom GUCs are caller-settable and are not write capabilities.
-- Authenticated callers have no direct DML grants on learner evidence/state/trace.
-- This private SECURITY DEFINER function is the only persistence write boundary;
-- it revalidates auth.uid() and guardian membership before any write.
drop policy if exists student_evidence_insert_authenticated on public.student_evidence;
drop policy if exists student_evidence_insert_guardian_cycle on public.student_evidence;
drop policy if exists student_longitudinal_state_insert_guardian_cycle on public.student_longitudinal_state;
drop policy if exists student_longitudinal_state_update_guardian_cycle on public.student_longitudinal_state;
drop policy if exists curriculum_decision_trace_insert_guardian_cycle on public.curriculum_decision_trace;

revoke insert, update, delete on public.student_evidence from authenticated;
revoke insert, update, delete on public.student_longitudinal_state from authenticated;
revoke insert, update, delete on public.curriculum_decision_trace from authenticated;

revoke all on function private.learner_cycle_write_enabled() from public, anon, authenticated;
drop function if exists private.learner_cycle_write_enabled();

create or replace function private.persist_curriculum_learning_cycle(
  p_student_key text,
  p_curriculum_registry_version_id uuid,
  p_skill_id text,
  p_evidence jsonb,
  p_state jsonb,
  p_decision_trace jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event_id text;
  v_evidence_id uuid;
  v_state_id uuid;
  v_trace_id uuid;
begin
  if (select auth.uid()) is null
     or not private.is_learner_guardian(p_student_key) then
    raise insufficient_privilege using message = 'guardian access to this learner is required';
  end if;

  if p_skill_id is null or length(btrim(p_skill_id)) = 0
     or jsonb_typeof(p_evidence) is distinct from 'object'
     or jsonb_typeof(p_state) is distinct from 'object'
     or jsonb_typeof(p_decision_trace) is distinct from 'object'
     or jsonb_typeof(coalesce(p_evidence -> 'performance', '{}'::jsonb)) <> 'object'
     or jsonb_typeof(coalesce(p_evidence -> 'observation', '{}'::jsonb)) <> 'object'
     or jsonb_typeof(coalesce(p_evidence -> 'evidence_assessment', '{}'::jsonb)) <> 'object'
     or jsonb_typeof(coalesce(p_state -> 'state', '{}'::jsonb)) <> 'object'
     or jsonb_typeof(coalesce(p_state -> 'alternative_explanations', '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(p_state -> 'validation_hooks', '{}'::jsonb)) <> 'object'
     or jsonb_typeof(coalesce(p_decision_trace -> 'inference', '{}'::jsonb)) <> 'object'
     or jsonb_typeof(coalesce(p_decision_trace -> 'decision', '{}'::jsonb)) <> 'object'
     or jsonb_typeof(coalesce(p_decision_trace -> 'alternative_explanations', '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(p_decision_trace -> 'validation_hooks', '{}'::jsonb)) <> 'object' then
    raise invalid_parameter_value using message = 'learning-cycle payload has an invalid shape';
  end if;

  v_event_id := nullif(btrim(p_evidence ->> 'source_event_id'), '');
  if v_event_id is null then
    raise invalid_parameter_value using message = 'evidence source_event_id is required for idempotency';
  end if;

  insert into public.student_evidence (
    student_key,
    curriculum_registry_version_id,
    skill_id,
    development_id,
    claim_id,
    evidence_target_id,
    task_model_id,
    task_instance_id,
    performance,
    observation,
    evidence_assessment,
    source_event_id,
    observed_at
  ) values (
    p_student_key,
    p_curriculum_registry_version_id,
    p_skill_id,
    p_evidence ->> 'development_id',
    p_evidence ->> 'claim_id',
    p_evidence ->> 'evidence_target_id',
    p_evidence ->> 'task_model_id',
    p_evidence ->> 'task_instance_id',
    coalesce(p_evidence -> 'performance', '{}'::jsonb),
    coalesce(p_evidence -> 'observation', '{}'::jsonb),
    coalesce(p_evidence -> 'evidence_assessment', '{}'::jsonb),
    v_event_id,
    coalesce(nullif(p_evidence ->> 'observed_at', '')::timestamptz, now())
  )
  on conflict (student_key, source_event_id)
    where source_event_id is not null
    do nothing
  returning id into v_evidence_id;

  if v_evidence_id is null then
    select e.id into v_evidence_id
    from public.student_evidence e
    where e.student_key = p_student_key
      and e.source_event_id = v_event_id;

    select s.id into v_state_id
    from public.student_longitudinal_state s
    where s.student_key = p_student_key
      and s.curriculum_registry_version_id = p_curriculum_registry_version_id
      and s.skill_id = p_skill_id;

    select d.id into v_trace_id
    from public.curriculum_decision_trace d
    where d.student_key = p_student_key
      and d.source_event_id = v_event_id;

    if v_evidence_id is null or v_state_id is null or v_trace_id is null then
      raise integrity_constraint_violation using message = 'existing event is missing part of its committed learning cycle';
    end if;

    return jsonb_build_object(
      'evidence_id', v_evidence_id,
      'state_id', v_state_id,
      'decision_trace_id', v_trace_id,
      'duplicate', true
    );
  end if;

  insert into public.student_longitudinal_state (
    student_key,
    curriculum_registry_version_id,
    skill_id,
    state,
    last_observed_at,
    alternative_explanations,
    validation_hooks,
    updated_at
  ) values (
    p_student_key,
    p_curriculum_registry_version_id,
    p_skill_id,
    coalesce(p_state -> 'state', '{}'::jsonb),
    nullif(p_state ->> 'last_observed_at', '')::timestamptz,
    coalesce(p_state -> 'alternative_explanations', '[]'::jsonb),
    coalesce(p_state -> 'validation_hooks', '{}'::jsonb),
    now()
  )
  on conflict (student_key, curriculum_registry_version_id, skill_id)
  do update set
    state = excluded.state,
    last_observed_at = excluded.last_observed_at,
    alternative_explanations = excluded.alternative_explanations,
    validation_hooks = excluded.validation_hooks,
    updated_at = now()
  returning id into v_state_id;

  insert into public.curriculum_decision_trace (
    student_key,
    curriculum_registry_version_id,
    skill_id,
    observation_ids,
    inference,
    decision,
    alternative_explanations,
    validation_hooks,
    source_event_id
  ) values (
    p_student_key,
    p_curriculum_registry_version_id,
    p_skill_id,
    coalesce(p_decision_trace -> 'observation_ids', jsonb_build_array(v_evidence_id::text)),
    coalesce(p_decision_trace -> 'inference', '{}'::jsonb),
    coalesce(p_decision_trace -> 'decision', '{}'::jsonb),
    coalesce(p_decision_trace -> 'alternative_explanations', '[]'::jsonb),
    coalesce(p_decision_trace -> 'validation_hooks', '{}'::jsonb),
    v_event_id
  )
  returning id into v_trace_id;

  return jsonb_build_object(
    'evidence_id', v_evidence_id,
    'state_id', v_state_id,
    'decision_trace_id', v_trace_id,
    'duplicate', false
  );
end;
$$;

revoke all on function private.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) from public, anon;
grant execute on function private.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) to authenticated;

create or replace function public.persist_curriculum_learning_cycle(
  p_student_key text,
  p_curriculum_registry_version_id uuid,
  p_skill_id text,
  p_evidence jsonb,
  p_state jsonb,
  p_decision_trace jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null
     or not private.is_learner_guardian(p_student_key) then
    raise insufficient_privilege using message = 'guardian access to this learner is required';
  end if;

  return private.persist_curriculum_learning_cycle(
    p_student_key,
    p_curriculum_registry_version_id,
    p_skill_id,
    p_evidence,
    p_state,
    p_decision_trace
  );
end;
$$;

revoke all on function public.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) to authenticated;

comment on function private.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) is
  'Private SECURITY DEFINER atomic learning-cycle write. Revalidates auth.uid() and guardian membership; no caller-settable GUC is used as authorization.';
comment on function public.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) is
  'Public SECURITY INVOKER entry point. Delegates the atomic write to a private helper that independently validates authentication and guardian membership.';
