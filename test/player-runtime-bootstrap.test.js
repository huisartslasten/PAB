import test from 'node:test';
import assert from 'node:assert/strict';

import { createProfessionalPlayerBridge } from '../src/features/lessons/player-runtime-bootstrap.js';

function lesson() {
  return {
    id: 42,
    title: 'Woordentoets',
    subject: 'Nederlands',
    type: 'words',
    lesson_items: [
      { id: 1, question: 'appel', answer: 'fruit' },
      { id: 2, question: 'peer', answer: 'boom' }
    ]
  };
}

function documentDouble() {
  const nodes = {
    test: { classList: { remove() {}, add() {} } },
    result: { classList: { remove() {}, add() {} } },
    testTitle: { textContent: '' },
    testProgress: { innerHTML: '' },
    testContent: { innerHTML: '', querySelector() { return null; } },
    resultTitle: { textContent: '' },
    resultScore: { textContent: '' },
    resultDetails: { innerHTML: '' }
  };
  return {
    getElementById(id) { return nodes[id] || null; },
    querySelector() { return null; },
    nodes
  };
}

test('professional player bridge owns the V4.78 test entry seam', async () => {
  const documentRef = documentDouble();
  const hidden = [];
  const speech = [];
  const audio = [];
  const cleanup = [];
  const persistence = { async saveTestResult(payload) { return payload; } };
  const bridge = createProfessionalPlayerBridge({
    getLesson: lesson,
    getStudent: () => 'Zyon',
    db: null,
    persistence,
    documentRef,
    hideAll: () => hidden.push(true),
    showLessonChoice: () => {},
    goBack: () => {},
    clearActivity: () => cleanup.push(true),
    escapeHtml: value => String(value),
    speakAiText: async (...args) => { speech.push(args); },
    stopAiAudio: () => audio.push(true),
    gradeAnswer: async (expected, given) => ({ correct: expected === given, feedback: '' }),
    shuffle: items => [...items]
  });

  const entry = bridge.startTest('words');

  assert.equal(entry.runtime.session.type, 'words');
  assert.equal(entry.runtime.session.index, 0);
  assert.equal(documentRef.nodes.testTitle.textContent, '📝 Woordtrainer toets');
  assert.equal(hidden.length, 1);
  assert.equal(audio.length, 1);

  documentRef.nodes.testContent.innerHTML = '<input id="testAnswer">';
  const input = { value: 'fruit', disabled: false };
  documentRef.getElementById = id => id === 'testAnswer' ? input : documentRef.nodes[id] || null;
  documentRef.querySelector = () => ({ disabled: false });

  const first = await bridge.submitTest({ type: 'words' });
  assert.equal(first.done, false);
  assert.equal(entry.runtime.session.index, 1);
  assert.equal(cleanup.length, 0);
  assert.equal(speech.length, 0);

  input.value = 'boom';
  const second = await bridge.submitTest({ type: 'words' });
  assert.equal(second.result.score, 10);
  assert.equal(cleanup.length, 1);
  assert.equal(documentRef.nodes.resultTitle.textContent, '📝 Toets klaar!');
});
