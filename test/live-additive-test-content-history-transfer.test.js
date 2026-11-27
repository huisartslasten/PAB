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

test('LIVE transfer contains only approved game state and results linked to existing LIVE lessons', () => {
  const payload = readPayload();
  assert.deepEqual(Object.keys(payload).sort(), [
    'game_access_cycles',
    'game_access_settings',
    'game_access_state',
    'game_results'
  ]);
  assert.equal(payload.game_results.length, 2);
  assert.deepEqual(payload.game_results.map(row => row.lesson_id).sort((a,b)=>a-b), [13,14]);
  assert.equal(payload.game_access_settings.length, 2);
  assert.equal(payload.game_access_cycles.length, 2);
  assert.equal(payload.game_access_state.length, 4);
});

test('LIVE transfer is additive and does not import or modify lesson-related datasets', () => {
  assert.match(sql, /^begin;/);
  assert.match(sql.trimEnd(), /commit;$/);
  assert.match(sql, /No lessons, lesson items, learning topics, lesson order, test attempts/i);
  assert.doesNotMatch(sql, /insert\s+into\s+public\.(lessons|lesson_items|test_attempts|test_attempt_answers|learning_topics|lesson_order)\b/i);
  assert.doesNotMatch(sql, /\b(update|delete|truncate)\s+public\.(lessons|lesson_items|test_attempts|test_attempt_answers|learning_topics|lesson_order|game_results)\b/i);
  assert.doesNotMatch(sql, /pacogo_lesson_id_map|pacogo_attempt_id_map/i);
  assert.doesNotMatch(sql, /insert into public\.lesson_order/i);
  assert.doesNotMatch(sql, /insert into public\.skill_definitions/i);
  assert.doesNotMatch(sql, /insert into public\.skill_assignments/i);
});

test('LIVE transfer appends only the two approved game results without changing lesson records', () => {
  assert.match(sql, /jsonb_array_length\(v_payload -> 'game_results'\) <> 2/);
  assert.match(sql, /lesson_id=13 and student='Zephon' and subject='Rekenen' and title='Optellen tot 10'/);
  assert.match(sql, /lesson_id=14 and student='Zenith' and subject='Nederlands' and title='Thema 2: week 2'/);
  assert.match(sql, /where lesson_id not in \(13,14\)/);
  assert.match(sql, /Expected 2 imported game results; inserted %/);
});

test('LIVE transfer excludes the Topografie topic and every TEST lesson snapshot', () => {
  const payload = readPayload();
  assert.equal(payload.game_results.some(row => [20,21,22,39,40,41].includes(row.lesson_id)), false);
  assert.doesNotMatch(sql, /topic8|Topografie topic|insert into public\.learning_topics/i);
  assert.doesNotMatch(sql, /insert into public\.lessons/i);
  assert.doesNotMatch(sql, /insert into public\.lesson_items/i);
  assert.doesNotMatch(sql, /insert into public\.test_attempts/i);
  assert.doesNotMatch(sql, /insert into public\.test_attempt_answers/i);
});

test('LIVE game-access transfer stops instead of overwriting existing learner progress', () => {
  assert.match(sql, /already contains game-access rows for Zenith or Zephon/i);
  assert.match(sql, /Expected 2 imported game-access settings; inserted %/i);
  assert.match(sql, /Expected 2 imported game-access cycles; inserted %/i);
  assert.match(sql, /Expected 4 imported game-access states; inserted %/i);
});
