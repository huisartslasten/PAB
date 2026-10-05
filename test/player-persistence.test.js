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

  const service = createPlayerPersistence(db);
  const result = await service.saveTestResult({
    attempt: { lesson_id: 7, score: 80 },
    answers: [{ item_id: 1, correct: true }, { item_id: 2, correct: false }]
  });

  assert.equal(result.attempt.id, 91);
  assert.deepEqual(calls.map(call => `${call.op}:${call.table}`), [
    'from:test_attempts', 'insert:test_attempts', 'single:test_attempts',
    'from:test_attempt_answers', 'insert:test_attempt_answers'
  ]);
  assert.deepEqual(calls[4].rows.map(row => row.attempt_id), [91, 91]);
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
  assert.deepEqual(result.answers, []);
  assert.deepEqual(calls, ['test_attempts']);
});
