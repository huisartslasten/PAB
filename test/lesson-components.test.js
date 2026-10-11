import test from 'node:test';
import assert from 'node:assert/strict';
import { getLessonComponents, getLessonComponentType, hasLessonComponent } from '../src/features/lessons/components.js';

test('words lessons explicitly own the flashcards component', () => {
  const lesson = { type: 'words' };

  assert.equal(getLessonComponentType(lesson), 'words');
  assert.equal(hasLessonComponent(lesson, 'flashcards'), true);
  assert.deepEqual(getLessonComponents(lesson), ['practice', 'flashcards', 'test', 'view']);
});

test('question lessons do not expose flashcards', () => {
  const lesson = { type: 'questions' };

  assert.equal(hasLessonComponent(lesson, 'flashcards'), false);
  assert.deepEqual(getLessonComponents(lesson), ['questions', 'view']);
});

test('unknown lesson types use the question component set', () => {
  assert.deepEqual(getLessonComponents({ type: 'unknown' }), ['questions', 'view']);
  assert.equal(hasLessonComponent({ type: 'unknown' }, 'flashcards'), false);
});
