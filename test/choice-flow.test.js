import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonChoiceFlow } from '../src/features/lessons/choice-flow.js';

test('lesson choice flow consumes the canonical lesson choice owner', () => {
  const opened = [];
  const flow = createLessonChoiceFlow({ open: target => opened.push(target) });

  assert.deepEqual(flow.getChoices({ type: 'words' }), ['practice', 'test', 'view']);
  assert.deepEqual(flow.choose({ id: 42, type: 'words' }, 'test'), {
    lessonId: 42,
    mode: 'test'
  });
  assert.deepEqual(opened, [{ lessonId: 42, mode: 'test' }]);
  assert.equal(flow.choose({ id: 42, type: 'words' }, 'unknown'), null);
});
