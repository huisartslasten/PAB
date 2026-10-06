import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerRuntime } from './player-runtime.js';

function createFakeDb() {
  const calls = [];
  let nextAttemptId = 41;

  const db = {
    calls,
    from(table) {
      const state = { table, rows: null };
      const chain = {
        insert(rows) {
          state.rows = rows;
          calls.push({ operation: 'insert', table, rows });
          return chain;
        },
        select() {
          return chain;
        },
        single() {
          if (table === 'test_attempts') {
            return Promise.resolve({ data: { ...state.rows, id: nextAttemptId++ }, error: null });
          }
          return Promise.resolve({ data: state.rows, error: null });
        }
      };
      return chain;
    }
  };

  return db;
}

test('player runtime preserves the V4.78 test-history contract', async () => {
  const db = createFakeDb();
  const runtime = createPlayerRuntime({ db });
  const startedAt = '2026-10-06T20:00:00.000Z';
  const finishedAt = '2026-10-06T20:05:00.000Z';

  const result = await runtime.completeTest({
    lesson: { id: 123, student: 'Zyon', title: 'Themawoorden', type: 'words' },
    student: 'Zyon',
    answers: [
      { item: { question: 'Wat betekent expert?', answer: 'Deskundige' }, value: 'Deskundige', correct: true },
      { item: { question: 'Wat betekent kapen?', answer: 'Overnemen met geweld' }, value: 'Overnemen', correct: false }
    ],
    startedAt,
    finishedAt
  });

  assert.equal(db.calls.length, 2);
  assert.deepEqual(db.calls[0], {
    operation: 'insert',
    table: 'test_attempts',
    rows: {
      lesson_id: 123,
      student: 'Zyon',
      score: 1,
      total_questions: 2,
      started_at: startedAt,
      completed_at: finishedAt,
      is_test: true
    }
  });

  assert.deepEqual(db.calls[1], {
    operation: 'insert',
    table: 'test_attempt_answers',
    rows: [
      {
        attempt_id: 41,
        question_order: 1,
        question: 'Wat betekent expert?',
        expected_answer: 'Deskundige',
        given_answer: 'Deskundige',
        is_correct: true,
        question_type: 'words',
        answered_at: finishedAt
      },
      {
        attempt_id: 41,
        question_order: 2,
        question: 'Wat betekent kapen?',
        expected_answer: 'Overnemen met geweld',
        given_answer: 'Overnemen',
        is_correct: false,
        question_type: 'words',
        answered_at: finishedAt
      }
    ]
  });

  assert.equal(result.completion.correct, 1);
  assert.equal(result.completion.total, 2);
  assert.equal(result.package.attempt.score, 1);
});

test('player runtime does not create an empty V4.78 test-history attempt', async () => {
  const db = createFakeDb();
  const runtime = createPlayerRuntime({ db });

  const result = await runtime.completeTest({
    lesson: { id: 123, student: 'Zyon', title: 'Lege toets', type: 'words' },
    student: 'Zyon',
    answers: [],
    startedAt: '2026-10-06T20:00:00.000Z',
    finishedAt: '2026-10-06T20:01:00.000Z'
  });

  assert.equal(db.calls.length, 0);
  assert.equal(result.package, null);
  assert.equal(result.persisted, null);
});
