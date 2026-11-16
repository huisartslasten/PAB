import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestStartModel } from '../src/features/lessons/test-start-model.js';

test('test start model preserves V4.78 activity state and metadata', () => {
  const items = [{ id: 1 }, { id: 2 }];
  const model = createTestStartModel({
    type: 'custom',
    lessonItems: items,
    shuffle: source => [...source].reverse(),
    now: () => '2026-10-06T05:00:00.000Z'
  });

  assert.deepEqual(model, {
    kind: 'test',
    type: 'custom',
    items: [{ id: 2 }, { id: 1 }],
    index: 0,
    answers: [],
    startedAt: '2026-10-06T05:00:00.000Z',
    title: '🛠️ Eigen les toets'
  });
  assert.notStrictEqual(model.items, items);
});

test('test start model uses exact V4.78 titles', () => {
  assert.equal(createTestStartModel({ type: 'dictation', now: () => 'x' }).title, '✏️ Dictee toets');
  assert.equal(createTestStartModel({ type: 'custom', now: () => 'x' }).title, '🛠️ Eigen les toets');
  assert.equal(createTestStartModel({ type: 'words', now: () => 'x' }).title, '📝 Woordtrainer toets');
  assert.equal(createTestStartModel({ type: 'spelling', now: () => 'x' }).title, '📝 Woordtrainer toets');
  assert.equal(createTestStartModel({ type: 'math', now: () => 'x' }).title, '📝 Woordtrainer toets');
});

test('test start model does not mutate source items', () => {
  const items = [{ id: 1 }];
  const model = createTestStartModel({ lessonItems: items, now: () => 'x' });
  model.items.push({ id: 2 });
  assert.deepEqual(items, [{ id: 1 }]);
});
