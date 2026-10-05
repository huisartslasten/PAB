import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterLessonsForStudentDashboard,
  filterLessonsForPreparationStats,
  filterLessonsForSidebar,
  filterLessonsForAgendaLessonMatch
} from '../src/features/lessons/student-dashboard-filter.js';

test('V4.78 dashboard filter requires current student and excludes archived/deleted lessons', () => {
  const lessons = [
    { id: 1, student: 'Zyon', archived: false, deleted: false },
    { id: 2, student: 'Milan', archived: false, deleted: false },
    { id: 3, student: 'Zyon', archived: false, deleted: false },
    { id: 4, student: 'Zyon', archived: true, deleted: false },
    { id: 5, student: 'Zyon', archived: false, deleted: true }
  ];

  assert.deepEqual(
    filterLessonsForStudentDashboard(lessons, 'Zyon').map(lesson => lesson.id),
    [1, 3]
  );
});

test('V4.78 preparation stats filter excludes archived but does not add a deleted check', () => {
  const lessons = [
    { id: 1, student: 'Zyon', archived: false, deleted: false },
    { id: 2, student: 'Zyon', archived: true, deleted: false },
    { id: 3, student: 'Zyon', archived: false, deleted: true },
    { id: 4, student: 'Milan', archived: false, deleted: false }
  ];

  assert.deepEqual(
    filterLessonsForPreparationStats(lessons, 'Zyon').map(lesson => lesson.id),
    [1, 3]
  );
});

test('V4.78 sidebar filter matches the dashboard visibility boundary', () => {
  const lessons = [
    { id: 1, student: 'Zyon', archived: false, deleted: false },
    { id: 2, student: 'Zyon', archived: true, deleted: false },
    { id: 3, student: 'Zyon', archived: false, deleted: true }
  ];

  assert.deepEqual(
    filterLessonsForSidebar(lessons, 'Zyon').map(lesson => lesson.id),
    [1]
  );
});

test('V4.78 agenda lesson matching excludes archived lessons but does not add a deleted check', () => {
  const lessons = [
    { id: 1, student: 'Zyon', archived: false, deleted: false, lesson_items: [{ id: 10 }] },
    { id: 2, student: 'Zyon', archived: true, deleted: false, lesson_items: [{ id: 11 }] },
    { id: 3, student: 'Zyon', archived: false, deleted: true, lesson_items: [{ id: 12 }] },
    { id: 4, student: 'Zyon', archived: false, deleted: false, lesson_items: [] },
    { id: 5, student: 'Milan', archived: false, deleted: false, lesson_items: [{ id: 13 }] }
  ];

  assert.deepEqual(
    filterLessonsForAgendaLessonMatch(lessons, 'Zyon').map(lesson => lesson.id),
    [1, 3]
  );
});

test('lesson visibility helpers are defensive for non-array input', () => {
  assert.deepEqual(filterLessonsForStudentDashboard(null, 'Zyon'), []);
  assert.deepEqual(filterLessonsForPreparationStats(undefined, 'Zyon'), []);
  assert.deepEqual(filterLessonsForSidebar(null, 'Zyon'), []);
  assert.deepEqual(filterLessonsForAgendaLessonMatch(undefined, 'Zyon'), []);
});
