import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLessonPayload, validateLessonDraft, prepareLessonItems } from '../src/features/lessons/editor-model.js';

test('editor payload preserves the complete V4.78 lesson field set', () => {
  assert.deepEqual(buildLessonPayload({
    student: ' Zyon ', subject: ' Nederlands ', subvak: ' Themawoorden ', title: ' Woorden ', type: 'words',
    explanation: ' Uitleg ', ai_check_answers: false, ai_instruction: ' Alleen betekenis telt ',
    editor_labels: { question: ' Werkwoord ', perfect: '', adjective: ' Bijvoeglijk ' }
  }), {
    student: 'Zyon', subject: 'Nederlands', subvak: 'Themawoorden', title: 'Woorden', type: 'words',
    explanation: 'Uitleg', ai_check_answers: false, ai_instruction: 'Alleen betekenis telt',
    editor_labels: {
      question: 'Werkwoord',
      perfect: 'Voltooid deelwoord',
      adjective: 'Bijvoeglijk'
    }
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
