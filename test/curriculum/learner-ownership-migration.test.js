import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migration = readFileSync(
  new URL('../../supabase/migrations/20261104230000_add_learner_ownership_and_rls.sql', import.meta.url),
  'utf8'
);
const databaseTest = readFileSync(
  new URL('../../supabase/tests/learner_ownership_rls.test.sql', import.meta.url),
  'utf8'
);

test('learner persistence uses opaque UUID keys and explicit guardian ownership', () => {
  assert.match(migration, /create table public\.learner_profiles/);
  assert.match(migration, /create table public\.learner_guardians/);
  assert.match(migration, /owner_user_id uuid not null references auth\.users\(id\)/);
  assert.match(migration, /learner_key text primary key default gen_random_uuid\(\)::text/);
  assert.match(migration, /learner_profiles_attach_owner_membership/);
  assert.match(migration, /create or replace function public\.create_learner_profile/);
  assert.match(migration, /security invoker[\s\S]*?set search_path = ''/);
});

test('learner data policies are scoped and replace the old permissive policies', () => {
  const droppedPolicies = [
    'drop policy if exists student_evidence_select_authenticated',
    'drop policy if exists student_evidence_insert_authenticated',
    'drop policy if exists "authenticated can read longitudinal state"',
    'drop policy if exists "authenticated can insert longitudinal state"',
    'drop policy if exists "authenticated can update longitudinal state"',
    'drop policy if exists "authenticated can read decision traces"',
    'drop policy if exists "authenticated can insert decision traces"'
  ];
  for (const policySql of droppedPolicies) {
    assert.ok(migration.toLowerCase().includes(policySql.toLowerCase()), `Missing policy removal: ${policySql}`);
  }

  assert.match(migration, /private\.is_learner_guardian\(student_key\)/);
  assert.match(migration, /learner_profiles_select_linked_guardians/);
  assert.match(migration, /learner_guardians_select_self/);
  assert.match(migration, /from public, anon, authenticated;/);
  assert.doesNotMatch(migration, /create policy[\s\S]{0,260}?using\s*\(\s*true\s*\)/i);
});

test('learning-cycle persistence is atomic, idempotent and not directly writable', () => {
  assert.match(migration, /create or replace function public\.persist_curriculum_learning_cycle/);
  assert.match(migration, /security definer[\s\S]*?set search_path = ''/);
  assert.match(migration, /private\.is_learner_guardian\(p_student_key\)/);
  assert.match(migration, /source_event_id is required for idempotency/);
  assert.match(migration, /on conflict \(student_key, source_event_id\)/);
  assert.match(migration, /revoke all on function public\.persist_curriculum_learning_cycle[\s\S]*?from public, anon/);
  assert.match(migration, /grant execute on function public\.persist_curriculum_learning_cycle[\s\S]*?to authenticated/);
  assert.match(migration, /add constraint curriculum_decision_trace_json_shapes_check/);
  assert.doesNotMatch(migration, /grant\s+(?:insert|update|all)[\s\S]{0,120}?public\.student_evidence\s+to authenticated/i);
});

test('migration refuses to invent mappings for orphan learner keys', () => {
  assert.match(migration, /left join public\.learner_profiles p on p\.learner_key = e\.student_key/);
  assert.match(migration, /Existing curriculum learner keys lack an explicit learner profile/);
  assert.match(migration, /foreign key \(student_key\)[\s\S]*?references public\.learner_profiles\(learner_key\)/);
});

test('database integration test covers two isolated parent accounts and rollback', () => {
  assert.match(databaseTest, /pacogo-rls-parent-a@example\.invalid/);
  assert.match(databaseTest, /pacogo-rls-parent-b@example\.invalid/);
  assert.match(databaseTest, /Parent A can read Parent B/);
  assert.match(databaseTest, /Parent B learner-profile isolation failed/);
  assert.match(databaseTest, /Direct membership self-enrollment unexpectedly succeeded/);
  assert.match(databaseTest, /Cross-guardian persistence unexpectedly succeeded/);
  assert.match(databaseTest, /Duplicate evidence event was stored more than once/);
  assert.match(databaseTest, /Evidence survived a failed learning-cycle transaction/);
  assert.match(databaseTest, /Longitudinal state changed despite failed learning-cycle transaction/);
  assert.match(databaseTest, /Anonymous role retains learner-data table privileges/);
  assert.match(databaseTest, /rollback;/i);
});
