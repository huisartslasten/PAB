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
