-- PacoGO learner ownership and persistence boundary.
-- TEST-first migration: do not apply to LIVE.
-- The engine continues to use a string student_key; persisted keys are opaque UUID strings.

begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table public.learner_profiles (
  learner_key text primary key default gen_random_uuid()::text,
  display_name text not null check (length(btrim(display_name)) > 0),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learner_profiles_key_is_uuid
    check (learner_key ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$')
);

create index learner_profiles_owner_user_idx
  on public.learner_profiles (owner_user_id);

create table public.learner_guardians (
  learner_key text not null
    references public.learner_profiles(learner_key) on delete cascade,
  guardian_user_id uuid not null references auth.users(id) on delete cascade,
  membership_role text not null default 'owner'
    check (membership_role in ('owner', 'guardian')),
  created_at timestamptz not null default now(),
  primary key (learner_key, guardian_user_id)
);

create index learner_guardians_guardian_user_idx
  on public.learner_guardians (guardian_user_id, learner_key);

create unique index learner_guardians_one_owner_uidx
  on public.learner_guardians (learner_key)
  where membership_role = 'owner';

-- A private, narrowly scoped predicate avoids recursive RLS joins. It can only
-- answer whether the current auth.uid() is linked to the supplied opaque key.
create or replace function private.is_learner_guardian(p_learner_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.learner_guardians as lg
    where lg.learner_key = p_learner_key
      and lg.guardian_user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_learner_guardian(text) from public, anon;
grant execute on function private.is_learner_guardian(text) to authenticated;

-- Profile creation automatically creates exactly one owner membership in the
-- same transaction. The trigger checks the authenticated caller explicitly.
create or replace function private.attach_learner_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null
     or new.owner_user_id <> (select auth.uid()) then
    raise insufficient_privilege using message = 'learner owner must be the authenticated user';
  end if;

  insert into public.learner_guardians (
    learner_key,
    guardian_user_id,
    membership_role
  ) values (
    new.learner_key,
    new.owner_user_id,
    'owner'
  );

  return new;
end;
$$;

revoke all on function private.attach_learner_owner_membership() from public, anon, authenticated;

create trigger learner_profiles_attach_owner_membership
after insert on public.learner_profiles
for each row execute function private.attach_learner_owner_membership();

create or replace function public.create_learner_profile(p_display_name text)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_learner_key text;
begin
  if (select auth.uid()) is null then
    raise insufficient_privilege using message = 'authentication is required';
  end if;

  if p_display_name is null or length(btrim(p_display_name)) = 0 then
    raise invalid_parameter_value using message = 'display name must not be empty';
  end if;

  insert into public.learner_profiles (display_name, owner_user_id)
  values (btrim(p_display_name), (select auth.uid()))
  returning learner_key into v_learner_key;

  return v_learner_key;
end;
$$;

revoke all on function public.create_learner_profile(text) from public, anon;
grant execute on function public.create_learner_profile(text) to authenticated;

alter table public.learner_profiles enable row level security;
alter table public.learner_guardians enable row level security;
alter table public.student_evidence enable row level security;
alter table public.student_longitudinal_state enable row level security;
alter table public.curriculum_decision_trace enable row level security;
alter table public.curriculum_registry_versions enable row level security;

create policy learner_profiles_select_linked_guardians
  on public.learner_profiles
  for select to authenticated
  using (
    owner_user_id = (select auth.uid())
    or (select private.is_learner_guardian(learner_key))
  );

create policy learner_profiles_insert_self_owned
  on public.learner_profiles
  for insert to authenticated
  with check (owner_user_id = (select auth.uid()));

create policy learner_profiles_update_owner
  on public.learner_profiles
  for update to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));

create policy learner_guardians_select_self
  on public.learner_guardians
  for select to authenticated
  using (guardian_user_id = (select auth.uid()));

-- No client INSERT/UPDATE/DELETE policy exists for membership. Initial owner
-- membership is created only by the guarded profile trigger. Additional
-- guardians require a separately designed invitation flow.

-- Recheck the historical keys at migration time. Never infer profiles from names.
do $$
begin
  if exists (
    select 1
    from public.student_evidence e
    left join public.learner_profiles p on p.learner_key = e.student_key
    where p.learner_key is null
  ) or exists (
    select 1
    from public.student_longitudinal_state s
    left join public.learner_profiles p on p.learner_key = s.student_key
    where p.learner_key is null
  ) or exists (
    select 1
    from public.curriculum_decision_trace d
    left join public.learner_profiles p on p.learner_key = d.student_key
    where p.learner_key is null
  ) then
    raise exception 'Existing curriculum learner keys lack an explicit learner profile; migration stopped without mapping';
  end if;
