import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ownershipMigration = readFileSync(
  new URL('../../supabase/migrations/20261105024754_add_learner_ownership_and_rls.sql', import.meta.url),
  'utf8'
);
const writeBoundaryMigration = readFileSync(
  new URL('../../supabase/migrations/20261105030000_switch_learning_cycle_to_invoker.sql', import.meta.url),
  'utf8'
);
const databaseTest = readFileSync(
  new URL('../../supabase/tests/learner_ownership_rls.test.sql', import.meta.url),
  'utf8'
);

test('learner persistence uses opaque UUID keys and explicit guardian ownership', () => {
  assert.match(ownershipMigration, /create table public\.learner_profiles/);
  assert.match(ownershipMigration, /create table public\.learner_guardians/);
  assert.match(ownershipMigration, /owner_user_id uuid not null references auth\.users\(id\)/);
  assert.match(ownershipMigration, /learner_key text primary key default gen_random_uuid\(\)::text/);
  assert.match(ownershipMigration, /learner_profiles_attach_owner_membership/);
  assert.match(ownershipMigration, /create or replace function public\.create_learner_profile/);
  assert.match(ownershipMigration, /security invoker[\s\S]*?set search_path = ''/);
});

test('learner data policies replace the old global authenticated access', () => {
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
    assert.ok(
      ownershipMigration.toLowerCase().includes(policySql.toLowerCase()),
      'Missing policy removal: ' + policySql
    );
  }

  assert.match(ownershipMigration, /private\.is_learner_guardian\(student_key\)/);
  assert.match(ownershipMigration, /learner_profiles_select_linked_guardians/);
  assert.match(ownershipMigration, /learner_guardians_select_self/);
  assert.match(ownershipMigration, /from public, anon, authenticated;/);
  assert.doesNotMatch(ownershipMigration, /create policy[\s\S]{0,260}?using\s*\(\s*true\s*\)/i);
});

test('learning-cycle writes use an invoker RPC and transaction-local RLS capability', () => {
  assert.match(
    writeBoundaryMigration,
    /create or replace function public\.persist_curriculum_learning_cycle[\s\S]*?security invoker[\s\S]*?set search_path = ''/
  );
  assert.doesNotMatch(
    writeBoundaryMigration,
    /create or replace function public\.persist_curriculum_learning_cycle[\s\S]*?security definer/
  );
  assert.match(writeBoundaryMigration, /pg_catalog\.set_config\([\s\S]*?app\.pacogo_learning_cycle_write/);
  assert.match(writeBoundaryMigration, /set_config\('app\.pacogo_learning_cycle_write', '', true\)/);
  assert.match(writeBoundaryMigration, /private\.is_learner_guardian\(p_student_key\)/);
  assert.match(writeBoundaryMigration, /on conflict \(student_key, source_event_id\)/);
  assert.match(writeBoundaryMigration, /create policy student_evidence_insert_guardian_cycle/);
  assert.match(writeBoundaryMigration, /create policy student_longitudinal_state_update_guardian_cycle/);
  assert.match(writeBoundaryMigration, /grant insert on public\.student_evidence to authenticated/);
  assert.match(writeBoundaryMigration, /grant insert, update on public\.student_longitudinal_state to authenticated/);
  assert.match(writeBoundaryMigration, /revoke all on function public\.persist_curriculum_learning_cycle[\s\S]*?from public, anon/);
  assert.match(writeBoundaryMigration, /grant execute on function public\.persist_curriculum_learning_cycle[\s\S]*?to authenticated/);
});

test('migration refuses to invent mappings for orphan learner keys', () => {
  assert.match(ownershipMigration, /left join public\.learner_profiles p on p\.learner_key = e\.student_key/);
  assert.match(ownershipMigration, /Existing curriculum learner keys lack an explicit learner profile/);
  assert.match(ownershipMigration, /foreign key \(student_key\)[\s\S]*?references public\.learner_profiles\(learner_key\)/);
});

test('database integration test covers two isolated parents, direct-write denial and rollback', () => {
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
  assert.match(databaseTest, /Direct evidence insert unexpectedly succeeded/);
  assert.match(databaseTest, /Learning-cycle write capability leaked after RPC return/);
  assert.match(databaseTest, /rollback;/i);
});
