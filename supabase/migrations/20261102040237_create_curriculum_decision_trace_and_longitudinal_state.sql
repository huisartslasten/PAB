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
