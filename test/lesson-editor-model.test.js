import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonPayload, validateLessonDraft, prepareLessonItems } from '../src/features/lessons/editor-model.js';

test('lesson payload trims the four persisted editor fields', () => {
  assert.deepEqual(createLessonPayload({ student: ' Zyon ', subject: ' Nederlands ', title: ' Woorden ', type: 'words' }), {
    student: 'Zyon', subject: 'Nederlands', title: 'Woorden', type: 'words'
  });
});

test('lesson draft requires student, subject, title and at least one item', () => {
  assert.equal(validateLessonDraft({ student: 'Zyon', subject: 'Nederlands', title: 'Les', items: [{}] }).valid, true);
  assert.equal(validateLessonDraft({ student: '', subject: 'Nederlands', title: 'Les', items: [{}] }).valid, false);
  assert.equal(validateLessonDraft({ student: 'Zyon', subject: 'Nederlands', title: 'Les', items: [] }).valid, false);
});

test('lesson items receive stable sort order without mutating the source array', () => {
  const source = [{ prompt: 'a' }, { prompt: 'b', sort_order: 9 }];
  assert.deepEqual(prepareLessonItems(source), [{ prompt: 'a', sort_order: 0 }, { prompt: 'b', sort_order: 9 }]);
  assert.deepEqual(source, [{ prompt: 'a' }, { prompt: 'b', sort_order: 9 }]);
});
