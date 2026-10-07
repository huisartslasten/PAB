import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerSubmitBoundary } from '../src/features/lessons/player-submit-boundary.js';

function documentDouble({ answer = '', perfect = '', adjective = '' } = {}) {
  const controls = {
    testAnswer: { value: answer, disabled: false },
    testPerfect: { value: perfect, disabled: false },
    testAdjective: { value: adjective, disabled: false }
  };
  const button = { disabled: false };
  return {
    getElementById(id) { return controls[id] || null; },
    querySelector(selector) { return selector === '#testContent button.big' ? button : null; },
    controls,
    button
  };
}

test('reads V4.78 word-test DOM value and delegates raw answer to adapter', async () => {
  const calls = [];
  const doc = documentDouble({ answer: '  appel  ' });
  const boundary = createPlayerSubmitBoundary({
    documentRef: doc,
    adapter: { async submitAnswer(value) { calls.push(value); return { correct: true }; } }
  });

  const result = await boundary.submitTest({ type: 'words' });

  assert.deepEqual(calls, ['  appel  ']);
  assert.deepEqual(result, { correct: true });
  assert.equal(doc.controls.testAnswer.disabled, true);
  assert.equal(doc.button.disabled, true);
});

test('builds the exact V4.78 spelling answer from both DOM inputs', async () => {
  const calls = [];
  const doc = documentDouble({ perfect: 'opgevoed', adjective: 'opgevoede' });
  const boundary = createPlayerSubmitBoundary({
    documentRef: doc,
    adapter: { async submitAnswer(value) { calls.push(value); return { correct: true }; } }
  });

  await boundary.submitTest({ type: 'spelling' });

  assert.deepEqual(calls, ['opgevoed || opgevoede']);
  assert.equal(doc.controls.testPerfect.disabled, true);
});

test('restores controls when canonical submission fails', async () => {
  const doc = documentDouble({ answer: 'appel' });
  const boundary = createPlayerSubmitBoundary({
    documentRef: doc,
    adapter: { async submitAnswer() { throw new Error('grading unavailable'); } }
  });

  await assert.rejects(() => boundary.submitTest({ type: 'words' }), /grading unavailable/);
  assert.equal(doc.controls.testAnswer.disabled, false);
  assert.equal(doc.button.disabled, false);
});
