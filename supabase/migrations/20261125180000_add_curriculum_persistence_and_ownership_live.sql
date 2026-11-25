-- LIVE additive curriculum persistence and learner ownership migration.
-- Source: the verified TEST curriculum/ownership contract, consolidated in its
-- final SECURITY INVOKER form. No existing LIVE lesson, agenda, test, game,
-- legacy Skills, or access table is altered, copied, renamed, or deleted.
-- Existing learner identities are NOT inferred or seeded. Guardian/profile
-- links are created only by the authenticated application flow.
-- The exact v0.6.0-candidate source registry is registered below.

do $preflight$
begin
  if to_regclass('public.curriculum_registry_versions') is not null
     or to_regclass('public.student_evidence') is not null
     or to_regclass('public.student_longitudinal_state') is not null
     or to_regclass('public.curriculum_decision_trace') is not null
     or to_regclass('public.learner_profiles') is not null
     or to_regclass('public.learner_guardians') is not null
     or to_regclass('public.learner_profile_links') is not null then
    raise exception 'LIVE curriculum target objects already exist; stop and reconcile schema before applying';
  end if;
end;
$preflight$;


-- Consolidated source: supabase/migrations/20261101230000_create_curriculum_registry_and_student_evidence.sql
-- PacoGO Curriculum Step 12
-- Versioned curriculum registry + append-only student evidence store.
-- Candidate technical infrastructure only; no empirical validation is implied.

create table if not exists public.curriculum_registry_versions (
  id uuid primary key default gen_random_uuid(),
  registry_key text not null,
  version text not null,
  status text not null default 'candidate'
    check (status in ('candidate', 'supported', 'validated')),
  epistemic_status text not null default '[S]/[O]',
  schema_version text not null,
  source_path text,
  config_sha256 text not null,
  config jsonb not null,
  supersedes_id uuid references public.curriculum_registry_versions(id),
  created_at timestamptz not null default now(),
  unique (registry_key, version),
  unique (config_sha256)
);

create index if not exists curriculum_registry_versions_key_idx
  on public.curriculum_registry_versions (registry_key, created_at desc);

create table if not exists public.student_evidence (
  id uuid primary key default gen_random_uuid(),
  student_key text not null,
  curriculum_registry_version_id uuid not null
    references public.curriculum_registry_versions(id),
  skill_id text not null,
  development_id text,
  claim_id text,
  evidence_target_id text,
  task_model_id text,
  task_instance_id text,
  performance jsonb not null default '{}'::jsonb,
  observation jsonb not null default '{}'::jsonb,
  evidence_assessment jsonb not null default '{}'::jsonb,
  source_event_id text,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists student_evidence_student_time_idx
  on public.student_evidence (student_key, observed_at desc);

create index if not exists student_evidence_skill_time_idx
  on public.student_evidence (student_key, skill_id, observed_at desc);

create index if not exists student_evidence_registry_idx
  on public.student_evidence (curriculum_registry_version_id, skill_id);

create unique index if not exists student_evidence_source_event_uidx
  on public.student_evidence (student_key, source_event_id)
  where source_event_id is not null;

alter table public.curriculum_registry_versions enable row level security;
alter table public.student_evidence enable row level security;

-- application may append evidence. No update/delete policy is intentionally added;
-- evidence is append-only at this layer.
drop policy if exists curriculum_registry_versions_select_authenticated
  on public.curriculum_registry_versions;
create policy curriculum_registry_versions_select_authenticated
  on public.curriculum_registry_versions
  for select to authenticated
  using (true);

drop policy if exists student_evidence_select_authenticated
  on public.student_evidence;
create policy student_evidence_select_authenticated
  on public.student_evidence
  for select to authenticated
  using (true);

drop policy if exists student_evidence_insert_authenticated
  on public.student_evidence;
create policy student_evidence_insert_authenticated
  on public.student_evidence
  for insert to authenticated
  with check (true);

comment on table public.curriculum_registry_versions is
  'Versioned PacoGO curriculum configuration registry. Candidate technical infrastructure; config remains source-controlled and immutable by convention.';
comment on table public.student_evidence is
  'Append-only PacoGO evidence observations linked to an exact curriculum registry version.';
comment on column public.curriculum_registry_versions.status is
  'Empirical status: candidate, supported, or validated within explicit scope.';
comment on column public.student_evidence.evidence_assessment is
  'Claim-relative evidence assessment; not a raw score and not itself a developmental conclusion.';


-- Consolidated source: supabase/migrations/20261102040237_create_curriculum_decision_trace_and_longitudinal_state.sql
-- PacoGO Curriculum Step 13 baseline persistence
-- Derived longitudinal state + append-only decision trace.
-- Candidate technical infrastructure only; no empirical validation is implied.

create table if not exists public.student_longitudinal_state (
  id uuid primary key default gen_random_uuid(),
  student_key text not null,
  curriculum_registry_version_id uuid not null
    references public.curriculum_registry_versions(id),
  skill_id text not null,
  state jsonb not null default '{}'::jsonb,
  last_observed_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (student_key, curriculum_registry_version_id, skill_id)
);

create index if not exists student_longitudinal_state_student_skill_idx
  on public.student_longitudinal_state (student_key, skill_id);

create table if not exists public.curriculum_decision_trace (
  id uuid primary key default gen_random_uuid(),
  student_key text not null,
  curriculum_registry_version_id uuid not null
    references public.curriculum_registry_versions(id),
  skill_id text not null,
  observation_ids jsonb not null default '[]'::jsonb,
  inference jsonb not null default '{}'::jsonb,
  decision jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists curriculum_decision_trace_student_skill_time_idx
  on public.curriculum_decision_trace (student_key, skill_id, created_at desc);

alter table public.student_longitudinal_state enable row level security;
alter table public.curriculum_decision_trace enable row level security;

drop policy if exists student_longitudinal_state_select_authenticated
  on public.student_longitudinal_state;
create policy student_longitudinal_state_select_authenticated
  on public.student_longitudinal_state
  for select to authenticated
  using (true);

drop policy if exists curriculum_decision_trace_select_authenticated
  on public.curriculum_decision_trace;
create policy curriculum_decision_trace_select_authenticated
  on public.curriculum_decision_trace
  for select to authenticated
  using (true);

comment on table public.student_longitudinal_state is
  'Current derived learning state for a student/skill under an exact curriculum registry version. Derived state is not empirical validation.';
comment on table public.curriculum_decision_trace is
  'Append-only trace of evidence-to-inference-to-mastery-to-decision-to-next-action for an exact curriculum registry version.';


-- Consolidated source: supabase/migrations/20261102043000_add_uncertainty_and_validation_hooks.sql
-- PacoGO Curriculum Step 13
-- Alternative explanations, explicit uncertainty and validation-hook metadata.
-- These structures support auditability; they do not create empirical validity.

alter table public.student_longitudinal_state
  add column if not exists alternative_explanations jsonb not null default '[]'::jsonb,
  add column if not exists validation_hooks jsonb not null default '{}'::jsonb;

alter table public.curriculum_decision_trace
  add column if not exists alternative_explanations jsonb not null default '[]'::jsonb,
  add column if not exists validation_hooks jsonb not null default '{}'::jsonb;

comment on column public.student_longitudinal_state.alternative_explanations is
  'Explicit competing interpretations of current evidence; absence does not prove the curriculum explanation is correct.';
comment on column public.student_longitudinal_state.validation_hooks is
  'Machine-readable validation checkpoints and their execution status; not empirical validation results.';
comment on column public.curriculum_decision_trace.alternative_explanations is
  'Competing explanations considered at decision time.';
comment on column public.curriculum_decision_trace.validation_hooks is
  'Validation checkpoints available or evaluated at decision time; not empirical validation results.';


-- Consolidated source: supabase/migrations/20261105024754_add_learner_ownership_and_rls.sql
-- PacoGO learner ownership and persistence boundary.
-- The engine continues to use a string student_key; persisted keys are opaque UUID strings.

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
from public, anon, authenticated;

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


-- Consolidated source: supabase/migrations/20261105030000_switch_learning_cycle_to_invoker.sql
-- Replace the learner-cycle SECURITY DEFINER RPC with an invoker function.
-- Writes remain atomic and are permitted by RLS only while this function's
-- transaction-local capability is active. The capability is cleared on return.

drop policy if exists student_evidence_insert_guardian_cycle on public.student_evidence;
create policy student_evidence_insert_guardian_cycle
  on public.student_evidence
  for insert to authenticated
  with check (
    (select pg_catalog.current_setting('app.pacogo_learning_cycle_write', true))
      = (select auth.uid()::text)
    and (select private.is_learner_guardian(student_key))
  );

drop policy if exists student_longitudinal_state_insert_guardian_cycle on public.student_longitudinal_state;
create policy student_longitudinal_state_insert_guardian_cycle
  on public.student_longitudinal_state
  for insert to authenticated
  with check (
    (select pg_catalog.current_setting('app.pacogo_learning_cycle_write', true))
      = (select auth.uid()::text)
    and (select private.is_learner_guardian(student_key))
  );

drop policy if exists student_longitudinal_state_update_guardian_cycle on public.student_longitudinal_state;
create policy student_longitudinal_state_update_guardian_cycle
  on public.student_longitudinal_state
  for update to authenticated
  using (
    (select pg_catalog.current_setting('app.pacogo_learning_cycle_write', true))
      = (select auth.uid()::text)
    and (select private.is_learner_guardian(student_key))
  )
  with check (
    (select pg_catalog.current_setting('app.pacogo_learning_cycle_write', true))
      = (select auth.uid()::text)
    and (select private.is_learner_guardian(student_key))
  );

drop policy if exists curriculum_decision_trace_insert_guardian_cycle on public.curriculum_decision_trace;
create policy curriculum_decision_trace_insert_guardian_cycle
  on public.curriculum_decision_trace
  for insert to authenticated
  with check (
    (select pg_catalog.current_setting('app.pacogo_learning_cycle_write', true))
      = (select auth.uid()::text)
    and (select private.is_learner_guardian(student_key))
  );

grant insert on public.student_evidence to authenticated;
grant insert, update on public.student_longitudinal_state to authenticated;
grant insert on public.curriculum_decision_trace to authenticated;

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

  -- Transaction-local capability: only this RPC sets it, and it is cleared
  -- before return so subsequent direct REST writes in the same transaction fail.
  perform pg_catalog.set_config(
    'app.pacogo_learning_cycle_write',
    (select auth.uid())::text,
    true
  );

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

    perform pg_catalog.set_config('app.pacogo_learning_cycle_write', '', true);
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

  perform pg_catalog.set_config('app.pacogo_learning_cycle_write', '', true);
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

comment on function public.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) is
  'SECURITY INVOKER atomic learning-cycle write. RLS permits writes only while this RPC holds a transaction-local capability and only for a linked guardian.';


-- Consolidated source: supabase/migrations/20261105030001_factor_learner_write_context_policy.sql
-- Factor transaction-local write-context evaluation into a private helper.
-- This keeps exposed RLS policies simple and lets PostgreSQL cache the
-- request-constant predicate as an initplan.

create or replace function private.learner_cycle_write_enabled()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select
    (select pg_catalog.current_setting('app.pacogo_learning_cycle_write', true))
      = (select auth.uid()::text);
$$;

revoke all on function private.learner_cycle_write_enabled() from public, anon;
grant execute on function private.learner_cycle_write_enabled() to authenticated;

drop policy if exists student_evidence_insert_guardian_cycle on public.student_evidence;
create policy student_evidence_insert_guardian_cycle
  on public.student_evidence
  for insert to authenticated
  with check (
    (select private.learner_cycle_write_enabled())
    and (select private.is_learner_guardian(student_key))
  );

drop policy if exists student_longitudinal_state_insert_guardian_cycle on public.student_longitudinal_state;
create policy student_longitudinal_state_insert_guardian_cycle
  on public.student_longitudinal_state
  for insert to authenticated
  with check (
    (select private.learner_cycle_write_enabled())
    and (select private.is_learner_guardian(student_key))
  );

drop policy if exists student_longitudinal_state_update_guardian_cycle on public.student_longitudinal_state;
create policy student_longitudinal_state_update_guardian_cycle
  on public.student_longitudinal_state
  for update to authenticated
  using (
    (select private.learner_cycle_write_enabled())
    and (select private.is_learner_guardian(student_key))
  )
  with check (
    (select private.learner_cycle_write_enabled())
    and (select private.is_learner_guardian(student_key))
  );

drop policy if exists curriculum_decision_trace_insert_guardian_cycle on public.curriculum_decision_trace;
create policy curriculum_decision_trace_insert_guardian_cycle
  on public.curriculum_decision_trace
  for insert to authenticated
  with check (
    (select private.learner_cycle_write_enabled())
    and (select private.is_learner_guardian(student_key))
  );


-- Consolidated source: supabase/migrations/20261105040000_clear_learning_cycle_capability_on_error.sql
-- Clear the invoker RPC's transaction-local RLS capability on every error path.

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

  -- Transaction-local capability: only this RPC sets it, and it is cleared
  -- before return so subsequent direct REST writes in the same transaction fail.
  perform pg_catalog.set_config(
    'app.pacogo_learning_cycle_write',
    (select auth.uid())::text,
    true
  );

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

    perform pg_catalog.set_config('app.pacogo_learning_cycle_write', '', true);
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

  perform pg_catalog.set_config('app.pacogo_learning_cycle_write', '', true);
  return jsonb_build_object(
    'evidence_id', v_evidence_id,
    'state_id', v_state_id,
    'decision_trace_id', v_trace_id,
    'duplicate', false
  );
exception
  when others then
    -- A transaction-local GUC can survive an exception sub-block. Always
    -- clear it explicitly before propagating the original database error.
    perform pg_catalog.set_config('app.pacogo_learning_cycle_write', '', true);
    raise;
end;
$$;

revoke all on function public.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) to authenticated;

