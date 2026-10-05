import test from 'node:test';
import assert from 'node:assert/strict';
import { hydrateLessonForEditor, roundTripEditorItems } from '../src/features/lessons/editor-roundtrip.js';

test('hydrates lesson-level V4.78 fields and keeps test date outside lesson payload', () => {
  const result = hydrateLessonForEditor({
    student: ' Zyon ', subject: ' Nederlands ', subvak: ' Themawoorden ', title: ' Woorden ', type: 'words',
    explanation: ' Uitleg ', ai_check_answers: false, ai_instruction: ' betekenis ',
    editor_labels: { question: 'Werkwoord' }, lesson_items: []
  }, { testDate: '2026-11-11' });

  assert.deepEqual(result.lesson, {
    student: 'Zyon', subject: 'Nederlands', subvak: 'Themawoorden', title: 'Woorden', type: 'words',
    explanation: 'Uitleg', ai_check_answers: false, ai_instruction: 'betekenis',
    editor_labels: { question: 'Werkwoord' }
  });
  assert.equal(result.testDate, '2026-11-11');
});

test('hydrates words metadata and preserves answer/extra roles', () => {
  const [item] = hydrateLessonForEditor({
    type: 'words', lesson_items: [{
      sort_order: 2, question_parts: ['Wat is expert?'],
      answer_parts: [{ text: 'deskundige', role: 'answer' }, { text: 'kenner', role: 'extra' }],
      hint: ' Denk aan kennis ', min_words: 2, required_terms: ['kennis']
    }]
  }).items;

  assert.deepEqual(item.question_parts, ['Wat is expert?']);
  assert.deepEqual(item.answer_parts, [
    { text: 'deskundige', role: 'answer' }, { text: 'kenner', role: 'extra' }
  ]);
  assert.equal(item.hint, 'Denk aan kennis');
  assert.equal(item.min_words, 2);
  assert.deepEqual(item.required_terms, ['kennis']);
});

test('hydrates fallback answer string with newline for non-spelling types', () => {
  const [item] = hydrateLessonForEditor({
    type: 'questions', lesson_items: [{ question: 'Leg uit', answer: 'eerste antwoord\ntweede antwoord' }]
  }).items;
  assert.deepEqual(item.answer_parts, [
    { text: 'eerste antwoord', role: 'answer' }, { text: 'tweede antwoord', role: 'answer' }
  ]);
});

test('hydrates fallback spelling answer string with V4.78 separator', () => {
  const [item] = hydrateLessonForEditor({
    type: 'spelling', lesson_items: [{ question: 'werken', answer: 'werkte || gewerkt' }]
  }).items;
  assert.deepEqual(item.answer_parts, [
    { text: 'werkte', role: 'answer' }, { text: 'gewerkt', role: 'answer' }
  ]);
});

test('editor item round-trip rebuilds persisted spelling shape deterministically', () => {
  const hydrated = hydrateLessonForEditor({
    type: 'spelling', lesson_items: [{
      question_parts: ['werken'],
      answer_parts: [
        { text: 'werkte', role: 'answer' },
        { text: 'gewerkt', role: 'answer' },
        { text: 'werkend', role: 'extra' }
      ]
    }]
  });

  const [item] = roundTripEditorItems('spelling', hydrated.items);
  assert.equal(item.question, 'werken');
  assert.equal(item.answer, 'werkte || gewerkt');
  assert.deepEqual(item.answer_parts, hydrated.items[0].answer_parts);
});
