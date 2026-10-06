import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerRuntimeAdapter } from '../src/features/lessons/player-runtime-adapter.js';

function lesson() {
  return {
    id: 'lesson-1',
    title: 'Dictee',
    type: 'dictation',
    lesson_items: [
      { id: 'q1', question: 'appel', answer: 'appel' },
      { id: 'q2', question: 'boom', answer: 'boom' }
    ]
  };
}

test('player runtime adapter starts a typed V4.78-style test session', () => {
  const adapter = createPlayerRuntimeAdapter({
    lesson: lesson(),
    student: 'Zyon',
    persistence: { saveTestResult: async () => ({}) },
    renderResult: async () => {}
  });

  const session = adapter.startTest({ shuffle: items => items });

  assert.equal(session.kind, 'test');
  assert.equal(session.type, 'dictation');
  assert.equal(session.items.length, 2);
  assert.equal(session.startedAt != null, true);
});

test('player runtime adapter maps completion to persistence, result rendering, and cleanup', async () => {
  const calls = [];
  const persistence = {
    async saveTestResult(payload) {
      calls.push({ kind: 'save', payload });
      return { attempt: { id: 'attempt-1' }, answers: [] };
    }
  };
  const adapter = createPlayerRuntimeAdapter({
    lesson: lesson(),
    student: 'Zyon',
    persistence,
    cancelSpeech: () => calls.push({ kind: 'cancel' }),
    renderResult: async payload => calls.push({ kind: 'render', payload }),
    clearActivity: () => calls.push({ kind: 'clear' }),
    clock: () => '2026-10-06T00:00:00.000Z'
  });

  const session = adapter.startTest({ shuffle: items => items, startedAt: '2026-10-05T23:00:00.000Z' });
  session.submit({ item: lesson().lesson_items[0], value: 'appel', correct: true });
  session.submit({ item: lesson().lesson_items[1], value: 'bom', correct: false });

  const output = await adapter.finishTest();

  assert.equal(output.result.correct, 1);
  assert.equal(output.result.total, 2);
  assert.equal(output.result.score, 5);
  assert.deepEqual(calls.map(call => call.kind), ['cancel', 'save', 'render', 'clear']);

  const saved = calls.find(call => call.kind === 'save').payload;
  assert.deepEqual(saved.attempt, {
    lesson_id: 'lesson-1',
    student: 'Zyon',
    score: 1,
    total_questions: 2,
    started_at: '2026-10-05T23:00:00.000Z',
    completed_at: '2026-10-06T00:00:00.000Z',
    is_test: true
  });
  assert.deepEqual(saved.answers[0], {
    question_order: 1,
    question: 'appel',
    expected_answer: 'appel',
    given_answer: 'appel',
    is_correct: true,
    question_type: 'dictation'
  });
  assert.deepEqual(saved.answers[1], {
    question_order: 2,
    question: 'boom',
    expected_answer: 'boom',
    given_answer: 'bom',
    is_correct: false,
    question_type: 'dictation'
  });
});

test('player runtime adapter preserves V4.78 behavior when history save fails', async () => {
  const calls = [];
  const adapter = createPlayerRuntimeAdapter({
    lesson: lesson(),
    persistence: {
      async saveTestResult() {
        calls.push('save');
        throw new Error('history unavailable');
      }
    },
    cancelSpeech: () => calls.push('cancel'),
    renderResult: async payload => {
      calls.push('render');
      assert.equal(payload.historyError.message, 'history unavailable');
    },
    clearActivity: () => calls.push('clear'),
    clock: () => '2026-10-06T00:00:00.000Z'
  });

  const session = adapter.startTest({ shuffle: items => items });
  session.submit({ item: lesson().lesson_items[0], value: 'appel', correct: true });
  session.submit({ item: lesson().lesson_items[1], value: 'boom', correct: true });

  const output = await adapter.finishTest();

  assert.equal(output.historyError.message, 'history unavailable');
  assert.equal(output.result.score, 10);
  assert.deepEqual(calls, ['cancel', 'save', 'render', 'clear']);
});

test('player runtime adapter preserves exact V4.78 result navigation callbacks', () => {
  const calls = [];
  const adapter = createPlayerRuntimeAdapter({
    lesson: lesson(),
    persistence: { saveTestResult: async () => ({}) },
    renderResult: async () => {},
    showLessonChoice: selectedLesson => calls.push(['choice', selectedLesson.id]),
    goBack: () => calls.push(['back'])
  });

  adapter.retry();
  adapter.back();

  assert.deepEqual(calls, [['choice', 'lesson-1'], ['back']]);
});