comment on function public.persist_curriculum_learning_cycle(text, uuid, text, jsonb, jsonb, jsonb) is
  'SECURITY INVOKER atomic learning-cycle write. RLS permits writes only while this RPC holds a transaction-local capability; the capability is cleared on success and error.';


-- Consolidated source: supabase/migrations/20261110232751_link_app_students_to_curriculum_learners.sql
-- Explicitly link stable PacoGO roster identities to opaque curriculum learner profiles.
-- be applied to LIVE without a separate deployment decision.

create table public.learner_profile_links (
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  app_student_key text not null
    check (app_student_key ~ '^[a-z][a-z0-9-]{1,63}$'),
  learner_key text not null
    references public.learner_profiles(learner_key) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (owner_user_id, app_student_key),
  unique (learner_key)
);

create index learner_profile_links_owner_idx
  on public.learner_profile_links (owner_user_id);

alter table public.learner_profile_links enable row level security;
revoke all on public.learner_profile_links from public, anon, authenticated;
grant select, insert on public.learner_profile_links to authenticated;

create policy learner_profile_links_select_owner
  on public.learner_profile_links
  for select to authenticated
  using (owner_user_id = (select auth.uid()));

create policy learner_profile_links_insert_owner
  on public.learner_profile_links
  for insert to authenticated
  with check (
    owner_user_id = (select auth.uid())
    and exists (
      select 1
      from public.learner_profiles p
      where p.learner_key = learner_profile_links.learner_key
        and p.owner_user_id = (select auth.uid())
    )
  );

-- Link an already-existing profile. The mapping is explicit; names are never used
-- as identity. One curriculum profile can be linked to only one PacoGO roster key.
create or replace function public.link_app_learner_profile(
  p_app_student_key text,
  p_learner_key text
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_existing text;
begin
  if (select auth.uid()) is null then
    raise insufficient_privilege using message = 'authentication is required';
  end if;
  if p_app_student_key is null or p_app_student_key !~ '^[a-z][a-z0-9-]{1,63}$' then
    raise invalid_parameter_value using message = 'a stable PacoGO student key is required';
  end if;
  if not exists (
    select 1 from public.learner_profiles p
    where p.learner_key = p_learner_key
      and p.owner_user_id = (select auth.uid())
  ) then
    raise insufficient_privilege using message = 'only your own learner profile can be linked';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended((select auth.uid())::text || ':' || p_app_student_key, 0)
  );

  select l.learner_key into v_existing
  from public.learner_profile_links l
  where l.owner_user_id = (select auth.uid())
    and l.app_student_key = p_app_student_key;

  if v_existing is not null then
    if v_existing <> p_learner_key then
      raise unique_violation using message = 'this PacoGO student already has a different curriculum profile';
    end if;
    return v_existing;
  end if;

  insert into public.learner_profile_links (owner_user_id, app_student_key, learner_key)
  values ((select auth.uid()), p_app_student_key, p_learner_key);

  return p_learner_key;
end;
$$;

revoke all on function public.link_app_learner_profile(text, text) from public, anon;
grant execute on function public.link_app_learner_profile(text, text) to authenticated;

-- Provisioning is idempotent per authenticated parent + stable roster key.
-- The advisory lock prevents two simultaneous clicks from creating duplicate profiles.
create or replace function public.create_app_learner_profile(
  p_app_student_key text,
  p_display_name text
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_existing text;
  v_learner_key text;
begin
  if (select auth.uid()) is null then
    raise insufficient_privilege using message = 'authentication is required';
  end if;
  if p_app_student_key is null or p_app_student_key !~ '^[a-z][a-z0-9-]{1,63}$' then
    raise invalid_parameter_value using message = 'a stable PacoGO student key is required';
  end if;
  if p_display_name is null or length(btrim(p_display_name)) = 0 then
    raise invalid_parameter_value using message = 'display name must not be empty';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended((select auth.uid())::text || ':' || p_app_student_key, 0)
  );

  select l.learner_key into v_existing
  from public.learner_profile_links l
  where l.owner_user_id = (select auth.uid())
    and l.app_student_key = p_app_student_key;

  if v_existing is not null then
    return v_existing;
  end if;

  v_learner_key := public.create_learner_profile(btrim(p_display_name));

  insert into public.learner_profile_links (owner_user_id, app_student_key, learner_key)
  values ((select auth.uid()), p_app_student_key, v_learner_key);

  return v_learner_key;
end;
$$;

revoke all on function public.create_app_learner_profile(text, text) from public, anon;
grant execute on function public.create_app_learner_profile(text, text) to authenticated;

comment on table public.learner_profile_links is
  'Explicit owner-scoped mapping from immutable PacoGO roster keys to opaque curriculum learner profiles. Display names are not identity.';
comment on function public.create_app_learner_profile(text, text) is
  'Idempotently creates and links one curriculum learner profile for an existing PacoGO roster identity under the authenticated guardian.';


