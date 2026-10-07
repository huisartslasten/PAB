import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerRuntimeEntry } from '../src/features/lessons/player-runtime-entry.js';

function lesson() {
  return {
    id: 'lesson-1',
    title: 'Dictee',
    type: 'words',
    lesson_items: [
      { id: 'q1', question: 'appel', answer: 'fruit' },
      { id: 'q2', question: 'peer', answer: 'boom' }
    ]
  };
}

function documentDouble() {
  const controls = { testAnswer: { value: '', disabled: false } };
  const button = { disabled: false };
  return {
    getElementById(id) { return controls[id] || null; },
    querySelector(selector) { return selector === '#testContent button.big' ? button : null; },
    controls,
    button
  };
}

test('runtime entry requires application lesson, student and test renderer context', () => {
  const documentRef = documentDouble();
  assert.throws(() => createPlayerRuntimeEntry({ student: 'Zyon', renderResult: () => {}, renderTest: () => {}, documentRef }), /A lesson is required/);
  assert.throws(() => createPlayerRuntimeEntry({ lesson: lesson(), renderResult: () => {}, renderTest: () => {}, documentRef }), /A student is required/);
  assert.throws(() => createPlayerRuntimeEntry({ lesson: lesson(), student: 'Zyon', renderResult: () => {}, documentRef }), /A test renderer is required/);
});

test('runtime entry renders start and next item, then finishes on the last canonical submit', async () => {
  const documentRef = documentDouble();
  const calls = [];
  const entry = createPlayerRuntimeEntry({
    lesson: lesson(),
    student: 'Zyon',
    persistence: { async saveTestResult(payload) { calls.push(['save', payload]); return payload; } },
    renderTest: ({ item }) => { calls.push(['render-test', item.id]); documentRef.controls.testAnswer.value = item.answer; },
    renderResult: async payload => calls.push(['render-result', payload]),
    documentRef,
    gradeAnswer: async (expected, given) => ({ correct: expected === given })
  });

  entry.startTest({ startedAt: '2026-10-06T00:00:00.000Z' });
  const first = await entry.submitTest({ type: 'words' });
  const second = await entry.submitTest({ type: 'words' });

  assert.equal(first.correct, true);
  assert.equal(second.result.score, 10);
  assert.deepEqual(calls.map(([kind]) => kind), ['render-test', 'render-test', 'save', 'render-result']);
});
