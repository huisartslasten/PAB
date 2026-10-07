import test from 'node:test';
import assert from 'node:assert/strict';

import { createPlayerRuntimeEntry } from '../src/features/lessons/player-runtime-entry.js';

function lesson() {
  return {
    id: 'lesson-1',
    title: 'Woorden',
    type: 'words',
    lesson_items: [
      { id: 'q1', question: '1', answer: 'appel' },
      { id: 'q2', question: '2', answer: 'peer' }
    ]
  };
}

function documentDouble(values) {
  const controls = { testAnswer: { value: values.shift(), disabled: false } };
  const button = { disabled: false };
  return {
    getElementById(id) { return controls[id] || null; },
    querySelector(selector) { return selector === '#testContent button.big' ? button : null; },
    controls,
    button,
    setNextValue(value) { controls.testAnswer = { value, disabled: false }; }
  };
}

test('player runtime entry owns start-render-submit-finish sequencing', async () => {
  const doc = documentDouble(['appel']);
  const rendered = [];
  const events = [];

  const entry = createPlayerRuntimeEntry({
    lesson: lesson(),
    student: 'Zyon',
    persistence: {
      async saveTestResult(payload) {
        events.push(['save', payload]);
        return payload;
      }
    },
    renderTest: payload => rendered.push(['test', payload.index, payload.total, payload.type, payload.item.id]),
    renderResult: payload => rendered.push(['result', payload.result.score]),
    documentRef: doc,
    clock: () => '2026-10-07T00:01:00.000Z',
    createSession: (items, options) => {
      let index = 0;
      const answers = [];
      return {
        kind: 'test', type: options.type, startedAt: options.startedAt,
        currentItem() { return items[index] || null; },
        get index() { return index; },
        get total() { return items.length; },
        get answers() { return [...answers]; },
        async submit(value) {
          const item = items[index];
          const correct = value === item.answer;
          answers.push({ item, value, correct });
          index += 1;
          return { correct, done: index >= items.length, index, total: items.length };
        }
      };
    }
  });

  entry.startTest({ startedAt: '2026-10-07T00:00:00.000Z' });
  assert.deepEqual(rendered, [['test', 0, 2, 'words', 'q1']]);

  const first = await entry.submitTest({ type: 'words' });
  assert.equal(first.done, false);
  assert.deepEqual(rendered, [
    ['test', 0, 2, 'words', 'q1'],
    ['test', 1, 2, 'words', 'q2']
  ]);

  doc.setNextValue('peer');
  const second = await entry.submitTest({ type: 'words' });
  assert.equal(second.result.score, 10);
  assert.equal(events.length, 1);
  assert.equal(rendered.at(-1)[0], 'result');
});
