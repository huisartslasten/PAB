import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const migrationPath = new URL('../supabase/migrations/20261125180000_add_curriculum_persistence_and_ownership_live.sql', import.meta.url);
const registryPath = new URL('../docs/curriculum/PacoGO_Curriculum_Registry_v0.6.json', import.meta.url);
const sql = readFileSync(migrationPath, 'utf8');
const registrySource = readFileSync(registryPath, 'utf8');
const registryDelimiter = '$pacogo_registry_v06$';

test('LIVE curriculum migration is additive and refuses partial/conflicting target schemas', () => {
  assert.match(sql, /to_regclass\('public\.curriculum_registry_versions'\)/);
  assert.match(sql, /to_regclass\('public\.learner_profile_links'\)/);
  assert.match(sql, /LIVE curriculum target objects already exist; stop and reconcile schema before applying/);

  const targetTables = [
    'curriculum_registry_versions',
    'student_evidence',
    'student_longitudinal_state',
    'curriculum_decision_trace',
    'learner_profiles',
    'learner_guardians',
    'learner_profile_links'
  ];
  for (const table of targetTables) {
    assert.match(sql, new RegExp('create table if not exists public\\.' + table + '|create table public\\.' + table, 'i'), table);
  }

  const alteredTables = [...sql.matchAll(/alter table\s+(?:if exists\s+)?public\.([a-z_]+)/gi)].map(match => match[1]);
  assert.ok(alteredTables.length > 0);
  assert.ok(alteredTables.every(table => targetTables.includes(table)), `Unexpected pre-existing table alteration: ${alteredTables.join(', ')}`);

  assert.doesNotMatch(sql, /\b(drop|truncate)\s+table\b/i);
  assert.doesNotMatch(sql, /\bdelete\s+from\s+public\.(?!curriculum_registry_versions\b)/i);
  assert.doesNotMatch(sql, /\binsert\s+into\s+public\.(lessons|lesson_items|test_attempts|test_attempt_answers|agenda_items|agenda_import_drafts|game_results|skill_definitions|skill_assignments)\b/i);
  assert.doesNotMatch(sql, /\bupdate\s+public\.(lessons|lesson_items|test_attempts|test_attempt_answers|agenda_items|agenda_import_drafts|game_results|skill_definitions|skill_assignments)\b/i);
});

test('LIVE curriculum migration preserves the authenticated learner ownership and atomic-write contract', () => {
  assert.match(sql, /create table public\.learner_profiles/i);
  assert.match(sql, /create table public\.learner_guardians/i);
  assert.match(sql, /create table public\.learner_profile_links/i);
  assert.match(sql, /private\.is_learner_guardian/);
  assert.match(sql, /create or replace function public\.create_app_learner_profile/i);
  assert.match(sql, /create or replace function public\.link_app_learner_profile/i);
  assert.match(sql, /create or replace function public\.persist_curriculum_learning_cycle/i);
  assert.match(sql, /language plpgsql\s+security invoker\s+set search_path = ''[\s\S]*?app\.pacogo_learning_cycle_write/);
  assert.match(sql, /exception\s+when others then[\s\S]*?set_config\('app\.pacogo_learning_cycle_write', '', true\)/i);
  assert.match(sql, /learner_profiles_key_is_uuid/);
  assert.match(sql, /owner_user_id = \(select auth\.uid\(\)\)/);
  assert.match(sql, /learner owner must be the authenticated user/i);
  assert.doesNotMatch(sql, /insert\s+into\s+public\.learner_profiles\s*\([^)]*\)\s*values/i);
  assert.doesNotMatch(sql, /insert\s+into\s+public\.learner_profile_links\s*\([^)]*\)\s*values\s*\([^)]*'zyon'/i);
  assert.doesNotMatch(sql, /insert\s+into\s+public\.learner_profile_links\s*\([^)]*\)\s*values\s*\([^)]*'zenith'/i);
  assert.doesNotMatch(sql, /insert\s+into\s+public\.learner_profile_links\s*\([^)]*\)\s*values\s*\([^)]*'zephon'/i);
});

test('LIVE migration registers the byte-exact source-controlled v0.6 candidate registry', () => {
  assert.ok(sql.includes(registryDelimiter));
  const match = sql.match(/\$pacogo_registry_v06\$([\s\S]*?)\$pacogo_registry_v06\$/);
  assert.ok(match, 'Embedded registry JSON must be present');
  assert.equal(match[1], registrySource, 'Embedded registry must exactly match the source file bytes');

  const expectedHash = createHash('sha256').update(registrySource, 'utf8').digest('hex');
  assert.equal(expectedHash, '36853c6107902c29592ecc0906357ad2cc45814befd312ad22096e1e5ab07ba0');
  assert.match(sql, new RegExp(expectedHash));
  const registry = JSON.parse(registrySource);
  assert.equal(registry.registry_version, '0.6.0-candidate');
  assert.equal(registry.status, 'candidate');
  assert.equal(registry.skills.length, 7);
  assert.equal(registry.skills.reduce((sum, skill) => sum + (skill.developments?.length || 0), 0), 37);
  assert.match(sql, /on conflict \(registry_key, version\) do nothing/i);
  assert.match(sql, /v0\.6\.0-candidate registry row does not match the exact source-controlled configuration/);
});
