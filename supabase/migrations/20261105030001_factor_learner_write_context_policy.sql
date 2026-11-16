-- Factor transaction-local write-context evaluation into a private helper.
-- This keeps exposed RLS policies simple and lets PostgreSQL cache the
-- request-constant predicate as an initplan.

begin;

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

commit;
