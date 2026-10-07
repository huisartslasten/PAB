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
  const controls = {
    testAnswer: { value: 'fruit', disabled: false }
  };
  const button = { disabled: false };
  return {
    getElementById(id) { return controls[id] || null; },
    querySelector(selector) { return selector === '#testContent button.big' ? button : null; },
    controls,
    button
  };
}

test('runtime entry composes runtime and DOM submit boundary', async () => {
  const doc = documentDouble();
  const calls = [];
  const entry = createPlayerRuntimeEntry({
    lesson: lesson(),
    student: 'Zyon',
    persistence: { async saveTestResult(payload) { calls.push(['save', payload]); return payload; } },
    renderResult: async payload => calls.push(['render', payload]),
    documentRef: doc,
    gradeAnswer: async (expected, given) => ({ correct: expected === given })
  });

  entry.startTest({ shuffle: items => items, startedAt: '2026-10-06T00:00:00.000Z' });
  const result = await entry.submitTest({ type: 'words' });

  assert.equal(result.correct, true);
  assert.equal(entry.runtime.session.index, 1);
  assert.equal(doc.controls.testAnswer.disabled, true);

  await entry.finishTest({ finishedAt: '2026-10-06T00:01:00.000Z' });
  assert.equal(calls[0][0], 'save');
  assert.equal(calls[1][0], 'render');
});
