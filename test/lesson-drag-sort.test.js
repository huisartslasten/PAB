import assert from 'node:assert/strict';
import test from 'node:test';
import { getLessonCardOrder } from '../src/features/lessons/lesson-drag-sort.js';

test('lesson drag sort reads lesson ids in rendered DOM order', () => {
  const container = {
    querySelectorAll: selector => {
      assert.equal(selector, '[data-lesson-id]');
      return [
        { dataset: { lessonId: '12' } },
        { dataset: { lessonId: '7' } },
        { dataset: { lessonId: '21' } }
      ];
    }
  };

  assert.deepEqual(getLessonCardOrder(container), [12, 7, 21]);
});

test('lesson drag sort ignores cards without a numeric lesson id', () => {
  const container = {
    querySelectorAll: () => [
      { dataset: { lessonId: '4' } },
      { dataset: { lessonId: '' } },
      { dataset: { lessonId: '0' } },
      { dataset: { lessonId: '9' } }
    ]
  };

  assert.deepEqual(getLessonCardOrder(container), [4, 9]);
});
