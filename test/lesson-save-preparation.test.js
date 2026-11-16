import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareLessonSaveCoreInput } from '../src/features/lessons/lesson-save-preparation.js';

test('preparation preserves V4.78 collectItems output and maps it into coordinator shape', async () => {
  const draft = {
    lessonId: 17,
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
  };
  const rows = [
    {
      questionParts: ['appel'],
      answerParts: [{ text: 'fruit', role: 'answer' }],
      rules: { hint: 'Denk aan eten', min_words: '2', required_terms: 'boom, fruit' }
    },
    {
      questionParts: [],
      answerParts: [{ text: 'ignored', role: 'answer' }]
    }
  ];

  const prepared = prepareLessonSaveCoreInput({ draft, editorRows: rows });
  const collected = await prepared.collectItems(prepared.draft);

  assert.deepEqual(prepared.items, collected);
  assert.deepEqual(prepared.items, [{
    question: 'appel',
    answer: 'fruit',
    question_parts: ['appel'],
    answer_parts: [{ text: 'fruit', role: 'answer' }],
    sort_order: 0,
    hint: 'Denk aan eten',
    min_words: 2,
    required_terms: ['boom', 'fruit']
  }]);
  assert.equal(prepared.draft.lessonId, 17);
  assert.equal(prepared.draft.student, 'Zyon');
  assert.equal(prepared.draft.lesson.subvak, 'Themawoorden');
  assert.equal(prepared.draft.testDate, '2026-11-12');
});

test('preparation preserves spelling separator and labels', async () => {
  const prepared = prepareLessonSaveCoreInput({
    draft: {
      lessonId: null,
      student: 'Zyon',
      subject: 'Nederlands',
      enteredSubvak: 'Werkwoorden',
      existingSubvak: '',
      title: 'Spelling',
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
    editorRows: [{
      questionParts: ['lopen'],
      answerParts: [
        { text: 'gelopen', role: 'answer' },
        { text: 'gelopen', role: 'answer' }
      ]
    }]
  });

  assert.equal(prepared.items[0].answer, 'gelopen || gelopen');
  assert.deepEqual(prepared.draft.editorLabels, {
    question: 'Werkwoord',
    perfect: 'Voltooid deelwoord',
    adjective: 'Bijvoeglijk gebruikt voltooid deelwoord'
  });
  assert.equal(prepared.draft.lessonId, null);
});

test('preparation does not mutate editor rows', () => {
  const rows = [{
    questionParts: ['vraag'],
    answerParts: [{ text: 'antwoord', role: 'answer' }],
    rules: { hint: 'hint', min_words: 1, required_terms: ['antwoord'] }
  }];
  const before = JSON.parse(JSON.stringify(rows));

  prepareLessonSaveCoreInput({
    draft: {
      student: 'Zyon',
      subject: 'Rekenen',
      title: 'Les',
      type: 'words'
    },
    editorRows: rows
  });

  assert.deepEqual(rows, before);
});
