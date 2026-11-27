import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migrationPath = new URL('../supabase/migrations/20261127100000_live_runtime_contract_and_authorization.sql', import.meta.url);
const sql = readFileSync(migrationPath, 'utf8');
const LIVE_MAIN_ADMIN_ID = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const LIVE_SECOND_PARENT_ID = '418833d5-049a-4ec9-8072-2d48a85f04b1';

function policy(name) {
  const marker = 'create policy "' + name.toLowerCase() + '"';
  const start = sql.toLowerCase().indexOf(marker);
  assert.ok(start >= 0, 'Missing policy: ' + name);
  const end = sql.indexOf(';', start);
  assert.ok(end > start, 'Incomplete policy: ' + name);
  return sql.slice(start, end + 1);
}

test('LIVE runtime contract migration is additive and preserves existing learner data', () => {
  assert.match(sql, /^begin;/);
  assert.match(sql.trimEnd(), /commit;$/);
  assert.match(sql, /add column if not exists content_data jsonb/i);
  assert.match(sql, /create unique index if not exists skill_assignments_student_skill_id_key/i);
  assert.doesNotMatch(sql, /\b(drop|truncate)\s+table\b/i);
  assert.doesNotMatch(sql, /\bdelete\s+from\s+public\./i);
  assert.doesNotMatch(sql, /\bupdate\s+public\.(lessons|lesson_items|test_attempts|test_attempt_answers|game_results)\b/i);
});

test('LIVE RLS policies match the existing parent and main-administrator capabilities', () => {
  const gameResults = policy('Parents can view game results');
  assert.ok(gameResults.includes(LIVE_MAIN_ADMIN_ID));
  assert.ok(gameResults.includes(LIVE_SECOND_PARENT_ID));

  const lessonOrder = policy('parents manage lesson order');
  assert.ok(lessonOrder.includes(LIVE_MAIN_ADMIN_ID));
  assert.ok(lessonOrder.includes(LIVE_SECOND_PARENT_ID));

  const skillInsert = policy('Main administrator can insert Skill assignments');
  const challengeWrite = policy('Main administrator can manage challenge configurations');
  const skillDefinitionWrite = policy('Main administrator can manage skill definitions');
  for (const statement of [skillInsert, challengeWrite, skillDefinitionWrite]) {
    assert.ok(statement.includes(LIVE_MAIN_ADMIN_ID));
    assert.ok(!statement.includes(LIVE_SECOND_PARENT_ID), 'A non-admin parent must not receive administrator write access');
  }

  const challengeRead = policy('Parents can read challenge configurations');
  assert.ok(challengeRead.includes(LIVE_MAIN_ADMIN_ID));
  assert.ok(challengeRead.includes(LIVE_SECOND_PARENT_ID));
});

test('LIVE private learning-topic media bucket is configured without importing TEST media', () => {
  assert.match(sql, /insert into storage\.buckets/i);
  assert.match(sql, /'lesson-photos',\s*'lesson-photos',\s*false,\s*5242880/i);
  assert.match(sql, /lesson_photos_storage_select/i);
  assert.match(sql, /lesson_photos_storage_insert/i);
  assert.match(sql, /lesson_photos_storage_delete/i);
  assert.match(sql, /image\/heic/i);
  assert.match(sql, /image\/heif/i);
});
