import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonEditorController } from '../src/features/lessons/editor-controller.js';

function createSaveDraft() {
  const calls = [];
  return {
    calls,
    async saveDraft(input) {
      calls.push(input);
      return { lessonId: input.lessonId ?? 42 };
    }
  };
}

test('editor save prepares the canonical lesson and item payload before persistence', async () => {
  const persistence = createSaveDraft();
  let refreshed = false;
  let saved = null;

  const controller = createLessonEditorController({
    saveDraft: persistence.saveDraft,
    refreshLessons: async () => { refreshed = true; },
    onSaved: async value => { saved = value; }
  });

  const result = await controller.save({
    student: ' Zyon ',
    subject: ' Taal ',
    subvak: ' Themawoorden ',
    title: ' Themawoorden ',
    type: 'words',
    explanation: ' Uitleg ',
    aiCheckAnswers: false,
    aiInstruction: ' betekenis ',
    items: [{
      question_parts: [' Wat is expert? '],
      answer_parts: [{ text: ' deskundige ', role: 'answer' }, { text: ' kenner ', role: 'extra' }],
      hint: ' Denk aan kennis ',
      min_words: 2,
      required_terms: [' kennis ']
    }],
    testDate: '2026-11-11'
  });

  assert.equal(result.ok, true);
  assert.equal(result.lessonId, 42);
  assert.equal(persistence.calls.length, 1);
  assert.deepEqual(persistence.calls[0], {
    lessonId: null,
    lesson: {
      student: 'Zyon',
      subject: 'Taal',
      subvak: 'Themawoorden',
      title: 'Themawoorden',
      type: 'words',
      explanation: 'Uitleg',
      ai_check_answers: false,
      ai_instruction: 'betekenis',
      editor_labels: null
    },
    items: [{
      question: 'Wat is expert?',
      answer: 'deskundige',
      question_parts: ['Wat is expert?'],
      answer_parts: [
        { text: 'deskundige', role: 'answer' },
        { text: 'kenner', role: 'extra' }
      ],
      hint: 'Denk aan kennis',
      min_words: 2,
      required_terms: ['kennis'],
      sort_order: 0
    }],
    testDate: '2026-11-11'
  });
  assert.equal(result.testDate, '2026-11-11');
  assert.equal(result.lesson.testDate, undefined);
  assert.equal(refreshed, true);
  assert.deepEqual(saved, result);
});

test('existing editor save passes lessonId through unchanged', async () => {
  const persistence = createSaveDraft();
  const controller = createLessonEditorController({ saveDraft: persistence.saveDraft });

  const result = await controller.save({
    lessonId: 7,
    student: 'Zyon',
    subject: 'Taal',
    title: 'Bewerkt',
    type: 'custom',
    items: [{ question: 'huis', answer: 'house' }]
  });

  assert.equal(result.ok, true);
  assert.equal(result.lessonId, 7);
  assert.equal(persistence.calls[0].lessonId, 7);
});

test('invalid editor draft does not call persistence or refresh', async () => {
  const persistence = createSaveDraft();
  let refreshed = false;
  const controller = createLessonEditorController({
    saveDraft: persistence.saveDraft,
    refreshLessons: async () => { refreshed = true; }
  });

  const invalid = await controller.save({
    student: '',
    subject: '',
    title: '',
    type: 'words',
    items: []
  });

  assert.equal(invalid.ok, false);
  assert.equal(persistence.calls.length, 0);
  assert.equal(refreshed, false);
  assert.deepEqual(invalid.validation.errors.map(error => error.field), ['student', 'subject', 'title', 'items']);
});
