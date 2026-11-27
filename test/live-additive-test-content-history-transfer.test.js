import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migrationPath = new URL('../supabase/migrations/20261127120000_live_additive_test_content_history_transfer.sql', import.meta.url);
const sql = readFileSync(migrationPath, 'utf8');

function readPayload() {
  const match = sql.match(/values \(\$paco_test_payload\$([\s\S]*?)\$paco_test_payload\$::jsonb\);/i);
  assert.ok(match, 'Embedded TEST export payload must be present');
  return JSON.parse(match[1]);
}

test('LIVE content transfer embeds the exact bounded TEST source set', () => {
  const payload = readPayload();
  assert.equal(payload.lessons.length, 6);
  assert.deepEqual(payload.lessons.map(row => row.id).sort((a,b)=>a-b), [20,21,22,39,40,41]);
  assert.equal(payload.items.length, 25);
  assert.equal(payload.attempts.length, 11);
  assert.equal(payload.answers.length, 54);
  assert.equal(payload.game_results.length, 4);
  assert.equal(payload.game_access_settings.length, 2);
  assert.equal(payload.game_access_cycles.length, 2);
  assert.equal(payload.game_access_state.length, 4);
  assert.equal(payload.topic8.student, 'Zyon');
  assert.equal(payload.topic8.subject, 'Aardrijkskunde');
  assert.equal(payload.topic8.subvak, 'Topografie');
  assert.ok(payload.items.every(item => item.content_data === null));
});

test('LIVE transfer is additive and never overwrites existing LIVE lesson/history/order records', () => {
  assert.match(sql, /^begin;/);
  assert.match(sql.trimEnd(), /commit;$/);
  assert.match(sql, /create temporary table pacogo_lesson_id_map/i);
  assert.match(sql, /create temporary table pacogo_attempt_id_map/i);
  assert.match(sql, /returning id into v_target_lesson/i);
  assert.match(sql, /returning id into v_target_attempt/i);
  assert.doesNotMatch(sql, /\b(update|delete|truncate)\s+public\.(lessons|lesson_items|test_attempts|test_attempt_answers|game_results|learning_topics|lesson_order)\b/i);
  assert.doesNotMatch(sql, /insert into public\.lesson_order/i);
  assert.doesNotMatch(sql, /insert into public\.skill_definitions/i);
  assert.doesNotMatch(sql, /insert into public\.skill_assignments/i);
});

test('LIVE transfer preserves all source history and hides the four historical lesson snapshots', () => {
  assert.match(sql, /if v_lesson\.id in \(20,21,39\) then[\s\S]*v_archived := true/i);
  assert.match(sql, /elsif v_lesson\.id = 40 then[\s\S]*v_deleted := true/i);
  assert.match(sql, /Expected 11 TEST test attempts/i);
  assert.match(sql, /Expected 54 TEST answer rows/i);
  assert.match(sql, /Expected 4 TEST game results/i);
  assert.match(sql, /including duplicate-looking attempts/i);
});

test('LIVE transfer keeps the deleted LIVE topic records untouched and creates distinct Topografie', () => {
  assert.match(sql, /Existing deleted\/archived topic flags are deliberately left unchanged/i);
  assert.match(sql, /Create it as a distinct topic/i);
  assert.match(sql, /never merge it into the deleted Azie topic/i);
  assert.match(sql, /insert into public\.learning_topics\(student,subject,subvak,created_at,archived,deleted\)/i);
  assert.ok(sql.includes('if v_count = 0 then'));
  assert.ok(sql.includes('A LIVE Topografie topic exists but is archived/deleted'));
});

test('LIVE game-access transfer stops instead of overwriting existing learner progress', () => {
  assert.match(sql, /already contains game-access rows for Zenith or Zephon/i);
  assert.match(sql, /Expected 2 inserted LIVE game-access settings/i);
  assert.match(sql, /Expected 2 inserted LIVE game-access cycles/i);
  assert.match(sql, /Expected 4 inserted LIVE game-access states/i);
});