-- Register the exact source-controlled candidate registry. No learner rows,
-- legacy Skill definitions, assignments, lesson records or history are seeded.
insert into public.curriculum_registry_versions (
  registry_key, version, status, epistemic_status, schema_version,
  source_path, config_sha256, config, supersedes_id
) values (
  'pacogo-curriculum',
  '0.6.0-candidate',
  'candidate',
  '[S]/[O]',
  '0.2',
  'docs/curriculum/PacoGO_Curriculum_Registry_v0.6.json',
  '36853c6107902c29592ecc0906357ad2cc45814befd312ad22096e1e5ab07ba0',
  $pacogo_registry_v06${
  "schema_version": "0.2",
  "registry_version": "0.6.0-candidate",
  "status": "candidate",
  "epistemic_status": "[S]/[O]",
  "source": "A1/B1/B2/B3/B4/B5/FR2 candidate curriculum registry and B10 engine contract",
  "skills": [
    {
      "id": "A1",
      "name": "Getallen representeren en verbinden",
      "definition": "Een getal herkennen, weergeven en verbinden met andere representaties van hetzelfde getal.",
      "developments": [
        {
          "id": "A1.D1",
          "name": "Representational meaning",
          "definition": "Een getal/hoeveelheid als betekenisvolle representatie herkennen.",
          "candidate_order": 1
        },
        {
          "id": "A1.D2",
          "name": "Mapping",
          "definition": "Dezelfde numerieke waarde tussen representaties kunnen koppelen.",
          "candidate_order": 2
        },
        {
          "id": "A1.D3",
          "name": "Coordination",
          "definition": "Meerdere representaties doelgericht en flexibel kunnen coördineren.",
          "candidate_order": 3
        }
      ],
      "claims": [
        {
          "id": "A1.C1",
          "development_id": "A1.D1",
          "definition": "De leerling kan een numerieke representatie betekenisvol identificeren."
        },
        {
          "id": "A1.C2",
          "development_id": "A1.D2",
          "definition": "De leerling kan representaties van dezelfde waarde correct aan elkaar koppelen."
        },
        {
          "id": "A1.C3",
          "development_id": "A1.D3",
          "definition": "De leerling kan meerdere representaties zelfstandig coördineren."
        }
      ],
      "evidence_targets": [
        {
          "id": "A1.ET1",
          "claim_id": "A1.C1",
          "definition": "Correcte identificatie van waarde/hoeveelheid."
        },
        {
          "id": "A1.ET2",
          "claim_id": "A1.C2",
          "definition": "Correcte mapping tussen twee representaties."
        },
        {
          "id": "A1.ET3",
          "claim_id": "A1.C3",
          "definition": "Consistente coördinatie van meerdere representaties."
        },
        {
          "id": "A1.ET4",
          "claim_id": "A1.C2",
          "definition": "Mapping blijft correct wanneer representatie of taakvorm verandert."
        },
        {
          "id": "A1.ET5",
          "claim_id": "A1.C3",
          "definition": "Zelfstandige keuze of combinatie van representaties."
        }
      ],
      "task_models": [
        {
          "id": "A1.TM1",
          "evidence_target_ids": [
            "A1.ET1"
          ],
          "primary_development": "A1.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "A1.TM2",
          "evidence_target_ids": [
            "A1.ET2"
          ],
          "primary_development": "A1.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "A1.TM3",
          "evidence_target_ids": [
            "A1.ET4"
          ],
          "primary_development": "A1.D2",
          "information_value": 3,
          "instructional_relevance": 2
        },
        {
          "id": "A1.TM4",
          "evidence_target_ids": [
            "A1.ET3",
            "A1.ET5"
          ],
          "primary_development": "A1.D3",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "A1.D1",
          "support_threshold": 1
        },
        {
          "development_id": "A1.D2",
          "support_threshold": 2
        },
        {
          "development_id": "A1.D3",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "B1",
      "name": "Optellen",
      "definition": "Twee of meer hoeveelheden/getallen samenvoegen en de totale waarde bepalen.",
      "developments": [
        {
          "id": "B1.D1",
          "name": "Samenvoegen begrijpen",
          "definition": "Begrijpen dat hoeveelheden kunnen worden samengevoegd en dat de totale hoeveelheid de som representeert.",
          "candidate_order": 1
        },
        {
          "id": "B1.D2",
          "name": "Optelling als getalrelatie uitvoeren",
          "definition": "Optellingen representeren en uitvoeren met verschillende getalgroottes en representaties.",
          "candidate_order": 2
        },
        {
          "id": "B1.D3",
          "name": "Strategisch en flexibel optellen",
          "definition": "Een passende aanpak kiezen, uitvoeren en controleren wanneer meerdere oplossingsroutes mogelijk zijn.",
          "candidate_order": 3
        },
        {
          "id": "B1.D4",
          "name": "Geïntegreerd optellen",
          "definition": "Optellen betrouwbaar en flexibel toepassen onder variërende representaties, getalgroottes en contexten.",
          "candidate_order": 4
        }
      ],
      "claims": [
        {
          "id": "B1.C1",
          "development_id": "B1.D1",
          "definition": "De leerling kan de relatie tussen afzonderlijke hoeveelheden en hun totale hoeveelheid betekenisvol representeren."
        },
        {
          "id": "B1.C2",
          "development_id": "B1.D2",
          "definition": "De leerling kan een optelling correct uitvoeren en de relatie tussen termen en som behouden."
        },
        {
          "id": "B1.C3",
          "development_id": "B1.D3",
          "definition": "De leerling kan passend een strategie kiezen en het resultaat controleren."
        },
        {
          "id": "B1.C4",
          "development_id": "B1.D4",
          "definition": "De leerling herkent en gebruikt dezelfde optelrelatie onder relevante variatie."
        }
      ],
      "evidence_targets": [
        {
          "id": "B1.ET1",
          "claim_id": "B1.C1",
          "definition": "Relatiebegrip tussen delen en geheel."
        },
        {
          "id": "B1.ET2",
          "claim_id": "B1.C2",
          "definition": "Representatie van de optelrelatie."
        },
        {
          "id": "B1.ET3",
          "claim_id": "B1.C2",
          "definition": "Correcte uitvoering van de optelling."
        },
        {
          "id": "B1.ET4",
          "claim_id": "B1.C3",
          "definition": "Gekozen aanpak en strategie."
        },
        {
          "id": "B1.ET5",
          "claim_id": "B1.C3",
          "definition": "Controle van het resultaat."
        },
        {
          "id": "B1.ET6",
          "claim_id": "B1.C4",
          "definition": "Robuustheid bij variatie."
        },
        {
          "id": "B1.ET7",
          "claim_id": "B1.C3",
          "definition": "Zelfstandigheid."
        },
        {
          "id": "B1.ET8",
          "claim_id": "B1.C4",
          "definition": "Transfer naar andere representatie of context."
        }
      ],
      "task_models": [
        {
          "id": "B1.TM1",
          "evidence_target_ids": [
            "B1.ET1"
          ],
          "primary_development": "B1.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B1.TM2",
          "evidence_target_ids": [
            "B1.ET1",
            "B1.ET2"
          ],
          "primary_development": "B1.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B1.TM3",
          "evidence_target_ids": [
            "B1.ET3"
          ],
          "primary_development": "B1.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B1.TM4",
          "evidence_target_ids": [
            "B1.ET4",
            "B1.ET5"
          ],
          "primary_development": "B1.D3",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B1.TM5",
          "evidence_target_ids": [
            "B1.ET6"
          ],
          "primary_development": "B1.D4",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B1.TM6",
          "evidence_target_ids": [
            "B1.ET8"
          ],
          "primary_development": "B1.D4",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "B1.D1",
          "support_threshold": 1
        },
        {
          "development_id": "B1.D2",
          "support_threshold": 2
        },
        {
          "development_id": "B1.D3",
          "support_threshold": 2
        },
        {
          "development_id": "B1.D4",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "B2",
      "name": "Aftrekken",
      "definition": "Een verschil of verandering tussen hoeveelheden of waarden bepalen door te begrijpen wat overblijft, wat het verschil is of hoeveel moet worden aangevuld.",
      "developments": [
        {
          "id": "B2.D1",
          "name": "Wegnemen en rest bepalen",
          "definition": "Begrijpen dat een hoeveelheid kan afnemen en bepalen wat overblijft na het wegnemen.",
          "candidate_order": 1
        },
        {
          "id": "B2.D2",
          "name": "Verschil tussen hoeveelheden bepalen",
          "definition": "Het verschil tussen twee hoeveelheden bepalen als afstand of relatie, zonder de situatie uitsluitend als wegnemen te behandelen.",
          "candidate_order": 2
        },
        {
          "id": "B2.D3",
          "name": "Aanvullen tot een doelwaarde",
          "definition": "Een ontbrekende hoeveelheid bepalen door vanaf een gegeven waarde aan te vullen tot een doelwaarde.",
          "candidate_order": 3
        },
        {
          "id": "B2.D4",
          "name": "Aftrekrelaties representeren",
          "definition": "De relatie tussen beginwaarde, afname, rest of verschil betekenisvol representeren met concrete, visuele, getallenlijn- en symbolische vormen.",
          "candidate_order": 4
        },
        {
          "id": "B2.D5",
          "name": "Aftrekken structureren",
          "definition": "Aftrekrelaties doelgericht structureren door ontleden, hergroeperen of compenseren, met behoud van de numerieke waarde.",
          "candidate_order": 5
        },
        {
          "id": "B2.D6",
          "name": "Aftrekken bij grotere getallen en getaltypen",
          "definition": "Aftrekken correct uitvoeren bij grotere gehele en decimale getallen, met behoud van plaatswaarde en betekenis.",
          "candidate_order": 6
        },
        {
          "id": "B2.D7",
          "name": "Flexibel en gecontroleerd aftrekken",
          "definition": "Een passende aanpak kiezen, het resultaat uitvoeren en controleren, en de aftrekrelatie toepassen onder gevarieerde taak- en contextcondities.",
          "candidate_order": 7
        }
      ],
      "claims": [
        {
          "id": "B2.C1",
          "development_id": "B2.D1",
          "definition": "De leerling kan bepalen wat overblijft wanneer een hoeveelheid wordt verminderd en de relatie tussen beginhoeveelheid, afname en rest betekenisvol representeren."
        },
        {
          "id": "B2.C2",
          "development_id": "B2.D2",
          "definition": "De leerling kan het verschil tussen twee hoeveelheden bepalen als een relatie of afstand tussen beide waarden."
        },
        {
          "id": "B2.C3",
          "development_id": "B2.D3",
          "definition": "De leerling kan een ontbrekende hoeveelheid bepalen door aan te vullen vanaf een gegeven waarde tot een doelwaarde."
        },
        {
          "id": "B2.C4",
          "development_id": "B2.D4",
          "definition": "De leerling kan een aftrekrelatie in verschillende representaties weergeven en de onderliggende relatie daarbij behouden."
        },
        {
          "id": "B2.C5",
          "development_id": "B2.D5",
          "definition": "De leerling kan een aftrekrelatie structureren met ontleden, hergroeperen of compenseren zonder de waarde te veranderen."
        },
        {
          "id": "B2.C6",
          "development_id": "B2.D6",
          "definition": "De leerling kan aftrekkingen met grotere gehele en decimale getallen correct uitvoeren met behoud van plaatswaarde."
        },
        {
          "id": "B2.C7",
          "development_id": "B2.D7",
          "definition": "De leerling kan een passende aftrekaanpak kiezen, uitvoeren en het resultaat controleren in gevarieerde situaties."
        }
      ],
      "evidence_targets": [
        {
          "id": "B2.ET1",
          "claim_id": "B2.C1",
          "definition": "Correct bepalen van de resterende hoeveelheid na een gegeven afname."
        },
        {
          "id": "B2.ET2",
          "claim_id": "B2.C1",
          "definition": "De beginhoeveelheid, afname en rest correct aan elkaar relateren."
        },
        {
          "id": "B2.ET3",
          "claim_id": "B2.C2",
          "definition": "Correct bepalen van het verschil tussen twee gegeven hoeveelheden."
        },
        {
          "id": "B2.ET4",
          "claim_id": "B2.C2",
          "definition": "Het verschil correct blijven bepalen wanneer volgorde, representatie of context verandert."
        },
        {
          "id": "B2.ET5",
          "claim_id": "B2.C3",
          "definition": "Correct bepalen van de ontbrekende hoeveelheid tot een doelwaarde."
        },
        {
          "id": "B2.ET6",
          "claim_id": "B2.C3",
          "definition": "De aanvulrelatie tussen startwaarde, ontbrekende hoeveelheid en doelwaarde correct representeren."
        },
        {
          "id": "B2.ET7",
          "claim_id": "B2.C4",
          "definition": "De aftrekrelatie correct representeren in een getallenlijn, model of symbolische notatie."
        },
        {
          "id": "B2.ET8",
          "claim_id": "B2.C4",
          "definition": "Dezelfde aftrekrelatie behouden bij omzetting tussen representaties."
        },
        {
          "id": "B2.ET9",
          "claim_id": "B2.C5",
          "definition": "Een aftrekbewerking correct structureren door getallen te ontleden of te hergroeperen."
        },
        {
          "id": "B2.ET10",
          "claim_id": "B2.C5",
          "definition": "Een structurele transformatie of compensatie toepassen met behoud van de uitkomst."
        },
        {
          "id": "B2.ET11",
          "claim_id": "B2.C6",
          "definition": "Grotere gehele getallen correct aftrekken met behoud van plaatswaarde."
        },
        {
          "id": "B2.ET12",
          "claim_id": "B2.C6",
          "definition": "Decimale getallen correct aftrekken met behoud van de waarde per plaats."
        },
        {
          "id": "B2.ET13",
          "claim_id": "B2.C7",
          "definition": "Een passende aanpak kiezen die past bij de aftrekrelatie en de taakconditie."
        },
        {
          "id": "B2.ET14",
          "claim_id": "B2.C7",
          "definition": "Het resultaat controleren met bijvoorbeeld de inverse optelrelatie of een schatting."
        }
      ],
      "task_models": [
        {
          "id": "B2.TM1",
          "evidence_target_ids": [
            "B2.ET1",
            "B2.ET2"
          ],
          "primary_development": "B2.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B2.TM2",
          "evidence_target_ids": [
            "B2.ET3",
            "B2.ET4"
          ],
          "primary_development": "B2.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B2.TM3",
          "evidence_target_ids": [
            "B2.ET5",
            "B2.ET6"
          ],
          "primary_development": "B2.D3",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B2.TM4",
          "evidence_target_ids": [
            "B2.ET7",
            "B2.ET8"
          ],
          "primary_development": "B2.D4",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B2.TM5",
          "evidence_target_ids": [
            "B2.ET9",
            "B2.ET10"
          ],
          "primary_development": "B2.D5",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B2.TM6",
          "evidence_target_ids": [
            "B2.ET11",
            "B2.ET12"
          ],
          "primary_development": "B2.D6",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B2.TM7",
          "evidence_target_ids": [
            "B2.ET13",
            "B2.ET14"
          ],
          "primary_development": "B2.D7",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "B2.D1",
          "support_threshold": 1
        },
        {
          "development_id": "B2.D2",
          "support_threshold": 2
        },
        {
          "development_id": "B2.D3",
          "support_threshold": 2
        },
        {
          "development_id": "B2.D4",
          "support_threshold": 2
        },
        {
          "development_id": "B2.D5",
          "support_threshold": 2
        },
        {
          "development_id": "B2.D6",
          "support_threshold": 2
        },
        {
          "development_id": "B2.D7",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0,
        "status": "prototype-only",
        "note": "Kandidaatparameters voor technische consistentie; geen empirisch gevalideerde mastery-cut-scores. De B2-oefenroute presenteert geen masterybeslissing aan de leerling."
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "B3",
      "name": "Vermenigvuldigen",
      "definition": "Gelijke groepen, herhaalde hoeveelheden en multiplicatieve relaties begrijpen, representeren en gebruiken om producten en verhoudingen te bepalen.",
      "developments": [
        {
          "id": "B3.D1",
          "name": "Gelijke hoeveelheden herkennen",
          "definition": "Herkennen dat meerdere groepen of eenheden dezelfde hoeveelheid bevatten.",
          "candidate_order": 1
        },
        {
          "id": "B3.D2",
          "name": "Gelijke groepen en arrays begrijpen",
          "definition": "De relatie tussen aantal groepen/rijen, hoeveelheid per groep/kolom en het totale aantal begrijpen en representeren.",
          "candidate_order": 2
        },
        {
          "id": "B3.D3",
          "name": "Herhaald optellen verbinden met vermenigvuldigen",
          "definition": "Herhaalde gelijke hoeveelheden herkennen als een multiplicatieve relatie en deze interpreteren met factoren en product.",
          "candidate_order": 3
        },
        {
          "id": "B3.D4",
          "name": "Multiplicatieve relaties structureren",
          "definition": "Producten structureren met factorontleding, distributiviteit en andere waardebehoudende relaties.",
          "candidate_order": 4
        },
        {
          "id": "B3.D5",
          "name": "Vermenigvuldigen met grotere getallen",
          "definition": "Multiplicatieve relaties uitvoeren met grotere gehele getallen met behoud van plaatswaarde en structuur.",
          "candidate_order": 5
        },
        {
          "id": "B3.D6",
          "name": "Vermenigvuldigen met verschillende getaltypen en representaties",
          "definition": "Multiplicatieve relaties correct interpreteren en uitvoeren bij gehele en decimale getallen en wisselende representaties.",
          "candidate_order": 6
        },
        {
          "id": "B3.D7",
          "name": "Flexibel en gecontroleerd vermenigvuldigen",
          "definition": "Een passende aanpak kiezen, multiplicatieve relaties flexibel gebruiken en producten controleren in gevarieerde situaties.",
          "candidate_order": 7
        }
      ],
      "claims": [
        {
          "id": "B3.C1",
          "development_id": "B3.D1",
          "definition": "De leerling kan gelijke hoeveelheden of eenheden herkennen en vaststellen welke aantallen gelijk zijn."
        },
        {
          "id": "B3.C2",
          "development_id": "B3.D2",
          "definition": "De leerling kan gelijke groepen of arrays representeren en het totaal relateren aan groepsaantal en hoeveelheid per groep."
        },
        {
          "id": "B3.C3",
          "development_id": "B3.D3",
          "definition": "De leerling kan herhaalde gelijke hoeveelheden verbinden met een multiplicatieve relatie en de factoren en het product interpreteren."
        },
        {
          "id": "B3.C4",
          "development_id": "B3.D4",
          "definition": "De leerling kan multiplicatieve relaties structureren met factorontleding en waardebehoudende eigenschappen."
        },
        {
          "id": "B3.C5",
          "development_id": "B3.D5",
          "definition": "De leerling kan producten van grotere gehele getallen correct bepalen met behoud van plaatswaarde en multiplicatieve structuur."
        },
        {
          "id": "B3.C6",
          "development_id": "B3.D6",
          "definition": "De leerling kan vermenigvuldigingsrelaties correct gebruiken bij gehele en decimale getallen en verschillende representaties."
        },
        {
          "id": "B3.C7",
          "development_id": "B3.D7",
          "definition": "De leerling kan een passende vermenigvuldigingsaanpak kiezen, uitvoeren en het product controleren in gevarieerde situaties."
        }
      ],
      "evidence_targets": [
        {
          "id": "B3.ET1",
          "claim_id": "B3.C1",
          "definition": "Gelijke hoeveelheden of eenheden correct herkennen."
        },
        {
          "id": "B3.ET2",
          "claim_id": "B3.C1",
          "definition": "Het aantal gelijke groepen en de hoeveelheid per groep correct identificeren."
        },
        {
          "id": "B3.ET3",
          "claim_id": "B3.C2",
          "definition": "Een array of rechthoekmodel correct interpreteren in rijen, kolommen en totaal."
        },
        {
          "id": "B3.ET4",
          "claim_id": "B3.C2",
          "definition": "Het product correct bepalen vanuit het aantal rijen en kolommen, ook bij gewijzigde oriëntatie."
        },
        {
          "id": "B3.ET5",
          "claim_id": "B3.C3",
          "definition": "Een herhaalde optelstructuur herkennen en verbinden met de bijbehorende vermenigvuldigingsrelatie."
        },
        {
          "id": "B3.ET6",
          "claim_id": "B3.C3",
          "definition": "Factoren en product correct interpreteren in een concrete of symbolische situatie."
        },
        {
          "id": "B3.ET7",
          "claim_id": "B3.C4",
          "definition": "Een product structureren door een factor te ontleden en deelproducten samen te nemen."
        },
        {
          "id": "B3.ET8",
          "claim_id": "B3.C4",
          "definition": "Een waardebehoudende multiplicatieve transformatie toepassen en de productrelatie behouden."
        },
        {
          "id": "B3.ET9",
          "claim_id": "B3.C5",
          "definition": "Grotere gehele getallen correct vermenigvuldigen."
        },
        {
          "id": "B3.ET10",
          "claim_id": "B3.C5",
          "definition": "Plaatswaarde en multiplicatieve structuur behouden bij grotere producten."
        },
        {
          "id": "B3.ET11",
          "claim_id": "B3.C6",
          "definition": "Een product met decimale factoren correct bepalen."
        },
        {
          "id": "B3.ET12",
          "claim_id": "B3.C6",
          "definition": "De betekenis en schaal van een product met decimale getallen correct interpreteren."
        },
        {
          "id": "B3.ET13",
          "claim_id": "B3.C7",
          "definition": "Een passende aanpak kiezen op basis van factoren, getalstructuur en taakconditie."
        },
        {
          "id": "B3.ET14",
          "claim_id": "B3.C7",
          "definition": "Een product controleren met bijvoorbeeld de inverse deelrelatie, een bekende productrelatie of een schatting."
        }
      ],
      "task_models": [
        {
          "id": "B3.TM1",
          "evidence_target_ids": [
            "B3.ET1",
            "B3.ET2"
          ],
          "primary_development": "B3.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B3.TM2",
          "evidence_target_ids": [
            "B3.ET3",
            "B3.ET4"
          ],
          "primary_development": "B3.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B3.TM3",
          "evidence_target_ids": [
            "B3.ET5",
            "B3.ET6"
          ],
          "primary_development": "B3.D3",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B3.TM4",
          "evidence_target_ids": [
            "B3.ET7",
            "B3.ET8"
          ],
          "primary_development": "B3.D4",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B3.TM5",
          "evidence_target_ids": [
            "B3.ET9",
            "B3.ET10"
          ],
          "primary_development": "B3.D5",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B3.TM6",
          "evidence_target_ids": [
            "B3.ET11",
            "B3.ET12"
          ],
          "primary_development": "B3.D6",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B3.TM7",
          "evidence_target_ids": [
            "B3.ET13",
            "B3.ET14"
          ],
          "primary_development": "B3.D7",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "B3.D1",
          "support_threshold": 1
        },
        {
          "development_id": "B3.D2",
          "support_threshold": 2
        },
        {
          "development_id": "B3.D3",
          "support_threshold": 2
        },
        {
          "development_id": "B3.D4",
          "support_threshold": 2
        },
        {
          "development_id": "B3.D5",
          "support_threshold": 2
        },
        {
          "development_id": "B3.D6",
          "support_threshold": 2
        },
        {
          "development_id": "B3.D7",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0,
        "status": "prototype-only",
        "note": "Kandidaatparameters voor technische consistentie; geen empirisch gevalideerde mastery-cut-scores. De B3-oefenroute presenteert geen masterybeslissing aan de leerling."
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "FR2",
      "name": "Breukequivalentie herkennen en gebruiken",
      "definition": "Herkennen wanneer verschillende breuken dezelfde waarde vertegenwoordigen en deze equivalentie gebruiken.",
      "developments": [
        {
          "id": "FR2.D1",
          "name": "Equivalentie herkennen",
          "definition": "Herkennen dat verschillende breuken dezelfde hoeveelheid/waarde kunnen representeren.",
          "candidate_order": 1
        },
        {
          "id": "FR2.D2",
          "name": "Equivalentie verklaren",
          "definition": "Equivalentie onderbouwen via representatie, verhouding of andere betekenisvolle redenering.",
          "candidate_order": 2
        },
        {
          "id": "FR2.D3",
          "name": "Equivalentie functioneel gebruiken",
          "definition": "Equivalentie doelgericht gebruiken om te vergelijken, representeren, rekenen of een probleem eenvoudiger te maken.",
          "candidate_order": 3
        }
      ],
      "claims": [
        {
          "id": "FR2.C1",
          "development_id": "FR2.D1",
          "definition": "De leerling kan equivalentie tussen twee breuken herkennen."
        },
        {
          "id": "FR2.C2",
          "development_id": "FR2.D2",
          "definition": "De leerling kan equivalentie betekenisvol onderbouwen."
        },
        {
          "id": "FR2.C3",
          "development_id": "FR2.D3",
          "definition": "De leerling kan equivalentie inzetten als hulpmiddel voor een ander doel."
        }
      ],
      "evidence_targets": [
        {
          "id": "FR2.ET1",
          "claim_id": "FR2.C1",
          "definition": "Correcte herkenning van equivalente en niet-equivalente paren."
        },
        {
          "id": "FR2.ET2",
          "claim_id": "FR2.C1",
          "definition": "Onderscheid tussen equivalentie en oppervlakkige overeenkomst."
        },
        {
          "id": "FR2.ET3",
          "claim_id": "FR2.C2",
          "definition": "Representatie- of redeneerbewijs dat dezelfde waarde wordt bedoeld."
        },
        {
          "id": "FR2.ET4",
          "claim_id": "FR2.C2",
          "definition": "Equivalentie blijft correct onder gewijzigde representatie."
        },
        {
          "id": "FR2.ET5",
          "claim_id": "FR2.C3",
          "definition": "Functioneel gebruik van equivalentie zonder expliciete aanwijzing."
        },
        {
          "id": "FR2.ET6",
          "claim_id": "FR2.C2",
          "definition": "Contradictorisch bewijs bij correcte uitkomst maar foutieve redenering."
        }
      ],
      "task_models": [
        {
          "id": "FR2.TM1",
          "evidence_target_ids": [
            "FR2.ET1"
          ],
          "primary_development": "FR2.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "FR2.TM2",
          "evidence_target_ids": [
            "FR2.ET3",
            "FR2.ET4"
          ],
          "primary_development": "FR2.D2",
          "information_value": 3,
          "instructional_relevance": 2
        },
        {
          "id": "FR2.TM3",
          "evidence_target_ids": [
            "FR2.ET3"
          ],
          "primary_development": "FR2.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "FR2.TM4",
          "evidence_target_ids": [
            "FR2.ET5"
          ],
          "primary_development": "FR2.D3",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "FR2.TM5",
          "evidence_target_ids": [
            "FR2.ET2",
            "FR2.ET6"
          ],
          "primary_development": "FR2.D2",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "FR2.D1",
          "support_threshold": 1
        },
        {
          "development_id": "FR2.D2",
          "support_threshold": 2
        },
        {
          "development_id": "FR2.D3",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "B4",
      "name": "Delen",
      "definition": "Een hoeveelheid of waarde verdelen of groeperen en de delingsrelatie begrijpen, representeren en gebruiken om quotiënten en ontbrekende factoren te bepalen.",
      "developments": [
        {
          "id": "B4.D1",
          "name": "Gelijke hoeveelheden eerlijk verdelen",
          "definition": "Deel een geheel in gelijke delen en bepaal hoeveel ieder deel krijgt.",
          "candidate_order": 1
        },
        {
          "id": "B4.D2",
          "name": "Groeperen en het aantal groepen bepalen",
          "definition": "Bepaal hoeveel gelijke groepen van een gegeven grootte in een hoeveelheid passen.",
          "candidate_order": 2
        },
        {
          "id": "B4.D3",
          "name": "Deling representeren en interpreteren",
          "definition": "Verbind deelcontexten, groepen, modellen en de symbolische delingsnotatie.",
          "candidate_order": 3
        },
        {
          "id": "B4.D4",
          "name": "Deling verbinden met vermenigvuldiging",
          "definition": "Gebruik de inverse relatie en het ontbrekende-factorverband om delingen te begrijpen.",
          "candidate_order": 4
        },
        {
          "id": "B4.D5",
          "name": "Quotiënt en rest betekenisvol bepalen",
          "definition": "Bepaal quotient en rest en interpreteer wat de rest betekent binnen de situatie.",
          "candidate_order": 5
        },
        {
          "id": "B4.D6",
          "name": "Delen met grotere en decimale getallen",
          "definition": "Behoud plaatswaarde en waarde bij delingen met grotere gehele en decimale getallen.",
          "candidate_order": 6
        },
        {
          "id": "B4.D7",
          "name": "Flexibel en gecontroleerd delen",
          "definition": "Kies een passende deelstrategie en controleer de uitkomst met inverse relaties, schatten of context.",
          "candidate_order": 7
        }
      ],
      "claims": [
        {
          "id": "B4.C1",
          "development_id": "B4.D1",
          "definition": "De leerling kan een hoeveelheid eerlijk verdelen in gelijke delen en de hoeveelheid per deel bepalen."
        },
        {
          "id": "B4.C2",
          "development_id": "B4.D2",
          "definition": "De leerling kan bepalen hoeveel gelijke groepen van een gegeven grootte in een hoeveelheid passen."
        },
        {
          "id": "B4.C3",
          "development_id": "B4.D3",
          "definition": "De leerling kan deling betekenisvol representeren en de relatie tussen deeltal, deler en quotiënt interpreteren."
        },
        {
          "id": "B4.C4",
          "development_id": "B4.D4",
          "definition": "De leerling kan deling verbinden met vermenigvuldiging en een ontbrekende factor bepalen."
        },
        {
          "id": "B4.C5",
          "development_id": "B4.D5",
          "definition": "De leerling kan een quotiënt en eventuele rest correct bepalen en de rest in context interpreteren."
        },
        {
          "id": "B4.C6",
          "development_id": "B4.D6",
          "definition": "De leerling kan delingen met grotere gehele en decimale getallen uitvoeren met behoud van plaatswaarde en waarde."
        },
        {
          "id": "B4.C7",
          "development_id": "B4.D7",
          "definition": "De leerling kan een passende deelstrategie kiezen, uitvoeren en de uitkomst controleren in gevarieerde situaties."
        }
      ],
      "evidence_targets": [
        {
          "id": "B4.ET1",
          "claim_id": "B4.C1",
          "definition": "Een geheel correct verdelen in gelijke delen."
        },
        {
          "id": "B4.ET2",
          "claim_id": "B4.C1",
          "definition": "De hoeveelheid per deel correct bepalen."
        },
        {
          "id": "B4.ET3",
          "claim_id": "B4.C2",
          "definition": "Het aantal gelijke groepen van een gegeven grootte correct bepalen."
        },
        {
          "id": "B4.ET4",
          "claim_id": "B4.C2",
          "definition": "Onderscheid maken tussen hoeveelheid per groep en aantal groepen."
        },
        {
          "id": "B4.ET5",
          "claim_id": "B4.C3",
          "definition": "Een delingssituatie correct representeren met een passend model."
        },
        {
          "id": "B4.ET6",
          "claim_id": "B4.C3",
          "definition": "De relatie tussen deeltal, deler en quotiënt correct interpreteren."
        },
        {
          "id": "B4.ET7",
          "claim_id": "B4.C4",
          "definition": "Een deling verbinden met de bijbehorende vermenigvuldigingsrelatie."
        },
        {
          "id": "B4.ET8",
          "claim_id": "B4.C4",
          "definition": "Een ontbrekende factor correct bepalen vanuit een product."
        },
        {
          "id": "B4.ET9",
          "claim_id": "B4.C5",
          "definition": "Quotiënt en rest correct bepalen."
        },
        {
          "id": "B4.ET10",
          "claim_id": "B4.C5",
          "definition": "De rest passend interpreteren binnen de context."
        },
        {
          "id": "B4.ET11",
          "claim_id": "B4.C6",
          "definition": "Een deling met grotere gehele of decimale getallen correct uitvoeren."
        },
        {
          "id": "B4.ET12",
          "claim_id": "B4.C6",
          "definition": "Plaatswaarde en schaal van het quotiënt correct behouden en interpreteren."
        },
        {
          "id": "B4.ET13",
          "claim_id": "B4.C7",
          "definition": "Een passende aanpak kiezen op basis van getalstructuur en taakconditie."
        },
        {
          "id": "B4.ET14",
          "claim_id": "B4.C7",
          "definition": "Een quotiënt controleren met vermenigvuldiging, schatting of context."
        }
      ],
      "task_models": [
        {
          "id": "B4.TM1",
          "evidence_target_ids": [
            "B4.ET1",
            "B4.ET2"
          ],
          "primary_development": "B4.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B4.TM2",
          "evidence_target_ids": [
            "B4.ET3",
            "B4.ET4"
          ],
          "primary_development": "B4.D2",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B4.TM3",
          "evidence_target_ids": [
            "B4.ET5",
            "B4.ET6"
          ],
          "primary_development": "B4.D3",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B4.TM4",
          "evidence_target_ids": [
            "B4.ET7",
            "B4.ET8"
          ],
          "primary_development": "B4.D4",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B4.TM5",
          "evidence_target_ids": [
            "B4.ET9",
            "B4.ET10"
          ],
          "primary_development": "B4.D5",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B4.TM6",
          "evidence_target_ids": [
            "B4.ET11",
            "B4.ET12"
          ],
          "primary_development": "B4.D6",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B4.TM7",
          "evidence_target_ids": [
            "B4.ET13",
            "B4.ET14"
          ],
          "primary_development": "B4.D7",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "B4.D1",
          "support_threshold": 1
        },
        {
          "development_id": "B4.D2",
          "support_threshold": 2
        },
        {
          "development_id": "B4.D3",
          "support_threshold": 2
        },
        {
          "development_id": "B4.D4",
          "support_threshold": 2
        },
        {
          "development_id": "B4.D5",
          "support_threshold": 2
        },
        {
          "development_id": "B4.D6",
          "support_threshold": 2
        },
        {
          "development_id": "B4.D7",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0,
        "status": "prototype-only",
        "note": "Kandidaatparameters voor technische consistentie; geen empirisch gevalideerde mastery-cut-scores. De B4-oefenroute presenteert geen masterybeslissing aan de leerling."
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "B5",
      "name": "Bewerkingen combineren en structureren",
      "definition": "Meerdere rekenkundige bewerkingen als samenhangende structuur begrijpen, representeren, in de juiste onderlinge relatie uitvoeren en doelgericht controleren.",
      "developments": [
        {
          "id": "B5.D1",
          "name": "Samengestelde bewerkingen herkennen",
          "definition": "Herkennen dat een rekenopgave uit samenhangende bewerkingen bestaat en bepalen welke hoeveelheden en bewerkingen bij elkaar horen.",
          "candidate_order": 1
        },
        {
          "id": "B5.D2",
          "name": "Situaties als bewerkingsstructuur representeren",
          "definition": "Een situatie met meerdere bewerkingen omzetten naar een passende samengestelde rekennotatie, met behoud van de relaties en groepering.",
          "candidate_order": 2
        },
        {
          "id": "B5.D3",
          "name": "Volgorde en afhankelijkheid interpreteren",
          "definition": "Begrijpen welke bewerkingen eerst moeten worden uitgevoerd door haakjes en de afgesproken rekenvolgorde correct te interpreteren.",
          "candidate_order": 3
        },
        {
          "id": "B5.D4",
          "name": "Samengestelde bewerkingen uitvoeren",
          "definition": "Een samengestelde berekening in de juiste volgorde uitvoeren en tussenresultaten correct behouden.",
          "candidate_order": 4
        },
        {
          "id": "B5.D5",
          "name": "Bewerkingsstructuren gelijkwaardig herstructureren",
          "definition": "Een samengestelde bewerkingsstructuur herkennen of omzetten naar een gelijkwaardige structuur zonder de waarde te veranderen.",
          "candidate_order": 5
        },
        {
          "id": "B5.D6",
          "name": "Bewerkingen flexibel combineren en controleren",
          "definition": "In gevarieerde situaties een passende samengestelde structuur selecteren en de uitkomst doelgericht controleren.",
          "candidate_order": 6
        }
      ],
      "claims": [
        {
          "id": "B5.C1",
          "development_id": "B5.D1",
          "definition": "De leerling kan herkennen welke bewerkingen en hoeveelheden in een samengestelde rekenstructuur met elkaar samenhangen."
        },
        {
          "id": "B5.C2",
          "development_id": "B5.D2",
          "definition": "De leerling kan een situatie met meerdere bewerkingen correct representeren in een samengestelde rekennotatie."
        },
        {
          "id": "B5.C3",
          "development_id": "B5.D3",
          "definition": "De leerling kan de onderlinge volgorde en afhankelijkheid van bewerkingen correct interpreteren."
        },
        {
          "id": "B5.C4",
          "development_id": "B5.D4",
          "definition": "De leerling kan een samengestelde berekening correct uitvoeren met behoud van tussenresultaten."
        },
        {
          "id": "B5.C5",
          "development_id": "B5.D5",
          "definition": "De leerling kan gelijkwaardige samengestelde bewerkingsstructuren herkennen of construeren met behoud van waarde."
        },
        {
          "id": "B5.C6",
          "development_id": "B5.D6",
          "definition": "De leerling kan in gevarieerde situaties een passende samengestelde bewerkingsstructuur kiezen en de uitkomst controleren."
        }
      ],
      "evidence_targets": [
        {
          "id": "B5.ET1",
          "claim_id": "B5.C1",
          "definition": "Correct herkennen welke bewerkingen in een samengestelde structuur voorkomen."
        },
        {
          "id": "B5.ET2",
          "claim_id": "B5.C1",
          "definition": "Correct interpreteren hoe de hoeveelheden en bewerkingen onderling samenhangen."
        },
        {
          "id": "B5.ET3",
          "claim_id": "B5.C2",
          "definition": "Een contextuele situatie koppelen aan de juiste samengestelde bewerkingsnotatie."
        },
        {
          "id": "B5.ET4",
          "claim_id": "B5.C2",
          "definition": "Groepering en relaties behouden bij het representeren van een samengestelde situatie."
        },
        {
          "id": "B5.ET5",
          "claim_id": "B5.C3",
          "definition": "De afgesproken voorrangsrelatie tussen haakjes, vermenigvuldigen/delen en optellen/aftrekken correct toepassen."
        },
        {
          "id": "B5.ET6",
          "claim_id": "B5.C3",
          "definition": "Bewerkingen met gelijke voorrang in de afgesproken volgorde interpreteren."
        },
        {
          "id": "B5.ET7",
          "claim_id": "B5.C4",
          "definition": "Een samengestelde berekening correct uitvoeren."
        },
        {
          "id": "B5.ET8",
          "claim_id": "B5.C4",
          "definition": "Tussenresultaten correct gebruiken zonder de oorspronkelijke bewerkingsrelatie te veranderen."
        },
        {
          "id": "B5.ET9",
          "claim_id": "B5.C5",
          "definition": "Een gelijkwaardige herstructurering van een samengestelde bewerking herkennen."
        },
        {
          "id": "B5.ET10",
          "claim_id": "B5.C5",
          "definition": "Waarde behouden bij het herstructureren van een samengestelde bewerking."
        },
        {
          "id": "B5.ET11",
          "claim_id": "B5.C6",
          "definition": "Een passende samengestelde bewerkingsstructuur selecteren in een gevarieerde situatie."
        },
        {
          "id": "B5.ET12",
          "claim_id": "B5.C6",
          "definition": "De uitkomst van een samengestelde berekening passend controleren."
        }
      ],
      "task_models": [
        {
          "id": "B5.TM1",
          "evidence_target_ids": [
            "B5.ET1",
            "B5.ET2"
          ],
          "primary_development": "B5.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B5.TM2",
          "evidence_target_ids": [
            "B5.ET3",
            "B5.ET4"
          ],
          "primary_development": "B5.D2",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B5.TM3",
          "evidence_target_ids": [
            "B5.ET5",
            "B5.ET6"
          ],
          "primary_development": "B5.D3",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B5.TM4",
          "evidence_target_ids": [
            "B5.ET7",
            "B5.ET8"
          ],
          "primary_development": "B5.D4",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B5.TM5",
          "evidence_target_ids": [
            "B5.ET9",
            "B5.ET10"
          ],
          "primary_development": "B5.D5",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B5.TM6",
          "evidence_target_ids": [
            "B5.ET11",
            "B5.ET12"
          ],
          "primary_development": "B5.D6",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "B5.D1",
          "support_threshold": 1
        },
        {
          "development_id": "B5.D2",
          "support_threshold": 2
        },
        {
          "development_id": "B5.D3",
          "support_threshold": 2
        },
        {
          "development_id": "B5.D4",
          "support_threshold": 2
        },
        {
          "development_id": "B5.D5",
          "support_threshold": 2
        },
        {
          "development_id": "B5.D6",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0,
        "status": "prototype-only",
        "note": "Kandidaatparameters voor technische consistentie; geen empirisch gevalideerde mastery-cut-scores. De B5-oefenroute presenteert geen masterybeslissing aan de leerling."
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    }
  ]
}
$pacogo_registry_v06$::jsonb,
  null
)
on conflict (registry_key, version) do nothing;

do $registry_check$
begin
  if not exists (
    select 1
    from public.curriculum_registry_versions r
    where r.registry_key = 'pacogo-curriculum'
      and r.version = '0.6.0-candidate'
      and r.config_sha256 = '36853c6107902c29592ecc0906357ad2cc45814befd312ad22096e1e5ab07ba0'
      and r.config = $pacogo_registry_v06${
  "schema_version": "0.2",
  "registry_version": "0.6.0-candidate",
  "status": "candidate",
  "epistemic_status": "[S]/[O]",
  "source": "A1/B1/B2/B3/B4/B5/FR2 candidate curriculum registry and B10 engine contract",
  "skills": [
    {
      "id": "A1",
      "name": "Getallen representeren en verbinden",
      "definition": "Een getal herkennen, weergeven en verbinden met andere representaties van hetzelfde getal.",
      "developments": [
        {
          "id": "A1.D1",
          "name": "Representational meaning",
          "definition": "Een getal/hoeveelheid als betekenisvolle representatie herkennen.",
          "candidate_order": 1
        },
        {
          "id": "A1.D2",
          "name": "Mapping",
          "definition": "Dezelfde numerieke waarde tussen representaties kunnen koppelen.",
          "candidate_order": 2
        },
        {
          "id": "A1.D3",
          "name": "Coordination",
          "definition": "Meerdere representaties doelgericht en flexibel kunnen coördineren.",
          "candidate_order": 3
        }
      ],
      "claims": [
        {
          "id": "A1.C1",
          "development_id": "A1.D1",
          "definition": "De leerling kan een numerieke representatie betekenisvol identificeren."
        },
        {
          "id": "A1.C2",
          "development_id": "A1.D2",
          "definition": "De leerling kan representaties van dezelfde waarde correct aan elkaar koppelen."
        },
        {
          "id": "A1.C3",
          "development_id": "A1.D3",
          "definition": "De leerling kan meerdere representaties zelfstandig coördineren."
        }
      ],
      "evidence_targets": [
        {
          "id": "A1.ET1",
          "claim_id": "A1.C1",
          "definition": "Correcte identificatie van waarde/hoeveelheid."
        },
        {
          "id": "A1.ET2",
          "claim_id": "A1.C2",
          "definition": "Correcte mapping tussen twee representaties."
        },
        {
          "id": "A1.ET3",
          "claim_id": "A1.C3",
          "definition": "Consistente coördinatie van meerdere representaties."
        },
        {
          "id": "A1.ET4",
          "claim_id": "A1.C2",
          "definition": "Mapping blijft correct wanneer representatie of taakvorm verandert."
        },
        {
          "id": "A1.ET5",
          "claim_id": "A1.C3",
          "definition": "Zelfstandige keuze of combinatie van representaties."
        }
      ],
      "task_models": [
        {
          "id": "A1.TM1",
          "evidence_target_ids": [
            "A1.ET1"
          ],
          "primary_development": "A1.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "A1.TM2",
          "evidence_target_ids": [
            "A1.ET2"
          ],
          "primary_development": "A1.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "A1.TM3",
          "evidence_target_ids": [
            "A1.ET4"
          ],
          "primary_development": "A1.D2",
          "information_value": 3,
          "instructional_relevance": 2
        },
        {
          "id": "A1.TM4",
          "evidence_target_ids": [
            "A1.ET3",
            "A1.ET5"
          ],
          "primary_development": "A1.D3",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "A1.D1",
          "support_threshold": 1
        },
        {
          "development_id": "A1.D2",
          "support_threshold": 2
        },
        {
          "development_id": "A1.D3",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "B1",
      "name": "Optellen",
      "definition": "Twee of meer hoeveelheden/getallen samenvoegen en de totale waarde bepalen.",
      "developments": [
        {
          "id": "B1.D1",
          "name": "Samenvoegen begrijpen",
          "definition": "Begrijpen dat hoeveelheden kunnen worden samengevoegd en dat de totale hoeveelheid de som representeert.",
          "candidate_order": 1
        },
        {
          "id": "B1.D2",
          "name": "Optelling als getalrelatie uitvoeren",
          "definition": "Optellingen representeren en uitvoeren met verschillende getalgroottes en representaties.",
          "candidate_order": 2
        },
        {
          "id": "B1.D3",
          "name": "Strategisch en flexibel optellen",
          "definition": "Een passende aanpak kiezen, uitvoeren en controleren wanneer meerdere oplossingsroutes mogelijk zijn.",
          "candidate_order": 3
        },
        {
          "id": "B1.D4",
          "name": "Geïntegreerd optellen",
          "definition": "Optellen betrouwbaar en flexibel toepassen onder variërende representaties, getalgroottes en contexten.",
          "candidate_order": 4
        }
      ],
      "claims": [
        {
          "id": "B1.C1",
          "development_id": "B1.D1",
          "definition": "De leerling kan de relatie tussen afzonderlijke hoeveelheden en hun totale hoeveelheid betekenisvol representeren."
        },
        {
          "id": "B1.C2",
          "development_id": "B1.D2",
          "definition": "De leerling kan een optelling correct uitvoeren en de relatie tussen termen en som behouden."
        },
        {
          "id": "B1.C3",
          "development_id": "B1.D3",
          "definition": "De leerling kan passend een strategie kiezen en het resultaat controleren."
        },
        {
          "id": "B1.C4",
          "development_id": "B1.D4",
          "definition": "De leerling herkent en gebruikt dezelfde optelrelatie onder relevante variatie."
        }
      ],
      "evidence_targets": [
        {
          "id": "B1.ET1",
          "claim_id": "B1.C1",
          "definition": "Relatiebegrip tussen delen en geheel."
        },
        {
          "id": "B1.ET2",
          "claim_id": "B1.C2",
          "definition": "Representatie van de optelrelatie."
        },
        {
          "id": "B1.ET3",
          "claim_id": "B1.C2",
          "definition": "Correcte uitvoering van de optelling."
        },
        {
          "id": "B1.ET4",
          "claim_id": "B1.C3",
          "definition": "Gekozen aanpak en strategie."
        },
        {
          "id": "B1.ET5",
          "claim_id": "B1.C3",
          "definition": "Controle van het resultaat."
        },
        {
          "id": "B1.ET6",
          "claim_id": "B1.C4",
          "definition": "Robuustheid bij variatie."
        },
        {
          "id": "B1.ET7",
          "claim_id": "B1.C3",
          "definition": "Zelfstandigheid."
        },
        {
          "id": "B1.ET8",
          "claim_id": "B1.C4",
          "definition": "Transfer naar andere representatie of context."
        }
      ],
      "task_models": [
        {
          "id": "B1.TM1",
          "evidence_target_ids": [
            "B1.ET1"
          ],
          "primary_development": "B1.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B1.TM2",
          "evidence_target_ids": [
            "B1.ET1",
            "B1.ET2"
          ],
          "primary_development": "B1.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B1.TM3",
          "evidence_target_ids": [
            "B1.ET3"
          ],
          "primary_development": "B1.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B1.TM4",
          "evidence_target_ids": [
            "B1.ET4",
            "B1.ET5"
          ],
          "primary_development": "B1.D3",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B1.TM5",
          "evidence_target_ids": [
            "B1.ET6"
          ],
          "primary_development": "B1.D4",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B1.TM6",
          "evidence_target_ids": [
            "B1.ET8"
          ],
          "primary_development": "B1.D4",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "B1.D1",
          "support_threshold": 1
        },
        {
          "development_id": "B1.D2",
          "support_threshold": 2
        },
        {
          "development_id": "B1.D3",
          "support_threshold": 2
        },
        {
          "development_id": "B1.D4",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "B2",
      "name": "Aftrekken",
      "definition": "Een verschil of verandering tussen hoeveelheden of waarden bepalen door te begrijpen wat overblijft, wat het verschil is of hoeveel moet worden aangevuld.",
      "developments": [
        {
          "id": "B2.D1",
          "name": "Wegnemen en rest bepalen",
          "definition": "Begrijpen dat een hoeveelheid kan afnemen en bepalen wat overblijft na het wegnemen.",
          "candidate_order": 1
        },
        {
          "id": "B2.D2",
          "name": "Verschil tussen hoeveelheden bepalen",
          "definition": "Het verschil tussen twee hoeveelheden bepalen als afstand of relatie, zonder de situatie uitsluitend als wegnemen te behandelen.",
          "candidate_order": 2
        },
        {
          "id": "B2.D3",
          "name": "Aanvullen tot een doelwaarde",
          "definition": "Een ontbrekende hoeveelheid bepalen door vanaf een gegeven waarde aan te vullen tot een doelwaarde.",
          "candidate_order": 3
        },
        {
          "id": "B2.D4",
          "name": "Aftrekrelaties representeren",
          "definition": "De relatie tussen beginwaarde, afname, rest of verschil betekenisvol representeren met concrete, visuele, getallenlijn- en symbolische vormen.",
          "candidate_order": 4
        },
        {
          "id": "B2.D5",
          "name": "Aftrekken structureren",
          "definition": "Aftrekrelaties doelgericht structureren door ontleden, hergroeperen of compenseren, met behoud van de numerieke waarde.",
          "candidate_order": 5
        },
        {
          "id": "B2.D6",
          "name": "Aftrekken bij grotere getallen en getaltypen",
          "definition": "Aftrekken correct uitvoeren bij grotere gehele en decimale getallen, met behoud van plaatswaarde en betekenis.",
          "candidate_order": 6
        },
        {
          "id": "B2.D7",
          "name": "Flexibel en gecontroleerd aftrekken",
          "definition": "Een passende aanpak kiezen, het resultaat uitvoeren en controleren, en de aftrekrelatie toepassen onder gevarieerde taak- en contextcondities.",
          "candidate_order": 7
        }
      ],
      "claims": [
        {
          "id": "B2.C1",
          "development_id": "B2.D1",
          "definition": "De leerling kan bepalen wat overblijft wanneer een hoeveelheid wordt verminderd en de relatie tussen beginhoeveelheid, afname en rest betekenisvol representeren."
        },
        {
          "id": "B2.C2",
          "development_id": "B2.D2",
          "definition": "De leerling kan het verschil tussen twee hoeveelheden bepalen als een relatie of afstand tussen beide waarden."
        },
        {
          "id": "B2.C3",
          "development_id": "B2.D3",
          "definition": "De leerling kan een ontbrekende hoeveelheid bepalen door aan te vullen vanaf een gegeven waarde tot een doelwaarde."
        },
        {
          "id": "B2.C4",
          "development_id": "B2.D4",
          "definition": "De leerling kan een aftrekrelatie in verschillende representaties weergeven en de onderliggende relatie daarbij behouden."
        },
        {
          "id": "B2.C5",
          "development_id": "B2.D5",
          "definition": "De leerling kan een aftrekrelatie structureren met ontleden, hergroeperen of compenseren zonder de waarde te veranderen."
        },
        {
          "id": "B2.C6",
          "development_id": "B2.D6",
          "definition": "De leerling kan aftrekkingen met grotere gehele en decimale getallen correct uitvoeren met behoud van plaatswaarde."
        },
        {
          "id": "B2.C7",
          "development_id": "B2.D7",
          "definition": "De leerling kan een passende aftrekaanpak kiezen, uitvoeren en het resultaat controleren in gevarieerde situaties."
        }
      ],
      "evidence_targets": [
        {
          "id": "B2.ET1",
          "claim_id": "B2.C1",
          "definition": "Correct bepalen van de resterende hoeveelheid na een gegeven afname."
        },
        {
          "id": "B2.ET2",
          "claim_id": "B2.C1",
          "definition": "De beginhoeveelheid, afname en rest correct aan elkaar relateren."
        },
        {
          "id": "B2.ET3",
          "claim_id": "B2.C2",
          "definition": "Correct bepalen van het verschil tussen twee gegeven hoeveelheden."
        },
        {
          "id": "B2.ET4",
          "claim_id": "B2.C2",
          "definition": "Het verschil correct blijven bepalen wanneer volgorde, representatie of context verandert."
        },
        {
          "id": "B2.ET5",
          "claim_id": "B2.C3",
          "definition": "Correct bepalen van de ontbrekende hoeveelheid tot een doelwaarde."
        },
        {
          "id": "B2.ET6",
          "claim_id": "B2.C3",
          "definition": "De aanvulrelatie tussen startwaarde, ontbrekende hoeveelheid en doelwaarde correct representeren."
        },
        {
          "id": "B2.ET7",
          "claim_id": "B2.C4",
          "definition": "De aftrekrelatie correct representeren in een getallenlijn, model of symbolische notatie."
        },
        {
          "id": "B2.ET8",
          "claim_id": "B2.C4",
          "definition": "Dezelfde aftrekrelatie behouden bij omzetting tussen representaties."
        },
        {
          "id": "B2.ET9",
          "claim_id": "B2.C5",
          "definition": "Een aftrekbewerking correct structureren door getallen te ontleden of te hergroeperen."
        },
        {
          "id": "B2.ET10",
          "claim_id": "B2.C5",
          "definition": "Een structurele transformatie of compensatie toepassen met behoud van de uitkomst."
        },
        {
          "id": "B2.ET11",
          "claim_id": "B2.C6",
          "definition": "Grotere gehele getallen correct aftrekken met behoud van plaatswaarde."
        },
        {
          "id": "B2.ET12",
          "claim_id": "B2.C6",
          "definition": "Decimale getallen correct aftrekken met behoud van de waarde per plaats."
        },
        {
          "id": "B2.ET13",
          "claim_id": "B2.C7",
          "definition": "Een passende aanpak kiezen die past bij de aftrekrelatie en de taakconditie."
        },
        {
          "id": "B2.ET14",
          "claim_id": "B2.C7",
          "definition": "Het resultaat controleren met bijvoorbeeld de inverse optelrelatie of een schatting."
        }
      ],
      "task_models": [
        {
          "id": "B2.TM1",
          "evidence_target_ids": [
            "B2.ET1",
            "B2.ET2"
          ],
          "primary_development": "B2.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B2.TM2",
          "evidence_target_ids": [
            "B2.ET3",
            "B2.ET4"
          ],
          "primary_development": "B2.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B2.TM3",
          "evidence_target_ids": [
            "B2.ET5",
            "B2.ET6"
          ],
          "primary_development": "B2.D3",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B2.TM4",
          "evidence_target_ids": [
            "B2.ET7",
            "B2.ET8"
          ],
          "primary_development": "B2.D4",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B2.TM5",
          "evidence_target_ids": [
            "B2.ET9",
            "B2.ET10"
          ],
          "primary_development": "B2.D5",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B2.TM6",
          "evidence_target_ids": [
            "B2.ET11",
            "B2.ET12"
          ],
          "primary_development": "B2.D6",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B2.TM7",
          "evidence_target_ids": [
            "B2.ET13",
            "B2.ET14"
          ],
          "primary_development": "B2.D7",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "B2.D1",
          "support_threshold": 1
        },
        {
          "development_id": "B2.D2",
          "support_threshold": 2
        },
        {
          "development_id": "B2.D3",
          "support_threshold": 2
        },
        {
          "development_id": "B2.D4",
          "support_threshold": 2
        },
        {
          "development_id": "B2.D5",
          "support_threshold": 2
        },
        {
          "development_id": "B2.D6",
          "support_threshold": 2
        },
        {
          "development_id": "B2.D7",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0,
        "status": "prototype-only",
        "note": "Kandidaatparameters voor technische consistentie; geen empirisch gevalideerde mastery-cut-scores. De B2-oefenroute presenteert geen masterybeslissing aan de leerling."
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "B3",
      "name": "Vermenigvuldigen",
      "definition": "Gelijke groepen, herhaalde hoeveelheden en multiplicatieve relaties begrijpen, representeren en gebruiken om producten en verhoudingen te bepalen.",
      "developments": [
        {
          "id": "B3.D1",
          "name": "Gelijke hoeveelheden herkennen",
          "definition": "Herkennen dat meerdere groepen of eenheden dezelfde hoeveelheid bevatten.",
          "candidate_order": 1
        },
        {
          "id": "B3.D2",
          "name": "Gelijke groepen en arrays begrijpen",
          "definition": "De relatie tussen aantal groepen/rijen, hoeveelheid per groep/kolom en het totale aantal begrijpen en representeren.",
          "candidate_order": 2
        },
        {
          "id": "B3.D3",
          "name": "Herhaald optellen verbinden met vermenigvuldigen",
          "definition": "Herhaalde gelijke hoeveelheden herkennen als een multiplicatieve relatie en deze interpreteren met factoren en product.",
          "candidate_order": 3
        },
        {
          "id": "B3.D4",
          "name": "Multiplicatieve relaties structureren",
          "definition": "Producten structureren met factorontleding, distributiviteit en andere waardebehoudende relaties.",
          "candidate_order": 4
        },
        {
          "id": "B3.D5",
          "name": "Vermenigvuldigen met grotere getallen",
          "definition": "Multiplicatieve relaties uitvoeren met grotere gehele getallen met behoud van plaatswaarde en structuur.",
          "candidate_order": 5
        },
        {
          "id": "B3.D6",
          "name": "Vermenigvuldigen met verschillende getaltypen en representaties",
          "definition": "Multiplicatieve relaties correct interpreteren en uitvoeren bij gehele en decimale getallen en wisselende representaties.",
          "candidate_order": 6
        },
        {
          "id": "B3.D7",
          "name": "Flexibel en gecontroleerd vermenigvuldigen",
          "definition": "Een passende aanpak kiezen, multiplicatieve relaties flexibel gebruiken en producten controleren in gevarieerde situaties.",
          "candidate_order": 7
        }
      ],
      "claims": [
        {
          "id": "B3.C1",
          "development_id": "B3.D1",
          "definition": "De leerling kan gelijke hoeveelheden of eenheden herkennen en vaststellen welke aantallen gelijk zijn."
        },
        {
          "id": "B3.C2",
          "development_id": "B3.D2",
          "definition": "De leerling kan gelijke groepen of arrays representeren en het totaal relateren aan groepsaantal en hoeveelheid per groep."
        },
        {
          "id": "B3.C3",
          "development_id": "B3.D3",
          "definition": "De leerling kan herhaalde gelijke hoeveelheden verbinden met een multiplicatieve relatie en de factoren en het product interpreteren."
        },
        {
          "id": "B3.C4",
          "development_id": "B3.D4",
          "definition": "De leerling kan multiplicatieve relaties structureren met factorontleding en waardebehoudende eigenschappen."
        },
        {
          "id": "B3.C5",
          "development_id": "B3.D5",
          "definition": "De leerling kan producten van grotere gehele getallen correct bepalen met behoud van plaatswaarde en multiplicatieve structuur."
        },
        {
          "id": "B3.C6",
          "development_id": "B3.D6",
          "definition": "De leerling kan vermenigvuldigingsrelaties correct gebruiken bij gehele en decimale getallen en verschillende representaties."
        },
        {
          "id": "B3.C7",
          "development_id": "B3.D7",
          "definition": "De leerling kan een passende vermenigvuldigingsaanpak kiezen, uitvoeren en het product controleren in gevarieerde situaties."
        }
      ],
      "evidence_targets": [
        {
          "id": "B3.ET1",
          "claim_id": "B3.C1",
          "definition": "Gelijke hoeveelheden of eenheden correct herkennen."
        },
        {
          "id": "B3.ET2",
          "claim_id": "B3.C1",
          "definition": "Het aantal gelijke groepen en de hoeveelheid per groep correct identificeren."
        },
        {
          "id": "B3.ET3",
          "claim_id": "B3.C2",
          "definition": "Een array of rechthoekmodel correct interpreteren in rijen, kolommen en totaal."
        },
        {
          "id": "B3.ET4",
          "claim_id": "B3.C2",
          "definition": "Het product correct bepalen vanuit het aantal rijen en kolommen, ook bij gewijzigde oriëntatie."
        },
        {
          "id": "B3.ET5",
          "claim_id": "B3.C3",
          "definition": "Een herhaalde optelstructuur herkennen en verbinden met de bijbehorende vermenigvuldigingsrelatie."
        },
        {
          "id": "B3.ET6",
          "claim_id": "B3.C3",
          "definition": "Factoren en product correct interpreteren in een concrete of symbolische situatie."
        },
        {
          "id": "B3.ET7",
          "claim_id": "B3.C4",
          "definition": "Een product structureren door een factor te ontleden en deelproducten samen te nemen."
        },
        {
          "id": "B3.ET8",
          "claim_id": "B3.C4",
          "definition": "Een waardebehoudende multiplicatieve transformatie toepassen en de productrelatie behouden."
        },
        {
          "id": "B3.ET9",
          "claim_id": "B3.C5",
          "definition": "Grotere gehele getallen correct vermenigvuldigen."
        },
        {
          "id": "B3.ET10",
          "claim_id": "B3.C5",
          "definition": "Plaatswaarde en multiplicatieve structuur behouden bij grotere producten."
        },
        {
          "id": "B3.ET11",
          "claim_id": "B3.C6",
          "definition": "Een product met decimale factoren correct bepalen."
        },
        {
          "id": "B3.ET12",
          "claim_id": "B3.C6",
          "definition": "De betekenis en schaal van een product met decimale getallen correct interpreteren."
        },
        {
          "id": "B3.ET13",
          "claim_id": "B3.C7",
          "definition": "Een passende aanpak kiezen op basis van factoren, getalstructuur en taakconditie."
        },
        {
          "id": "B3.ET14",
          "claim_id": "B3.C7",
          "definition": "Een product controleren met bijvoorbeeld de inverse deelrelatie, een bekende productrelatie of een schatting."
        }
      ],
      "task_models": [
        {
          "id": "B3.TM1",
          "evidence_target_ids": [
            "B3.ET1",
            "B3.ET2"
          ],
          "primary_development": "B3.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B3.TM2",
          "evidence_target_ids": [
            "B3.ET3",
            "B3.ET4"
          ],
          "primary_development": "B3.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B3.TM3",
          "evidence_target_ids": [
            "B3.ET5",
            "B3.ET6"
          ],
          "primary_development": "B3.D3",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B3.TM4",
          "evidence_target_ids": [
            "B3.ET7",
            "B3.ET8"
          ],
          "primary_development": "B3.D4",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B3.TM5",
          "evidence_target_ids": [
            "B3.ET9",
            "B3.ET10"
          ],
          "primary_development": "B3.D5",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B3.TM6",
          "evidence_target_ids": [
            "B3.ET11",
            "B3.ET12"
          ],
          "primary_development": "B3.D6",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B3.TM7",
          "evidence_target_ids": [
            "B3.ET13",
            "B3.ET14"
          ],
          "primary_development": "B3.D7",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "B3.D1",
          "support_threshold": 1
        },
        {
          "development_id": "B3.D2",
          "support_threshold": 2
        },
        {
          "development_id": "B3.D3",
          "support_threshold": 2
        },
        {
          "development_id": "B3.D4",
          "support_threshold": 2
        },
        {
          "development_id": "B3.D5",
          "support_threshold": 2
        },
        {
          "development_id": "B3.D6",
          "support_threshold": 2
        },
        {
          "development_id": "B3.D7",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0,
        "status": "prototype-only",
        "note": "Kandidaatparameters voor technische consistentie; geen empirisch gevalideerde mastery-cut-scores. De B3-oefenroute presenteert geen masterybeslissing aan de leerling."
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "FR2",
      "name": "Breukequivalentie herkennen en gebruiken",
      "definition": "Herkennen wanneer verschillende breuken dezelfde waarde vertegenwoordigen en deze equivalentie gebruiken.",
      "developments": [
        {
          "id": "FR2.D1",
          "name": "Equivalentie herkennen",
          "definition": "Herkennen dat verschillende breuken dezelfde hoeveelheid/waarde kunnen representeren.",
          "candidate_order": 1
        },
        {
          "id": "FR2.D2",
          "name": "Equivalentie verklaren",
          "definition": "Equivalentie onderbouwen via representatie, verhouding of andere betekenisvolle redenering.",
          "candidate_order": 2
        },
        {
          "id": "FR2.D3",
          "name": "Equivalentie functioneel gebruiken",
          "definition": "Equivalentie doelgericht gebruiken om te vergelijken, representeren, rekenen of een probleem eenvoudiger te maken.",
          "candidate_order": 3
        }
      ],
      "claims": [
        {
          "id": "FR2.C1",
          "development_id": "FR2.D1",
          "definition": "De leerling kan equivalentie tussen twee breuken herkennen."
        },
        {
          "id": "FR2.C2",
          "development_id": "FR2.D2",
          "definition": "De leerling kan equivalentie betekenisvol onderbouwen."
        },
        {
          "id": "FR2.C3",
          "development_id": "FR2.D3",
          "definition": "De leerling kan equivalentie inzetten als hulpmiddel voor een ander doel."
        }
      ],
      "evidence_targets": [
        {
          "id": "FR2.ET1",
          "claim_id": "FR2.C1",
          "definition": "Correcte herkenning van equivalente en niet-equivalente paren."
        },
        {
          "id": "FR2.ET2",
          "claim_id": "FR2.C1",
          "definition": "Onderscheid tussen equivalentie en oppervlakkige overeenkomst."
        },
        {
          "id": "FR2.ET3",
          "claim_id": "FR2.C2",
          "definition": "Representatie- of redeneerbewijs dat dezelfde waarde wordt bedoeld."
        },
        {
          "id": "FR2.ET4",
          "claim_id": "FR2.C2",
          "definition": "Equivalentie blijft correct onder gewijzigde representatie."
        },
        {
          "id": "FR2.ET5",
          "claim_id": "FR2.C3",
          "definition": "Functioneel gebruik van equivalentie zonder expliciete aanwijzing."
        },
        {
          "id": "FR2.ET6",
          "claim_id": "FR2.C2",
          "definition": "Contradictorisch bewijs bij correcte uitkomst maar foutieve redenering."
        }
      ],
      "task_models": [
        {
          "id": "FR2.TM1",
          "evidence_target_ids": [
            "FR2.ET1"
          ],
          "primary_development": "FR2.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "FR2.TM2",
          "evidence_target_ids": [
            "FR2.ET3",
            "FR2.ET4"
          ],
          "primary_development": "FR2.D2",
          "information_value": 3,
          "instructional_relevance": 2
        },
        {
          "id": "FR2.TM3",
          "evidence_target_ids": [
            "FR2.ET3"
          ],
          "primary_development": "FR2.D2",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "FR2.TM4",
          "evidence_target_ids": [
            "FR2.ET5"
          ],
          "primary_development": "FR2.D3",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "FR2.TM5",
          "evidence_target_ids": [
            "FR2.ET2",
            "FR2.ET6"
          ],
          "primary_development": "FR2.D2",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "FR2.D1",
          "support_threshold": 1
        },
        {
          "development_id": "FR2.D2",
          "support_threshold": 2
        },
        {
          "development_id": "FR2.D3",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "B4",
      "name": "Delen",
      "definition": "Een hoeveelheid of waarde verdelen of groeperen en de delingsrelatie begrijpen, representeren en gebruiken om quotiënten en ontbrekende factoren te bepalen.",
      "developments": [
        {
          "id": "B4.D1",
          "name": "Gelijke hoeveelheden eerlijk verdelen",
          "definition": "Deel een geheel in gelijke delen en bepaal hoeveel ieder deel krijgt.",
          "candidate_order": 1
        },
        {
          "id": "B4.D2",
          "name": "Groeperen en het aantal groepen bepalen",
          "definition": "Bepaal hoeveel gelijke groepen van een gegeven grootte in een hoeveelheid passen.",
          "candidate_order": 2
        },
        {
          "id": "B4.D3",
          "name": "Deling representeren en interpreteren",
          "definition": "Verbind deelcontexten, groepen, modellen en de symbolische delingsnotatie.",
          "candidate_order": 3
        },
        {
          "id": "B4.D4",
          "name": "Deling verbinden met vermenigvuldiging",
          "definition": "Gebruik de inverse relatie en het ontbrekende-factorverband om delingen te begrijpen.",
          "candidate_order": 4
        },
        {
          "id": "B4.D5",
          "name": "Quotiënt en rest betekenisvol bepalen",
          "definition": "Bepaal quotient en rest en interpreteer wat de rest betekent binnen de situatie.",
          "candidate_order": 5
        },
        {
          "id": "B4.D6",
          "name": "Delen met grotere en decimale getallen",
          "definition": "Behoud plaatswaarde en waarde bij delingen met grotere gehele en decimale getallen.",
          "candidate_order": 6
        },
        {
          "id": "B4.D7",
          "name": "Flexibel en gecontroleerd delen",
          "definition": "Kies een passende deelstrategie en controleer de uitkomst met inverse relaties, schatten of context.",
          "candidate_order": 7
        }
      ],
      "claims": [
        {
          "id": "B4.C1",
          "development_id": "B4.D1",
          "definition": "De leerling kan een hoeveelheid eerlijk verdelen in gelijke delen en de hoeveelheid per deel bepalen."
        },
        {
          "id": "B4.C2",
          "development_id": "B4.D2",
          "definition": "De leerling kan bepalen hoeveel gelijke groepen van een gegeven grootte in een hoeveelheid passen."
        },
        {
          "id": "B4.C3",
          "development_id": "B4.D3",
          "definition": "De leerling kan deling betekenisvol representeren en de relatie tussen deeltal, deler en quotiënt interpreteren."
        },
        {
          "id": "B4.C4",
          "development_id": "B4.D4",
          "definition": "De leerling kan deling verbinden met vermenigvuldiging en een ontbrekende factor bepalen."
        },
        {
          "id": "B4.C5",
          "development_id": "B4.D5",
          "definition": "De leerling kan een quotiënt en eventuele rest correct bepalen en de rest in context interpreteren."
        },
        {
          "id": "B4.C6",
          "development_id": "B4.D6",
          "definition": "De leerling kan delingen met grotere gehele en decimale getallen uitvoeren met behoud van plaatswaarde en waarde."
        },
        {
          "id": "B4.C7",
          "development_id": "B4.D7",
          "definition": "De leerling kan een passende deelstrategie kiezen, uitvoeren en de uitkomst controleren in gevarieerde situaties."
        }
      ],
      "evidence_targets": [
        {
          "id": "B4.ET1",
          "claim_id": "B4.C1",
          "definition": "Een geheel correct verdelen in gelijke delen."
        },
        {
          "id": "B4.ET2",
          "claim_id": "B4.C1",
          "definition": "De hoeveelheid per deel correct bepalen."
        },
        {
          "id": "B4.ET3",
          "claim_id": "B4.C2",
          "definition": "Het aantal gelijke groepen van een gegeven grootte correct bepalen."
        },
        {
          "id": "B4.ET4",
          "claim_id": "B4.C2",
          "definition": "Onderscheid maken tussen hoeveelheid per groep en aantal groepen."
        },
        {
          "id": "B4.ET5",
          "claim_id": "B4.C3",
          "definition": "Een delingssituatie correct representeren met een passend model."
        },
        {
          "id": "B4.ET6",
          "claim_id": "B4.C3",
          "definition": "De relatie tussen deeltal, deler en quotiënt correct interpreteren."
        },
        {
          "id": "B4.ET7",
          "claim_id": "B4.C4",
          "definition": "Een deling verbinden met de bijbehorende vermenigvuldigingsrelatie."
        },
        {
          "id": "B4.ET8",
          "claim_id": "B4.C4",
          "definition": "Een ontbrekende factor correct bepalen vanuit een product."
        },
        {
          "id": "B4.ET9",
          "claim_id": "B4.C5",
          "definition": "Quotiënt en rest correct bepalen."
        },
        {
          "id": "B4.ET10",
          "claim_id": "B4.C5",
          "definition": "De rest passend interpreteren binnen de context."
        },
        {
          "id": "B4.ET11",
          "claim_id": "B4.C6",
          "definition": "Een deling met grotere gehele of decimale getallen correct uitvoeren."
        },
        {
          "id": "B4.ET12",
          "claim_id": "B4.C6",
          "definition": "Plaatswaarde en schaal van het quotiënt correct behouden en interpreteren."
        },
        {
          "id": "B4.ET13",
          "claim_id": "B4.C7",
          "definition": "Een passende aanpak kiezen op basis van getalstructuur en taakconditie."
        },
        {
          "id": "B4.ET14",
          "claim_id": "B4.C7",
          "definition": "Een quotiënt controleren met vermenigvuldiging, schatting of context."
        }
      ],
      "task_models": [
        {
          "id": "B4.TM1",
          "evidence_target_ids": [
            "B4.ET1",
            "B4.ET2"
          ],
          "primary_development": "B4.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B4.TM2",
          "evidence_target_ids": [
            "B4.ET3",
            "B4.ET4"
          ],
          "primary_development": "B4.D2",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B4.TM3",
          "evidence_target_ids": [
            "B4.ET5",
            "B4.ET6"
          ],
          "primary_development": "B4.D3",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B4.TM4",
          "evidence_target_ids": [
            "B4.ET7",
            "B4.ET8"
          ],
          "primary_development": "B4.D4",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B4.TM5",
          "evidence_target_ids": [
            "B4.ET9",
            "B4.ET10"
          ],
          "primary_development": "B4.D5",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B4.TM6",
          "evidence_target_ids": [
            "B4.ET11",
            "B4.ET12"
          ],
          "primary_development": "B4.D6",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B4.TM7",
          "evidence_target_ids": [
            "B4.ET13",
            "B4.ET14"
          ],
          "primary_development": "B4.D7",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "B4.D1",
          "support_threshold": 1
        },
        {
          "development_id": "B4.D2",
          "support_threshold": 2
        },
        {
          "development_id": "B4.D3",
          "support_threshold": 2
        },
        {
          "development_id": "B4.D4",
          "support_threshold": 2
        },
        {
          "development_id": "B4.D5",
          "support_threshold": 2
        },
        {
          "development_id": "B4.D6",
          "support_threshold": 2
        },
        {
          "development_id": "B4.D7",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0,
        "status": "prototype-only",
        "note": "Kandidaatparameters voor technische consistentie; geen empirisch gevalideerde mastery-cut-scores. De B4-oefenroute presenteert geen masterybeslissing aan de leerling."
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    },
    {
      "id": "B5",
      "name": "Bewerkingen combineren en structureren",
      "definition": "Meerdere rekenkundige bewerkingen als samenhangende structuur begrijpen, representeren, in de juiste onderlinge relatie uitvoeren en doelgericht controleren.",
      "developments": [
        {
          "id": "B5.D1",
          "name": "Samengestelde bewerkingen herkennen",
          "definition": "Herkennen dat een rekenopgave uit samenhangende bewerkingen bestaat en bepalen welke hoeveelheden en bewerkingen bij elkaar horen.",
          "candidate_order": 1
        },
        {
          "id": "B5.D2",
          "name": "Situaties als bewerkingsstructuur representeren",
          "definition": "Een situatie met meerdere bewerkingen omzetten naar een passende samengestelde rekennotatie, met behoud van de relaties en groepering.",
          "candidate_order": 2
        },
        {
          "id": "B5.D3",
          "name": "Volgorde en afhankelijkheid interpreteren",
          "definition": "Begrijpen welke bewerkingen eerst moeten worden uitgevoerd door haakjes en de afgesproken rekenvolgorde correct te interpreteren.",
          "candidate_order": 3
        },
        {
          "id": "B5.D4",
          "name": "Samengestelde bewerkingen uitvoeren",
          "definition": "Een samengestelde berekening in de juiste volgorde uitvoeren en tussenresultaten correct behouden.",
          "candidate_order": 4
        },
        {
          "id": "B5.D5",
          "name": "Bewerkingsstructuren gelijkwaardig herstructureren",
          "definition": "Een samengestelde bewerkingsstructuur herkennen of omzetten naar een gelijkwaardige structuur zonder de waarde te veranderen.",
          "candidate_order": 5
        },
        {
          "id": "B5.D6",
          "name": "Bewerkingen flexibel combineren en controleren",
          "definition": "In gevarieerde situaties een passende samengestelde structuur selecteren en de uitkomst doelgericht controleren.",
          "candidate_order": 6
        }
      ],
      "claims": [
        {
          "id": "B5.C1",
          "development_id": "B5.D1",
          "definition": "De leerling kan herkennen welke bewerkingen en hoeveelheden in een samengestelde rekenstructuur met elkaar samenhangen."
        },
        {
          "id": "B5.C2",
          "development_id": "B5.D2",
          "definition": "De leerling kan een situatie met meerdere bewerkingen correct representeren in een samengestelde rekennotatie."
        },
        {
          "id": "B5.C3",
          "development_id": "B5.D3",
          "definition": "De leerling kan de onderlinge volgorde en afhankelijkheid van bewerkingen correct interpreteren."
        },
        {
          "id": "B5.C4",
          "development_id": "B5.D4",
          "definition": "De leerling kan een samengestelde berekening correct uitvoeren met behoud van tussenresultaten."
        },
        {
          "id": "B5.C5",
          "development_id": "B5.D5",
          "definition": "De leerling kan gelijkwaardige samengestelde bewerkingsstructuren herkennen of construeren met behoud van waarde."
        },
        {
          "id": "B5.C6",
          "development_id": "B5.D6",
          "definition": "De leerling kan in gevarieerde situaties een passende samengestelde bewerkingsstructuur kiezen en de uitkomst controleren."
        }
      ],
      "evidence_targets": [
        {
          "id": "B5.ET1",
          "claim_id": "B5.C1",
          "definition": "Correct herkennen welke bewerkingen in een samengestelde structuur voorkomen."
        },
        {
          "id": "B5.ET2",
          "claim_id": "B5.C1",
          "definition": "Correct interpreteren hoe de hoeveelheden en bewerkingen onderling samenhangen."
        },
        {
          "id": "B5.ET3",
          "claim_id": "B5.C2",
          "definition": "Een contextuele situatie koppelen aan de juiste samengestelde bewerkingsnotatie."
        },
        {
          "id": "B5.ET4",
          "claim_id": "B5.C2",
          "definition": "Groepering en relaties behouden bij het representeren van een samengestelde situatie."
        },
        {
          "id": "B5.ET5",
          "claim_id": "B5.C3",
          "definition": "De afgesproken voorrangsrelatie tussen haakjes, vermenigvuldigen/delen en optellen/aftrekken correct toepassen."
        },
        {
          "id": "B5.ET6",
          "claim_id": "B5.C3",
          "definition": "Bewerkingen met gelijke voorrang in de afgesproken volgorde interpreteren."
        },
        {
          "id": "B5.ET7",
          "claim_id": "B5.C4",
          "definition": "Een samengestelde berekening correct uitvoeren."
        },
        {
          "id": "B5.ET8",
          "claim_id": "B5.C4",
          "definition": "Tussenresultaten correct gebruiken zonder de oorspronkelijke bewerkingsrelatie te veranderen."
        },
        {
          "id": "B5.ET9",
          "claim_id": "B5.C5",
          "definition": "Een gelijkwaardige herstructurering van een samengestelde bewerking herkennen."
        },
        {
          "id": "B5.ET10",
          "claim_id": "B5.C5",
          "definition": "Waarde behouden bij het herstructureren van een samengestelde bewerking."
        },
        {
          "id": "B5.ET11",
          "claim_id": "B5.C6",
          "definition": "Een passende samengestelde bewerkingsstructuur selecteren in een gevarieerde situatie."
        },
        {
          "id": "B5.ET12",
          "claim_id": "B5.C6",
          "definition": "De uitkomst van een samengestelde berekening passend controleren."
        }
      ],
      "task_models": [
        {
          "id": "B5.TM1",
          "evidence_target_ids": [
            "B5.ET1",
            "B5.ET2"
          ],
          "primary_development": "B5.D1",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B5.TM2",
          "evidence_target_ids": [
            "B5.ET3",
            "B5.ET4"
          ],
          "primary_development": "B5.D2",
          "information_value": 1,
          "instructional_relevance": 1
        },
        {
          "id": "B5.TM3",
          "evidence_target_ids": [
            "B5.ET5",
            "B5.ET6"
          ],
          "primary_development": "B5.D3",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B5.TM4",
          "evidence_target_ids": [
            "B5.ET7",
            "B5.ET8"
          ],
          "primary_development": "B5.D4",
          "information_value": 2,
          "instructional_relevance": 2
        },
        {
          "id": "B5.TM5",
          "evidence_target_ids": [
            "B5.ET9",
            "B5.ET10"
          ],
          "primary_development": "B5.D5",
          "information_value": 3,
          "instructional_relevance": 3
        },
        {
          "id": "B5.TM6",
          "evidence_target_ids": [
            "B5.ET11",
            "B5.ET12"
          ],
          "primary_development": "B5.D6",
          "information_value": 3,
          "instructional_relevance": 3
        }
      ],
      "development_rules": [
        {
          "development_id": "B5.D1",
          "support_threshold": 1
        },
        {
          "development_id": "B5.D2",
          "support_threshold": 2
        },
        {
          "development_id": "B5.D3",
          "support_threshold": 2
        },
        {
          "development_id": "B5.D4",
          "support_threshold": 2
        },
        {
          "development_id": "B5.D5",
          "support_threshold": 2
        },
        {
          "development_id": "B5.D6",
          "support_threshold": 2
        }
      ],
      "evidence_rule": {
        "relevance": "target_match",
        "quality_field": "quality",
        "default_quality": 0,
        "contradiction_field": "contradiction"
      },
      "mastery_rules": {
        "min_independent_observations": 2,
        "min_variation_keys": 2,
        "min_evidence_targets": 2,
        "min_quality": 0.8,
        "max_unresolved_contradictions": 0,
        "status": "prototype-only",
        "note": "Kandidaatparameters voor technische consistentie; geen empirisch gevalideerde mastery-cut-scores. De B5-oefenroute presenteert geen masterybeslissing aan de leerling."
      },
      "decision_rules": {
        "priority_order": [
          "resolve_developmental_uncertainty",
          "fill_missing_evidence_coverage",
          "test_variation_and_stability",
          "test_independent_coordination",
          "confirm_mastery"
        ]
      }
    }
  ]
}
$pacogo_registry_v06$::jsonb
      and r.status = 'candidate'
  ) then
    raise exception 'v0.6.0-candidate registry row does not match the exact source-controlled configuration';
  end if;
end;
$registry_check$;

