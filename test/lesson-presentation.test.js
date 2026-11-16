import test from 'node:test';
import assert from 'node:assert/strict';
import { subjectClass, subjectIcon, getStudentSubjects, getLessonsForSubject, lessonCountForSubject } from '../src/features/lessons/presentation.js';

const lessons = [
  { id: 1, student: 'Zyon', subject: 'Nederlands', archived: false, deleted: false },
  { id: 2, student: 'Zyon', subject: 'Nederlands', archived: false, deleted: false },
  { id: 3, student: 'Zyon', subject: 'Rekenen', archived: true, deleted: false },
  { id: 4, student: 'Andere leerling', subject: 'Nederlands' }
];

test('known subjects keep the V4.78 visual class and icon', () => {
  assert.equal(subjectClass('Nederlands'), 'subject-blue');
  assert.equal(subjectIcon('Nederlands'), '📚');
});

test('unknown subjects use the deterministic fallback class and icon', () => {
  assert.equal(subjectClass('Mijn nieuw vak'), subjectClass('Mijn nieuw vak'));
  assert.equal(subjectIcon('Mijn nieuw vak'), '🎓');
});

test('student subject list uses active lessons for that student', () => {
  assert.deepEqual(getStudentSubjects(lessons, 'Zyon'), ['Nederlands']);
});

test('subject lesson list and count stay scoped to student and subject', () => {
  assert.deepEqual(getLessonsForSubject(lessons, 'Zyon', 'Nederlands').map(lesson => lesson.id), [1, 2]);
  assert.equal(lessonCountForSubject(lessons, 'Zyon', 'Nederlands'), 2);
});
