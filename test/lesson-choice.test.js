import test from 'node:test';
import assert from 'node:assert/strict';
import { getLessonChoiceType, getLessonChoices, getLessonChoiceMeta } from '../src/features/lessons/choice.js';

test('lesson choice preserves type-specific options', () => {
  assert.deepEqual(getLessonChoices('words'), ['practice', 'test']);
  assert.deepEqual(getLessonChoices('dictation'), ['practice', 'test']);
  assert.deepEqual(getLessonChoices('questions'), ['practice']);
});

test('unknown lesson type falls back safely', () => {
  assert.equal(getLessonChoiceType('unknown'), 'questions');
  assert.deepEqual(getLessonChoices('unknown'), ['practice']);
});

test('lesson choice metadata preserves title, subject, type and item count', () => {
  assert.deepEqual(getLessonChoiceMeta({ title: 'Woorden', subject: 'Nederlands', type: 'words', lesson_items: [{}, {}] }), {
    title: 'Woorden', subject: 'Nederlands', type: 'words', itemCount: 2
  });
});
