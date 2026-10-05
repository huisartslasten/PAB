import test from 'node:test';
import assert from 'node:assert/strict';
import { filterLessonsForStudentDashboard } from '../src/features/lessons/student-dashboard-filter.js';

test('V4.78 dashboard filter keeps only lessons for the current student', () => {
  const lessons = [
    { id: 1, student: 'Zyon', archived: false },
    { id: 2, student: 'Milan', archived: false },
    { id: 3, student: 'Zyon', archived: false }
  ];

  assert.deepEqual(
    filterLessonsForStudentDashboard(lessons, 'Zyon').map(lesson => lesson.id),
    [1, 3]
  );
});

test('V4.78 dashboard filter excludes archived lessons', () => {
  const lessons = [
    { id: 1, student: 'Zyon', archived: false },
    { id: 2, student: 'Zyon', archived: true },
    { id: 3, student: 'Zyon' }
  ];

  assert.deepEqual(
    filterLessonsForStudentDashboard(lessons, 'Zyon').map(lesson => lesson.id),
    [1, 3]
  );
});

test('V4.78 dashboard filter does not infer or add a deleted rule', () => {
  const lessons = [
    { id: 1, student: 'Zyon', archived: false, deleted: true },
    { id: 2, student: 'Zyon', archived: true, deleted: true }
  ];

  assert.deepEqual(
    filterLessonsForStudentDashboard(lessons, 'Zyon').map(lesson => lesson.id),
    [1]
  );
});

test('dashboard filter is defensive for non-array input', () => {
  assert.deepEqual(filterLessonsForStudentDashboard(null, 'Zyon'), []);
  assert.deepEqual(filterLessonsForStudentDashboard(undefined, 'Zyon'), []);
});
