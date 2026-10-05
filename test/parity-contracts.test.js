import test from 'node:test';
import assert from 'node:assert/strict';
import { getActiveStudentLessons, getArchivedStudentLessons, getDeletedStudentLessons } from '../src/features/lessons/visibility.js';
import { createLessonPayload, validateLessonDraft, prepareLessonItems } from '../src/features/lessons/editor-model.js';
import { evaluateWordAnswer } from '../src/features/wordtrainer/evaluator.js';
import { calculateLessonScore } from '../src/features/lessons/results.js';

test('lesson visibility contract keeps active, archived and deleted records separate', () => {
  const lessons = [
    { id: 1, student: 'Zyon', title: 'Actief' },
    { id: 2, student: 'Zyon', title: 'Archief', archived: true },
    { id: 3, student: 'Zyon', title: 'Prullenbak', deleted: true, archived: true },
    { id: 4, student: 'Andere', title: 'Andere leerling' }
  ];
  assert.deepEqual(getActiveStudentLessons(lessons, 'zyon').map(x => x.id), [1]);
  assert.deepEqual(getArchivedStudentLessons(lessons, 'zyon').map(x => x.id), [2]);
  assert.deepEqual(getDeletedStudentLessons(lessons, 'zyon').map(x => x.id), [3]);
});

test('editor contract preserves V4.78 persisted fields and stable item order', () => {
  assert.deepEqual(createLessonPayload({ student: ' Zyon ', subject: ' Nederlands ', title: ' Woorden ', type: 'words' }), {
    student: 'Zyon', subject: 'Nederlands', title: 'Woorden', type: 'words'
  });
  const items = [{ question: 'a' }, { question: 'b', sort_order: 4 }];
  assert.deepEqual(prepareLessonItems(items), [{ question: 'a', sort_order: 0 }, { question: 'b', sort_order: 4 }]);
  assert.equal(validateLessonDraft({ student: 'Zyon', subject: 'Nederlands', title: 'Les', items }).valid, true);
});

test('word evaluation is deterministic and preserves entered answer', () => {
  assert.deepEqual(evaluateWordAnswer('  Amsterdam ', 'amsterdam'), {
    correct: true,
    answer: '  Amsterdam ',
    expected: 'amsterdam',
    feedback: 'Goed!'
  });
  assert.equal(evaluateWordAnswer('Rotterdam', 'Amsterdam').correct, false);
});

test('lesson result score uses the extracted deterministic scale', () => {
  assert.equal(calculateLessonScore(10, 10), 10);
  assert.equal(calculateLessonScore(5, 10), 5);
  assert.equal(calculateLessonScore(0, 10), 1);
});
