import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getLessonChoices,
  getLessonChoiceTarget,
  getLessonType
} from '../src/features/lessons/lesson-choice.js';

test('lesson choice recognizes the V4.78 testable lesson types', () => {
  for (const type of ['words', 'custom', 'dictation', 'spelling', 'math']) {
    assert.equal(getLessonType({ type }), type);
    assert.deepEqual(
      getLessonChoices({ type }).map(choice => choice.id),
      ['practice', 'test', 'view']
    );
  }
});

test('lesson choice exposes question flow plus view for other lesson types', () => {
  assert.deepEqual(
    getLessonChoices({ type: 'questions' }).map(choice => choice.id),
    ['questions', 'view']
  );
});

test('lesson choice target is deterministic and rejects unavailable actions', () => {
  const lesson = { id: 42, type: 'dictation' };

  assert.deepEqual(
    getLessonChoiceTarget(lesson, 'test'),
    { lessonId: 42, mode: 'test' }
  );
  assert.deepEqual(
    getLessonChoiceTarget(lesson, 'view'),
    { lessonId: 42, mode: 'view' }
  );
  assert.equal(getLessonChoiceTarget(lesson, 'questions'), null);
});
