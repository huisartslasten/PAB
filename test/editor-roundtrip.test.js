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

test('all six editor types survive load -> hydrate -> save-model round-trip', () => {
  const cases = {
    words: { question_parts: ['expert'], answer_parts: [{ text: 'deskundige', role: 'answer' }] },
    custom: { question_parts: ['expert'], answer_parts: [{ text: 'deskundige', role: 'answer' }] },
    questions: { question_parts: ['Wat is expert?'], answer_parts: [{ text: 'deskundige', role: 'answer' }, { text: 'kenner', role: 'extra' }] },
    dictation: { question_parts: ['Schrijf op'], answer_parts: [{ text: 'deskundige', role: 'answer' }] },
    math: { question_parts: ['2 + 2'], answer_parts: [{ text: '4', role: 'answer' }] },
    spelling: { question_parts: ['werken'], answer_parts: [{ text: 'werkte', role: 'answer' }, { text: 'gewerkt', role: 'answer' }] }
  };

  for (const [type, persistedItem] of Object.entries(cases)) {
    const hydrated = hydrateLessonForEditor({ type, lesson_items: [{ ...persistedItem, sort_order: 0 }] });
    const [saved] = roundTripEditorItems(type, hydrated.items);

    assert.ok(saved, `${type} should produce a save-model item`);
    assert.deepEqual(saved.question_parts, persistedItem.question_parts, type);
    assert.deepEqual(saved.answer_parts, persistedItem.answer_parts, type);
    assert.equal(saved.sort_order, 0, type);
  }
});

test('math hydration does not perform validation; deterministic builder does', () => {
  const hydrated = hydrateLessonForEditor({
    type: 'math', lesson_items: [{ question: '2 + 2', answer: 'vier' }]
  });
  assert.deepEqual(hydrated.items[0].answer_parts, [{ text: 'vier', role: 'answer' }]);
  assert.deepEqual(roundTripEditorItems('math', hydrated.items), []);
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
