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

-- TEST project policy: authenticated users may read registry definitions and their
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