end;
$$;

alter table public.student_evidence
  add constraint student_evidence_learner_profile_fkey
  foreign key (student_key)
  references public.learner_profiles(learner_key)
  on delete restrict;

alter table public.student_longitudinal_state
  add constraint student_longitudinal_state_learner_profile_fkey
  foreign key (student_key)
  references public.learner_profiles(learner_key)
  on delete restrict;

alter table public.curriculum_decision_trace
  add constraint curriculum_decision_trace_learner_profile_fkey
  foreign key (student_key)
  references public.learner_profiles(learner_key)
  on delete restrict;

alter table public.curriculum_decision_trace
  add column source_event_id text;

create unique index curriculum_decision_trace_source_event_uidx
  on public.curriculum_decision_trace (student_key, source_event_id)
  where source_event_id is not null;

alter table public.student_evidence
  add constraint student_evidence_json_objects_check
  check (
    jsonb_typeof(performance) = 'object'
    and jsonb_typeof(observation) = 'object'
    and jsonb_typeof(evidence_assessment) = 'object'
  );

alter table public.student_longitudinal_state
  add constraint student_longitudinal_state_json_shapes_check
  check (
    jsonb_typeof(state) = 'object'
    and jsonb_typeof(alternative_explanations) = 'array'
    and jsonb_typeof(validation_hooks) = 'object'
  );

alter table public.curriculum_decision_trace
  add constraint curriculum_decision_trace_json_shapes_check
  check (
    jsonb_typeof(observation_ids) = 'array'
    and jsonb_typeof(inference) = 'object'
    and jsonb_typeof(decision) = 'object'
    and jsonb_typeof(alternative_explanations) = 'array'
    and jsonb_typeof(validation_hooks) = 'object'
  );

-- Remove every pre-existing permissive learner-data policy. PostgreSQL combines
-- permissive policies with OR, so leaving even one USING (true) policy would
-- nullify the ownership boundary below.
drop policy if exists student_evidence_select_authenticated on public.student_evidence;
drop policy if exists student_evidence_insert_authenticated on public.student_evidence;
drop policy if exists "authenticated can read longitudinal state" on public.student_longitudinal_state;
drop policy if exists "authenticated can insert longitudinal state" on public.student_longitudinal_state;
drop policy if exists "authenticated can update longitudinal state" on public.student_longitudinal_state;
drop policy if exists "authenticated can read decision traces" on public.curriculum_decision_trace;
drop policy if exists "authenticated can insert decision traces" on public.curriculum_decision_trace;

create policy student_evidence_select_linked_guardians
  on public.student_evidence
  for select to authenticated
  using ((select private.is_learner_guardian(student_key)));

create policy student_longitudinal_state_select_linked_guardians
  on public.student_longitudinal_state
  for select to authenticated
  using ((select private.is_learner_guardian(student_key)));

create policy curriculum_decision_trace_select_linked_guardians
  on public.curriculum_decision_trace
  for select to authenticated
  using ((select private.is_learner_guardian(student_key)));

-- Remove the previous global authenticated access and all anon table privileges.
revoke all on public.learner_profiles,
  public.learner_guardians,
  public.student_evidence,
  public.student_longitudinal_state,
  public.curriculum_decision_trace,
  public.curriculum_registry_versions
from anon, authenticated;

grant select, insert, update on public.learner_profiles to authenticated;
grant select on public.learner_guardians to authenticated;
grant select on public.student_evidence to authenticated;
grant select on public.student_longitudinal_state to authenticated;
grant select on public.curriculum_decision_trace to authenticated;
grant select on public.curriculum_registry_versions to authenticated;

-- The application must persist the evidence/state/decision cycle atomically.
-- This narrowly scoped RPC is SECURITY DEFINER because direct INSERT/UPDATE
-- privileges are intentionally withheld. It checks auth.uid() + membership
-- before writing, has a pinned empty search_path, and is executable only by
-- authenticated callers.
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

revoke all on function public.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) to authenticated;

comment on table public.learner_profiles is
  'Pseudonymous learner identity and guardian-visible display label. The opaque learner_key is used by the curriculum engine.';
comment on table public.learner_guardians is
  'Explicit guardian-to-learner membership. Client writes are closed; owner membership is created by the profile trigger.';
comment on function public.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) is
  'Atomically appends one evidence event, upserts its derived longitudinal state, and appends one decision trace. Requires authenticated guardian membership and an idempotent source_event_id.';

commit;
