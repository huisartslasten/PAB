import test from 'node:test';
import assert from 'node:assert/strict';

import { createApplicationPlayerRuntime } from '../src/features/lessons/player-runtime-composition.js';

function lesson() {
  return {
    id: 'lesson-1',
    title: 'Dictee',
    type: 'dictation',
    lesson_items: [
      { id: 'q1', question: 'appel', answer: 'appel' }
    ]
  };
}

test('application player composition requires the application-owned lesson context', () => {
  assert.throws(
    () => createApplicationPlayerRuntime({
      student: 'Zyon',
      renderResult: () => {}
    }),
    /A lesson is required/
  );

  assert.throws(
    () => createApplicationPlayerRuntime({
      lesson: lesson(),
      renderResult: () => {}
    }),
    /A student is required/
  );
});

test('application player composition wires application dependencies into the player adapter', () => {
  const calls = [];
  const persistence = {
    async saveTestResult(payload) {
      calls.push(['save', payload]);
      return { attempt: { id: 'attempt-1' }, answers: [] };
    }
  };

  const runtime = createApplicationPlayerRuntime({
    lesson: lesson(),
    student: 'Zyon',
    persistence,
    renderResult: payload => calls.push(['render', payload]),
    cancelSpeech: () => calls.push(['cancel']),
    clearActivity: () => calls.push(['clear']),
    showLessonChoice: selected => calls.push(['choice', selected.id]),
    goBack: () => calls.push(['back']),
    clock: () => '2026-10-06T00:00:00.000Z',
    createSession: (items, options) => ({
      kind: 'test',
      type: options.type,
      startedAt: options.startedAt,
      answers: [],
      async submit(answer) {
        const result = { correct: answer === 'appel', value: answer };
        this.answers.push({ item: items[0], value: answer, correct: result.correct });
        return result;
      }
    })
  });

  assert.equal(typeof runtime.startTest, 'function');
  assert.equal(typeof runtime.submitAnswer, 'function');
  assert.equal(typeof runtime.finishTest, 'function');
  assert.equal(typeof runtime.retry, 'function');
  assert.equal(typeof runtime.back, 'function');

  runtime.startTest({ startedAt: '2026-10-05T23:00:00.000Z' });
  assert.equal((runtime.session.type), 'dictation');

  runtime.retry();
  runtime.back();

  assert.deepEqual(calls, [
    ['choice', 'lesson-1'],
    ['back']
  ]);
});
