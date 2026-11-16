import test from 'node:test';
import assert from 'node:assert/strict';
import {
  lessonBelongsToStudent,
  getStudentLessons,
  getActiveStudentLessons,
  getArchivedStudentLessons,
  getDeletedStudentLessons
} from '../src/features/lessons/visibility.js';

const lessons = [
  { id: 1, student: 'Zyon', subject: 'Nederlands' },
  { id: 2, student: 'Zyon', subject: 'Rekenen', archived: true },
  { id: 3, student: 'Zyon', subject: 'Geschiedenis', deleted: true },
  { id: 4, student: 'Zyon', subject: 'Biologie', archived: true, deleted: true },
  { id: 5, student: 'Andere leerling', subject: 'Nederlands' }
];

test('lesson visibility matches the active student without changing the stored name', () => {
  assert.equal(lessonBelongsToStudent(lessons[0], 'Zyon'), true);
  assert.equal(lessonBelongsToStudent(lessons[0], 'Andere leerling'), false);
});

test('student lesson collection keeps archive and deleted records available to their own views', () => {
  assert.deepEqual(getStudentLessons(lessons, 'Zyon').map(lesson => lesson.id), [1, 2, 3, 4]);
});

test('active student lessons exclude archived and deleted records', () => {
  assert.deepEqual(getActiveStudentLessons(lessons, 'Zyon').map(lesson => lesson.id), [1]);
});

test('archived and deleted views remain separate', () => {
  assert.deepEqual(getArchivedStudentLessons(lessons, 'Zyon').map(lesson => lesson.id), [2]);
  assert.deepEqual(getDeletedStudentLessons(lessons, 'Zyon').map(lesson => lesson.id), [3, 4]);
});
