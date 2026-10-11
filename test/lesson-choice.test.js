import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLessonChoiceType,
  getLessonChoices,
  getLessonChoiceCards,
  getLessonChoiceTarget,
  getLessonChoiceMeta
} from '../src/features/lessons/choice.js';

test('lesson choice is derived from the canonical lesson component set', () => {
  assert.deepEqual(getLessonChoices('words'), ['practice', 'test', 'view']);
  assert.deepEqual(getLessonChoices('dictation'), ['practice', 'test', 'view']);
  assert.deepEqual(getLessonChoices('questions'), ['questions', 'view']);
});

test('unknown lesson type falls back safely to the question lesson component', () => {
  assert.equal(getLessonChoiceType('unknown'), 'questions');
  assert.deepEqual(getLessonChoices('unknown'), ['questions', 'view']);
});

test('lesson choice cards expose the canonical presentation labels', () => {
  assert.deepEqual(getLessonChoiceCards({ type: 'words' }), [
    { id: 'practice', label: 'Oefenen' },
    { id: 'test', label: 'Toets' },
    { id: 'view', label: 'Bekijken' }
  ]);
});

test('lesson choice target validates the canonical choice set', () => {
  assert.deepEqual(getLessonChoiceTarget({ id: 42, type: 'words' }, 'practice'), {
    lessonId: 42,
    mode: 'practice'
  });
  assert.equal(getLessonChoiceTarget({ id: 42, type: 'words' }, 'unknown'), null);
});

test('lesson choice metadata accepts canonical mapped lesson items', () => {
  assert.deepEqual(getLessonChoiceMeta({ title: 'Woorden', subject: 'Nederlands', type: 'words', items: [{}, {}] }), {
    title: 'Woorden', subject: 'Nederlands', type: 'words', itemCount: 2
  });
});
