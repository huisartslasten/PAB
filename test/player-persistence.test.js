import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayerPersistence } from '../src/features/lessons/player-persistence.js';

test('player persistence inserts attempt before answer rows and links answers to the attempt', async () => {
  const calls = [];
  const db = {
    from(table) {
      calls.push({ op: 'from', table });
      return {
        insert(rows) {
          calls.push({ op: 'insert', table, rows });
          return {
            select() {
              return {
                single() {
                  calls.push({ op: 'single', table });
                  return Promise.resolve({ data: { id: 91, ...rows }, error: null });
                }
              };
            }
          };
        }
      };
    }
  };

  const service = createPlayerPersistence(db, { clock: () => '2026-10-06T23:00:00.000Z' });
  const result = await service.saveTestResult({
    attempt: { lesson_id: 7, score: 80 },
    answers: [{ item_id: 1, correct: true }, { item_id: 2, correct: false }]
  });

  assert.equal(result.attempt.id, 91);
  assert.equal(result.attempt.started_at, '2026-10-06T23:00:00.000Z');
  assert.equal(result.attempt.completed_at, '2026-10-06T23:00:00.000Z');
  assert.deepEqual(calls.map(call => `${call.op}:${call.table}`), [
    'from:test_attempts', 'insert:test_attempts', 'single:test_attempts',
    'from:test_attempt_answers', 'insert:test_attempt_answers'
  ]);
  assert.deepEqual(calls[4].rows.map(row => row.attempt_id), [91, 91]);
  assert.deepEqual(calls[4].rows.map(row => row.answered_at), [
    '2026-10-06T23:00:00.000Z',
    '2026-10-06T23:00:00.000Z'
  ]);
});

test('player persistence preserves explicit timestamps', async () => {
  const inserted = [];
  const db = {
    from(table) {
      return {
        insert(rows) {
          inserted.push({ table, rows });
          return {
            select() {
              return {
                single() {
                  return Promise.resolve({ data: { id: 12, ...rows }, error: null });
                }
              };
            }
          };
        }
      };
    }
  };

  await createPlayerPersistence(db, { clock: () => 'fallback' }).saveTestResult({
    attempt: {
      lesson_id: 3,
      started_at: 'start',
      completed_at: 'complete'
    },
    answers: [{ item_id: 1, answered_at: 'answered' }]
  });

  assert.equal(inserted[0].rows.started_at, 'start');
  assert.equal(inserted[0].rows.completed_at, 'complete');
  assert.equal(inserted[1].rows[0].answered_at, 'answered');
});

test('player persistence can finish an attempt without answer rows', async () => {
  const calls = [];
  const db = {
    from(table) {
      calls.push(table);
      return {
        insert(rows) {
          return { select: () => ({ single: () => Promise.resolve({ data: { id: 12, ...rows }, error: null }) }) };
        }
      };
    }
  };

  const result = await createPlayerPersistence(db).saveTestResult({ attempt: { lesson_id: 3 } });
  assert.equal(result.attempt.id, 12);
  assert.equal(typeof result.attempt.started_at, 'string');
  assert.equal(typeof result.attempt.completed_at, 'string');
  assert.deepEqual(result.answers, []);
  assert.deepEqual(calls, ['test_attempts']);
});
