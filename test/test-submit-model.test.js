import test from 'node:test';
import assert from 'node:assert/strict';
import { submitTestAnswer } from '../src/features/lessons/test-submit-model.js';

test('test submit appends the answer and advances exactly one index', () => {
  const activity = { items: [{ id: 1 }, { id: 2 }], index: 0, answers: [] };
  const item = activity.items[0];
  const next = submitTestAnswer({ activity, item, value: 'goed', correct: true, feedback: 'ok' });

  assert.equal(next.index, 1);
  assert.equal(next.done, false);
  assert.equal(next.total, 2);
  assert.deepEqual(next.answers, [{ item, value: 'goed', correct: true, feedback: 'ok' }]);
  assert.deepEqual(activity, { items: [{ id: 1 }, { id: 2 }], index: 0, answers: [] });
});

test('test submit marks the final answer as done', () => {
  const activity = { items: [{ id: 1 }], index: 0, answers: [] };
  const next = submitTestAnswer({ activity, item: activity.items[0], value: 'fout', correct: false });
  assert.equal(next.index, 1);
  assert.equal(next.done, true);
});

test('test submit preserves the complete entered value', () => {
  const next = submitTestAnswer({
    activity: { items: [{ id: 1 }], index: 0, answers: [] },
    item: { id: 1, question: 'Vraag', answer: 'Verwacht' },
    value: '  Mijn volledig ingevoerde antwoord  '
  });
  assert.equal(next.answers[0].value, '  Mijn volledig ingevoerde antwoord  ');
});
