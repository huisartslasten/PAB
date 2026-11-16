import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerResultRenderer } from '../src/features/lessons/player-result-renderer.js';

function documentDouble() {
  const nodes = {
    resultTitle: { textContent: '' },
    resultScore: { textContent: '' },
    resultDetails: { innerHTML: '' }
  };
  return { getElementById: id => nodes[id] || null, nodes };
}

test('player result renderer writes the professional result view to V4.78 DOM', () => {
  const doc = documentDouble();
  const renderer = createPlayerResultRenderer({ documentRef: doc, escapeHtml: value => String(value) });

  renderer.render({
    result: {
      title: '📝 Toets klaar!',
      score: 8.5,
      correct: 3,
      total: 4,
      answers: [
        { question: 'appel', value: 'fruit', expected: 'fruit', correct: true },
        { question: 'peer', value: 'boom', expected: 'fruit', correct: false }
      ]
    }
  });

  assert.equal(doc.nodes.resultTitle.textContent, '📝 Toets klaar!');
  assert.equal(doc.nodes.resultScore.textContent, '8.5');
  assert.match(doc.nodes.resultDetails.innerHTML, /3 van 4/);
  assert.match(doc.nodes.resultDetails.innerHTML, /Goed antwoord: fruit/);
});
