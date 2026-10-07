import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerRuntimeEntry } from '../src/features/lessons/player-runtime-entry.js';

function lesson() {
  return {
    id: 'lesson-1',
    title: 'Dictee',
    type: 'words',
    lesson_items: [{ id: 'q1', question: 'appel', answer: 'fruit' }]
  };
}

function documentDouble() {
  const controls = { testAnswer: { value: 'fruit', disabled: false } };
  const button = { disabled: false };
  return {
    getElementById(id) { return controls[id] || null; },
    querySelector(selector) { return selector === '#testContent button.big' ? button : null; },
    controls,
    button
  };
}

test('runtime entry requires application lesson and student context', () => {
  const documentRef = documentDouble();
  assert.throws(() => createPlayerRuntimeEntry({ student: 'Zyon', renderResult: () => {}, documentRef }), /A lesson is required/);
  assert.throws(() => createPlayerRuntimeEntry({ lesson: lesson(), renderResult: () => {}, documentRef }), /A student is required/);
});

test('runtime entry finishes the test when the canonical submit boundary reaches the last answer', async () => {
  const documentRef = documentDouble();
  const calls = [];
  const entry = createPlayerRuntimeEntry({
    lesson: lesson(),
    student: 'Zyon',
    persistence: { async saveTestResult(payload) { calls.push(['save', payload]); return payload; } },
    renderResult: async payload => calls.push(['render', payload]),
    documentRef,
    gradeAnswer: async (expected, given) => ({ correct: expected === given })
  });

  entry.startTest({ startedAt: '2026-10-06T00:00:00.000Z' });
  const result = await entry.submitTest({ type: 'words' });

  assert.equal(result.result.score, 100);
  assert.equal(entry.runtime.session.index, 1);
  assert.equal(calls[0][0], 'save');
  assert.equal(calls[1][0], 'render');
});
