import test from 'node:test';
import assert from 'node:assert/strict';
import { getLessonChoiceType, getLessonChoices, getLessonChoiceMeta } from '../src/features/lessons/choice.js';

test('lesson choice is derived from the canonical lesson component set', () => {
  assert.deepEqual(getLessonChoices('words'), ['practice', 'test', 'view']);
  assert.deepEqual(getLessonChoices('dictation'), ['practice', 'test', 'view']);
  assert.deepEqual(getLessonChoices('questions'), ['questions', 'view']);
});

test('unknown lesson type falls back safely to the question lesson component', () => {
  assert.equal(getLessonChoiceType('unknown'), 'questions');
  assert.deepEqual(getLessonChoices('unknown'), ['questions', 'view']);
});

test('lesson choice metadata accepts canonical mapped lesson items', () => {
  assert.deepEqual(getLessonChoiceMeta({ title: 'Woorden', subject: 'Nederlands', type: 'words', items: [{}, {}] }), {
    title: 'Woorden', subject: 'Nederlands', type: 'words', itemCount: 2
  });
});
