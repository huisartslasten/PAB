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

test('LIVE curriculum migration preserves the authenticated learner ownership and hardened atomic-write contract', () => {
  assert.match(sql, /create table public\.learner_profiles/i);
  assert.match(sql, /create table public\.learner_guardians/i);
  assert.match(sql, /create table public\.learner_profile_links/i);
  assert.match(sql, /private\.is_learner_guardian/);
  assert.match(sql, /create or replace function public\.create_app_learner_profile/i);
  assert.match(sql, /create or replace function public\.link_app_learner_profile/i);
  assert.match(sql, /create or replace function public\.persist_curriculum_learning_cycle/i);
  assert.match(sql, /create or replace function private\.persist_curriculum_learning_cycle[\s\S]*?security definer\s+set search_path = ''/i);
  assert.match(sql, /create or replace function public\.persist_curriculum_learning_cycle[\s\S]*?security invoker\s+set search_path = ''/i);
  assert.match(sql, /private\.persist_curriculum_learning_cycle\(/i);
  assert.match(sql, /if \(select auth\.uid\(\)\) is null[\s\S]*?not private\.is_learner_guardian\(p_student_key\)/i);
  assert.match(sql, /revoke insert, update, delete on public\.student_evidence from authenticated/i);
  assert.match(sql, /revoke insert, update, delete on public\.student_longitudinal_state from authenticated/i);
  assert.match(sql, /revoke insert, update, delete on public\.curriculum_decision_trace from authenticated/i);
  assert.match(sql, /drop function if exists private\.learner_cycle_write_enabled\(\)/i);
  const finalRpcStart = sql.lastIndexOf('create or replace function public.persist_curriculum_learning_cycle(');
  const finalRpcEnd = sql.indexOf(String.fromCharCode(10) + '$' + '$' + ';', finalRpcStart);
  assert.ok(finalRpcStart >= 0 && finalRpcEnd > finalRpcStart, 'Final SECURITY INVOKER RPC definition must be present');
  assert.doesNotMatch(sql.slice(finalRpcStart, finalRpcEnd), /pacogo_learning_cycle_write|set_config/i);
  assert.match(sql, /learner_profiles_key_is_uuid/);
  assert.match(sql, /owner_user_id = \(select auth\.uid\(\)\)/);
  assert.match(sql, /learner owner must be the authenticated user/i);
  assert.doesNotMatch(sql, /insert\s+into\s+public\.learner_profile_links\s*\([^)]*\)\s*values\s*\([^)]*'zyon'/i);
  assert.doesNotMatch(sql, /insert\s+into\s+public\.learner_profile_links\s*\([^)]*\)\s*values\s*\([^)]*'zenith'/i);
  assert.doesNotMatch(sql, /insert\s+into\s+public\.learner_profile_links\s*\([^)]*\)\s*values\s*\([^)]*'zephon'/i);
});

test('LIVE migration preserves TEST registry history and appends source-controlled v0.6', () => {
  const versions = [
    ['0.2.0-seed', 'cb58825a0e3347f48b11b4a664f689f5050a53a021678345a5a897410113304d', '$pacogo_registry_02$', null],
    ['0.3.0-candidate', '4ba39fed03b5d8e82c0f3c08f01354301e0e66c82e899fe0a0e9e5ed0866926a', '$pacogo_registry_03$', '0.2.0-seed'],
    ['0.4.0-candidate', '7aaea07eb7d9d0b6b895f46ca1b99c4b8229505556d7313f023cad8994ce5132', '$pacogo_registry_04$', '0.3.0-candidate'],
    ['0.5.0-candidate', 'fdc3712704304d563b2b1db0620dd089d8b328724d5a4d1b2416781d95a7f422', '$pacogo_registry_05$', '0.4.0-candidate'],
    ['0.6.0-candidate', '36853c6107902c29592ecc0906357ad2cc45814befd312ad22096e1e5ab07ba0', '$pacogo_registry_06$', '0.5.0-candidate']
  ];
  for (const [version, hash, delimiter, previous] of versions) {
    assert.ok(sql.includes(hash), `Missing historical config hash for ${version}`);
    assert.ok(sql.includes(delimiter), `Missing config payload for ${version}`);
    assert.ok(sql.includes("'" + version + "'"), `Missing version ${version}`);
    if (previous) assert.ok(sql.includes("version='" + previous + "'"), `Missing supersedes link to ${previous}`);
  }
  assert.match(sql, /^begin;/);
  assert.match(sql.trimEnd(), /commit;$/);
  assert.match(sql, /r\.supersedes_id is null/);
  assert.match(sql, /Version 0\.2 is taken[\s\S]*stored TEST JSONB snapshot/i);

  for (const v of ['0.3','0.4','0.5','0.6']) {
    const delimiter = '$pacogo_registry_' + v.replace('.','') + '$';
    const payloadStart = sql.indexOf(delimiter);
    const payloadEnd = payloadStart < 0 ? -1 : sql.indexOf(delimiter, payloadStart + delimiter.length);
    assert.ok(payloadStart >= 0 && payloadEnd >= 0, `Missing exact payload for v${v}`);
    const payload = sql.slice(payloadStart + delimiter.length, payloadEnd);
    const expected = readFileSync(new URL('../docs/curriculum/PacoGO_Curriculum_Registry_v' + v + '.json', import.meta.url), 'utf8');
    assert.equal(payload, expected, `v${v} must match its exact source file bytes`);
  }

  const registry = JSON.parse(registrySource);
  assert.equal(registry.registry_version, '0.6.0-candidate');
  assert.equal(registry.skills.length, 7);
  assert.equal(registry.skills.reduce((sum, skill) => sum + (skill.developments?.length || 0), 0), 37);
});
