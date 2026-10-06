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
              return {
                async single() {
                  calls.push({ op: 'single', table: state.table });
                  return { data: { id: 41, ...rowOrRows }, error: null };
                }
              };
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
      { item: { question: 'q1', answer: 'a' }, value: 'a', correct: true, questionType: 'words' },
      { item: { question: 'q2', answer: 'b' }, value: 'x', correct: false, questionType: 'words' }
    ]
  });

  assert.equal(result.package.attempt.score, 1);
  assert.equal(result.package.attempt.total_questions, 2);
  assert.equal(result.package.result.score, 5);
  assert.equal(calls[0].table, 'test_attempts');
  assert.equal(calls[1].op, 'insert');
  assert.equal(calls[1].rowOrRows.score, 1);
  assert.equal(calls[1].rowOrRows.total_questions, 2);
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
