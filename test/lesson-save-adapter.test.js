import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLessonSaveRequest } from '../src/features/lessons/lesson-save-adapter.js';

test('adapter maps runtime draft to canonical V4.78 lesson model', () => {
  const result = buildLessonSaveRequest({
    draft: {
      lessonId: 42,
      student: 'Zyon',
      subject: 'Nederlands',
      enteredSubvak: 'Themawoorden',
      existingSubvak: 'Themawoorden',
      title: 'Thema 4',
      type: 'words',
      explanation: 'Uitleg',
      aiCheckAnswers: true,
      aiInstruction: 'Let op',
      editorLabels: null,
      testDate: '2026-11-12'
    },
    items: [
      { type: 'words', question: 'appel', answer: 'fruit', hint: null, min_words: '2', required_terms: null }
    ]
  });

  assert.equal(result.lessonId, 42);
  assert.deepEqual(result.lesson, {
    student: 'Zyon',
    subject: 'Nederlands',
    subvak: 'Themawoorden',
    title: 'Thema 4',
    type: 'words',
    explanation: 'Uitleg',
    ai_check_answers: true,
    ai_instruction: 'Let op',
    editor_labels: null
  });
  assert.deepEqual(result.items, [
    { type: 'words', question: 'appel', answer: 'fruit', hint: '', min_words: 2, required_terms: [] }
  ]);
  assert.equal(result.testDate, '2026-11-12');
});

test('adapter preserves spelling editor labels and create semantics', () => {
  const result = buildLessonSaveRequest({
    draft: {
      lessonId: null,
      student: 'Zenith',
      subject: 'Nederlands',
      enteredSubvak: 'Werkwoorden',
      existingSubvak: '',
      title: 'Werkwoordspelling',
      type: 'spelling',
      explanation: '',
      aiCheckAnswers: false,
      aiInstruction: '',
      editorLabels: {
        question: 'Werkwoord',
        perfect: 'Voltooid deelwoord',
        adjective: 'Bijvoeglijk gebruikt voltooid deelwoord'
      },
      testDate: ''
    },
    items: []
  });

  assert.equal(result.lessonId, null);
  assert.deepEqual(result.lesson.editor_labels, {
    question: 'Werkwoord',
    perfect: 'Voltooid deelwoord',
    adjective: 'Bijvoeglijk gebruikt voltooid deelwoord'
  });
  assert.equal(result.testDate, '');
});

test('adapter does not mutate the supplied draft or items', () => {
  const draft = Object.freeze({
    lessonId: 7,
    student: 'Zyon',
    subject: 'Rekenen',
    enteredSubvak: '',
    existingSubvak: '',
    title: 'Breuken',
    type: 'math',
    explanation: '',
    aiCheckAnswers: false,
    aiInstruction: '',
    editorLabels: null,
    testDate: ''
  });
  const items = [{ question: '1/2', answer: '0,5' }];
  const before = JSON.parse(JSON.stringify(items));

  buildLessonSaveRequest({ draft, items });

  assert.deepEqual(items, before);
});
