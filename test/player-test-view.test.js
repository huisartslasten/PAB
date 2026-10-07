import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerTestView } from '../src/features/lessons/player-test-view.js';

function documentDouble() {
  const nodes = {
    testProgress: { innerHTML: '' },
    testContent: { innerHTML: '' },
    testAnswer: { focus() {} }
  };
  return {
    getElementById(id) { return nodes[id] || null; },
    nodes
  };
}

test('player test view renders deterministic word test and progress', () => {
  const doc = documentDouble();
  const view = createPlayerTestView({ documentRef: doc, escapeHtml: value => String(value).replaceAll('<', '&lt;') });

  view.render({
    item: { question: '<appel>' },
    index: 0,
    total: 2,
    type: 'words'
  });

  assert.match(doc.nodes.testProgress.innerHTML, /Vraag 1 van 2/);
  assert.match(doc.nodes.testContent.innerHTML, /Typ hier het woord/);
  assert.match(doc.nodes.testContent.innerHTML, /&lt;appel&gt;/);
});

test('player test view preserves V4.78 spelling inputs', () => {
  const doc = documentDouble();
  const view = createPlayerTestView({ documentRef: doc, escapeHtml: value => String(value) });

  view.render({ item: { question: 'opvoeden' }, index: 1, total: 2, type: 'spelling' });

  assert.match(doc.nodes.testContent.innerHTML, /testPerfect/);
  assert.match(doc.nodes.testContent.innerHTML, /testAdjective/);
});

test('player test view preserves dictation speech hook', () => {
  const doc = documentDouble();
  let spoken = 0;
  const view = createPlayerTestView({
    documentRef: doc,
    escapeHtml: value => String(value),
    speakTest: () => { spoken += 1; }
  });

  view.render({ item: { question: 'appel' }, index: 0, total: 1, type: 'dictation' });

  assert.match(doc.nodes.testContent.innerHTML, /Luister/);
  assert.match(doc.nodes.testContent.innerHTML, /testVoiceStatus/);
});
