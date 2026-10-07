import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerScreenBoundary } from '../src/features/lessons/player-screen-boundary.js';

function documentDouble() {
  const testScreen = { classList: { values: new Set(['hidden']), remove(value) { this.values.delete(value); } } };
  const resultScreen = { classList: { values: new Set(['hidden']), remove(value) { this.values.delete(value); } } };
  const title = { textContent: '' };
  return {
    getElementById(id) {
      return { test: testScreen, result: resultScreen, testTitle: title }[id] || null;
    },
    testScreen,
    resultScreen,
    title
  };
}

test('player screen boundary reproduces V4.78 test screen transition', () => {
  const doc = documentDouble();
  const calls = [];
  const boundary = createPlayerScreenBoundary({
    documentRef: doc,
    hideAll: () => calls.push('hideAll')
  });

  boundary.showTest({ type: 'dictation' });

  assert.deepEqual(calls, ['hideAll']);
  assert.equal(doc.testScreen.classList.values.has('hidden'), false);
  assert.equal(doc.title.textContent, '✏️ Dictee toets');
});

test('player screen boundary maps custom and default test titles', () => {
  const doc = documentDouble();
  const boundary = createPlayerScreenBoundary({ documentRef: doc, hideAll: () => {} });

  boundary.showTest({ type: 'custom' });
  assert.equal(doc.title.textContent, '🛠️ Eigen les toets');

  boundary.showTest({ type: 'words' });
  assert.equal(doc.title.textContent, '📝 Woordtrainer toets');
});

test('player screen boundary owns result screen transition', () => {
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
