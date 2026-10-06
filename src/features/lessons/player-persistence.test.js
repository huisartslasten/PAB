import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerPersistence } from './player-persistence.js';

function createDb({ attemptResponse = null, answerResponse = null } = {}) {
  const calls = [];
  const db = {
    calls,
    from(table) {
      const state = { table, rows: null };
      const chain = {
        insert(rows) {
          state.rows = rows;
          calls.push({ table, operation: 'insert', rows });
          return chain;
        },
        select() {
          return chain;
        },
        single() {
          return Promise.resolve(attemptResponse ?? {
            data: { ...state.rows, id: 41 },
            error: null
          });
        }
      };
      if (table === 'test_attempt_answers') {
        chain.single = undefined;
        chain.then = resolve => Promise.resolve(answerResponse ?? {
          data: state.rows,
          error: null
        }).then(resolve);
      }
      return chain;
    }
  };
  return db;
}

test('player persistence requires a Supabase client', () => {
  assert.throws(() => createPlayerPersistence(), /Supabase client is required/);
});

test('player persistence requires a test attempt', async () => {
  const db = createDb();
  const persistence = createPlayerPersistence(db);

  await assert.rejects(
    () => persistence.saveTestResult({}),
    /A test attempt is required/
  );
  assert.deepEqual(db.calls, []);
});

test('player persistence stops before answer insert when the attempt has no id', async () => {
  const db = createDb({
    attemptResponse: { data: { lesson_id: 123 }, error: null }
  });
  const persistence = createPlayerPersistence(db);

  await assert.rejects(
    () => persistence.saveTestResult({
      attempt: { lesson_id: 123, student: 'Zyon', score: 1, total_questions: 1, is_test: true },
      answers: [{ question_order: 1 }]
    }),
    /Test attempt kreeg geen id/
  );

  assert.equal(db.calls.length, 1);
  assert.equal(db.calls[0].table, 'test_attempts');
});

test('player persistence inserts the attempt first and then attaches its id to answer rows', async () => {
  const db = createDb();
  const persistence = createPlayerPersistence(db);
  const attempt = {
    lesson_id: 123,
    student: 'Zyon',
    score: 2,
    total_questions: 3,
    started_at: '2026-10-06T20:00:00.000Z',
    completed_at: '2026-10-06T20:02:00.000Z',
    is_test: true
  };
  const answers = [
    { question_order: 1, given_answer: 'cat' },
    { question_order: 2, given_answer: '' }
  ];

  const result = await persistence.saveTestResult({ attempt, answers });

  assert.equal(db.calls.length, 2);
  assert.equal(db.calls[0].table, 'test_attempts');
  assert.deepEqual(db.calls[0].rows, attempt);
  assert.equal(db.calls[1].table, 'test_attempt_answers');
  assert.deepEqual(db.calls[1].rows, [
    { ...answers[0], attempt_id: 41 },
    { ...answers[1], attempt_id: 41 }
  ]);
  assert.equal(result.attempt.id, 41);
  assert.deepEqual(result.answers, db.calls[1].rows);
});

test('player persistence does not insert answer rows when answers are empty', async () => {
  const db = createDb();
  const persistence = createPlayerPersistence(db);

  const result = await persistence.saveTestResult({
    attempt: { lesson_id: 123, student: 'Zyon', score: 0, total_questions: 0, is_test: true },
    answers: []
  });

  assert.equal(db.calls.length, 1);
  assert.equal(db.calls[0].table, 'test_attempts');
  assert.deepEqual(result.answers, []);
});
