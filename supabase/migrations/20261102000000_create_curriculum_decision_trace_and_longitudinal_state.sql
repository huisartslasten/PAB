create table if not exists public.student_longitudinal_state (
  id uuid primary key default gen_random_uuid(),
  student_key text not null,
  curriculum_registry_version_id uuid not null references public.curriculum_registry_versions(id),
  skill_id text not null,
  state jsonb not null default '{}'::jsonb,
  last_observed_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (student_key, curriculum_registry_version_id, skill_id)
);

comment on table public.student_longitudinal_state is
  'Current derived learning state for a student/skill under an exact curriculum registry version. Derived state is not empirical validation.';

create index if not exists student_longitudinal_state_student_idx
  on public.student_longitudinal_state (student_key, updated_at desc);
create index if not exists student_longitudinal_state_skill_idx
  on public.student_longitudinal_state (skill_id, updated_at desc);

create table if not exists public.curriculum_decision_trace (
  id uuid primary key default gen_random_uuid(),
  student_key text not null,
  curriculum_registry_version_id uuid not null references public.curriculum_registry_versions(id),
  skill_id text not null,
  observation_ids jsonb not null default '[]'::jsonb,
  inference jsonb not null default '{}'::jsonb,
  decision jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.curriculum_decision_trace is
  'Append-only trace of evidence-to-inference-to-mastery-to-decision-to-next-action for an exact curriculum registry version.';

create index if not exists curriculum_decision_trace_student_idx
  on public.curriculum_decision_trace (student_key, created_at desc);
create index if not exists curriculum_decision_trace_skill_idx
  on public.curriculum_decision_trace (skill_id, created_at desc);
create index if not exists curriculum_decision_trace_registry_idx
  on public.curriculum_decision_trace (curriculum_registry_version_id, skill_id, created_at desc);

alter table public.student_longitudinal_state enable row level security;
alter table public.curriculum_decision_trace enable row level security;

create policy "authenticated can read longitudinal state"
  on public.student_longitudinal_state
  for select
  to authenticated
  using (true);

create policy "authenticated can insert longitudinal state"
  on public.student_longitudinal_state
  for insert
  to authenticated
  with check (true);

create policy "authenticated can update longitudinal state"
  on public.student_longitudinal_state
  for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can read decision traces"
  on public.curriculum_decision_trace
  for select
  to authenticated
  using (true);

create policy "authenticated can insert decision traces"
  on public.curriculum_decision_trace
  for insert
  to authenticated
  with check (true);
