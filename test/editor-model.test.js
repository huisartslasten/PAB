import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonPayload, validateLessonDraft, prepareLessonItems } from '../src/features/lessons/editor-model.js';

test('editor payload trims the four core lesson fields', () => {
  assert.deepEqual(createLessonPayload({ student: ' Zyon ', subject: ' Nederlands ', title: ' Woorden ', type: 'words' }), {
    student: 'Zyon', subject: 'Nederlands', title: 'Woorden', type: 'words'
  });
});

test('editor draft validation reports missing required fields', () => {
  const result = validateLessonDraft({ student: 'Zyon', subject: '', title: '', items: [] });
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, ['subject', 'title', 'items']);
});

test('editor items retain explicit sort order and receive an index fallback', () => {
  assert.deepEqual(prepareLessonItems([{ question: 'a' }, { question: 'b', sort_order: 8 }]), [
    { question: 'a', sort_order: 0 }, { question: 'b', sort_order: 8 }
  ]);
});
