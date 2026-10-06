import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayerRuntime } from '../src/features/lessons/player-runtime.js';

function createFakeDb(calls) {
  return {
    from(table) {
      calls.push({ op: 'from', table });
      const state = { table };
      return {
        insert(rowOrRows) {
          calls.push({ op: 'insert', table: state.table, rowOrRows });
          return {
            select() {
              if (state.table === 'test_attempts') {
                return {
                  async single() {
                    calls.push({ op: 'single', table: state.table });
                    return { data: { id: 41, ...rowOrRows }, error: null };
                  }
                };
              }
              return Promise.resolve({ data: rowOrRows, error: null });
            }
          };
        }
      };
    }
  };
}

test('runtime completion preserves the V4.78 persistence sequence', async () => {
  const calls = [];
  const runtime = createPlayerRuntime({ db: createFakeDb(calls) });

  const result = await runtime.completeTest({
    lesson: { id: 8, title: 'Woorden', type: 'words', student: 'Zyon' },
    student: 'Zyon',
    startedAt: 'start',
    finishedAt: 'finish',
    answers: [
      { item: { question: 'q1', answer: 'a' }, value: 'a', correct: true },
      { item: { question: 'q2', answer: 'b' }, value: 'x', correct: false }
    ]
  });

  assert.equal(result.package.attempt.score, 1);
  assert.equal(result.package.attempt.total_questions, 2);
  assert.equal(result.package.result.score, 5);
  assert.equal(result.package.answerRows[0].question_order, 1);
  assert.equal(result.package.answerRows[1].question_order, 2);
  assert.equal(result.package.answerRows[0].question_type, 'words');
  assert.equal(result.package.answerRows[0].answered_at, 'finish');
  assert.equal(calls[0].table, 'test_attempts');
  assert.equal(calls[1].op, 'insert');
  assert.equal(calls[1].rowOrRows.score, 1);
  assert.equal(calls[1].rowOrRows.total_questions, 2);
  assert.equal(calls[3].table, 'test_attempt_answers');
  assert.equal(calls[4].op, 'insert');
});

test('runtime does not create an empty history attempt', async () => {
  const calls = [];
  const runtime = createPlayerRuntime({ db: createFakeDb(calls) });
  const result = await runtime.completeTest({
    lesson: { id: 8, title: 'Lege test', type: 'words', student: 'Zyon' },
    answers: [],
    startedAt: 'start',
    finishedAt: 'finish'
  });

  assert.equal(result.package, null);
  assert.equal(calls.length, 0);
});
