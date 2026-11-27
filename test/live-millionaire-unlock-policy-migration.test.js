import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migrationPath = new URL('../supabase/migrations/20261127110000_live_millionaire_unlock_policy.sql', import.meta.url);
const sql = readFileSync(migrationPath, 'utf8');

test('LIVE Millionaire migration changes only the approved unlock-policy fields', () => {
  assert.match(sql, /^begin;/);
  assert.match(sql.trimEnd(), /commit;$/);
  assert.match(sql, /challenge_key = 'millionaire'/i);
  assert.match(sql, /minimumScore/);
  assert.match(sql, /allowedLessonTypes/);
  assert.match(sql, /\["\*"\]/);
  assert.match(sql, /enabled is true/i);
  assert.match(sql, /questionCount' = '11'/i);
  assert.match(sql, /askSomeone/);
  assert.match(sql, /fiftyFifty/);
  assert.match(sql, /askAudience/);
  assert.doesNotMatch(sql, /update public\.challenge_configurations\s+set\s+enabled\s*=/i);
  assert.doesNotMatch(sql, /update public\.challenge_configurations\s+set\s+game_settings\s*=/i);
  assert.doesNotMatch(sql, /delete\s+from\s+public\.challenge_configurations/i);
});

test('LIVE Millionaire migration refuses unexpected source configuration and verifies target state', () => {
  assert.match(sql, /Expected exactly one LIVE Millionaire configuration/i);
  assert.match(sql, /differs from the inspected source\/target contract/i);
  assert.match(sql, /LIVE Millionaire unlock-policy verification failed/i);
  assert.match(sql, /minimumScore' = '10'/);
  assert.match(sql, /minimumScore' = '4'/);
  assert.match(sql, /allowedLessonTypes' = '\["dictation"\]'/);
  assert.match(sql, /allowedLessonTypes' = '\["\*"\]'/);
});
