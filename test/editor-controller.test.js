import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonEditorController } from '../src/features/lessons/editor-controller.js';

function createSaveDraft(resultFactory = input => ({ ok: true, lessonId: input.lessonId ?? 42 })) {
  const calls = [];
  return {
    calls,
    async saveDraft(input) {
      calls.push(input);
      return resultFactory(input);
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
  assert.deepEqual(persistence.calls[0].items, [{
    question: 'Wat is expert?',
    answer: 'deskundige',
    question_parts: ['Wat is expert?'],
    answer_parts: [
      { text: 'deskundige', role: 'answer' },
      { text: 'kenner', role: 'extra' }
    ],
    response_type: 'text',
    answer_options: [],
    hint: 'Denk aan kennis',
    min_words: 2,
    required_terms: ['kennis'],
    sort_order: 0
  }]);
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
    title: 'Bestaande les',
    type: 'words',
    items: [{ question: 'Vraag', answer: 'Antwoord' }]
  });

  assert.equal(result.ok, true);
  assert.equal(persistence.calls[0].lessonId, 7);
});

test('invalid editor draft does not call persistence or refresh', async () => {
  const persistence = createSaveDraft();
  let refreshed = false;
  const controller = createLessonEditorController({
    saveDraft: persistence.saveDraft,
    refreshLessons: async () => { refreshed = true; }
  });

  const result = await controller.save({ student: 'Zyon', type: 'words', items: [] });

  assert.equal(result.ok, false);
  assert.equal(persistence.calls.length, 0);
  assert.equal(refreshed, false);
});

test('persistence failure does not refresh or report the lesson as saved', async () => {
  const persistence = createSaveDraft(() => ({ ok: false, stage: 'persistence', message: 'save failed' }));
  let refreshed = false;
  const controller = createLessonEditorController({
    saveDraft: persistence.saveDraft,
    refreshLessons: async () => { refreshed = true; }
  });

  const result = await controller.save({
    student: 'Zyon',
    subject: 'Taal',
    title: 'Les',
    type: 'words',
    items: [{ question: 'Vraag', answer: 'Antwoord' }]
  });

  assert.equal(result.ok, false);
  assert.equal(refreshed, false);
});
