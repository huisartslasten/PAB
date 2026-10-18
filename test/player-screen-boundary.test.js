import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerScreenBoundary } from '../src/features/lessons/player-screen-boundary.js';

function documentDouble() {
  const testScreen = { classList: { values: new Set(['hidden']), remove(value) { this.values.delete(value); } } };
  const resultScreen = { classList: { values: new Set(['hidden']), remove(value) { this.values.delete(value); } } };
  return {
    getElementById(id) {
      return { test: testScreen, result: resultScreen }[id] || null;
    },
    testScreen,
    resultScreen
  };
}

test('player screen boundary reproduces the shared test screen transition', () => {
  const doc = documentDouble();
  const calls = [];
  const boundary = createPlayerScreenBoundary({
    documentRef: doc,
    hideAll: () => calls.push('hideAll')
  });

  boundary.showTest({ type: 'dictation' });

  assert.deepEqual(calls, ['hideAll']);
  assert.equal(doc.testScreen.classList.values.has('hidden'), false);
});

test('player screen boundary transitions to the shared result screen', () => {
  const doc = documentDouble();
  const calls = [];
  const boundary = createPlayerScreenBoundary({
    documentRef: doc,
    hideAll: () => calls.push('hideAll')
  });

  boundary.showResult();

  assert.deepEqual(calls, ['hideAll']);
  assert.equal(doc.resultScreen.classList.values.has('hidden'), false);
});
