import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterLessonsForStudentDashboard,
  filterLessonsForSubjectPage,
  filterLessonsForPreparationStats,
  filterLessonsForSidebar,
  filterLessonsForAgendaLessonMatch,
  filterActiveLessonsForParent,
  filterArchivedLessonsForParent,
  filterArchivedLessonsForRecovery,
  filterDeletedLessonsForRecovery
} from '../src/features/lessons/student-dashboard-filter.js';

const lessons = [
  { id: 1, student: 'Zyon', subject: 'Nederlands', archived: false, deleted: false, lesson_items: [{ id: 10 }] },
  { id: 2, student: 'Milan', subject: 'Nederlands', archived: false, deleted: false, lesson_items: [{ id: 11 }] },
  { id: 3, student: 'Zyon', subject: 'Rekenen', archived: false, deleted: false, lesson_items: [{ id: 12 }] },
  { id: 4, student: 'Zyon', subject: 'Nederlands', archived: true, deleted: false, lesson_items: [{ id: 13 }] },
  { id: 5, student: 'Zyon', subject: 'Nederlands', archived: false, deleted: true, lesson_items: [{ id: 14 }] },
  { id: 6, student: 'Zyon', subject: 'Nederlands', archived: true, deleted: true, lesson_items: [{ id: 15 }] },
  { id: 7, student: 'Zyon', subject: 'Nederlands', archived: false, deleted: false, lesson_items: [] }
];

test('V4.78 dashboard filter excludes archived and deleted lessons', () => {
  assert.deepEqual(filterLessonsForStudentDashboard(lessons, 'Zyon').map(x => x.id), [1, 3, 7]);
});

test('V4.78 subject page uses the same active visibility boundary', () => {
  assert.deepEqual(
    filterLessonsForSubjectPage(lessons, 'Zyon', 'nederlands').map(x => x.id),
    [1, 7]
  );
});

test('V4.78 preparation stats excludes archived but does not add deleted exclusion', () => {
  assert.deepEqual(filterLessonsForPreparationStats(lessons, 'Zyon').map(x => x.id), [1, 3, 5, 7]);
});

test('V4.78 sidebar excludes archived and deleted lessons', () => {
  assert.deepEqual(filterLessonsForSidebar(lessons, 'Zyon').map(x => x.id), [1, 3, 7]);
});

test('V4.78 agenda lesson matching excludes archived lessons but does not add deleted exclusion', () => {
  assert.deepEqual(filterLessonsForAgendaLessonMatch(lessons, 'Zyon').map(x => x.id), [1, 3, 5]);
});

test('V4.78 parent active lessons exclude archived and deleted lessons', () => {
  assert.deepEqual(filterActiveLessonsForParent(lessons, 'Zyon').map(x => x.id), [1, 3, 7]);
});

test('V4.78 parent archived lessons include archived but not deleted lessons', () => {
  assert.deepEqual(filterArchivedLessonsForParent(lessons, 'Zyon').map(x => x.id), [4]);
});

test('V4.78 archive recovery filter is archived and not deleted', () => {
  assert.deepEqual(filterArchivedLessonsForRecovery(lessons).map(x => x.id), [4]);
});

test('V4.78 trash recovery filter is any deleted lesson', () => {
  assert.deepEqual(filterDeletedLessonsForRecovery(lessons).map(x => x.id), [5, 6]);
});

test('lesson visibility helpers are defensive for non-array input', () => {
  assert.deepEqual(filterLessonsForStudentDashboard(null, 'Zyon'), []);
  assert.deepEqual(filterLessonsForSubjectPage(undefined, 'Zyon', 'nederlands'), []);
  assert.deepEqual(filterLessonsForPreparationStats(null, 'Zyon'), []);
  assert.deepEqual(filterLessonsForSidebar(undefined, 'Zyon'), []);
  assert.deepEqual(filterLessonsForAgendaLessonMatch(null, 'Zyon'), []);
  assert.deepEqual(filterActiveLessonsForParent(undefined, 'Zyon'), []);
  assert.deepEqual(filterArchivedLessonsForParent(null, 'Zyon'), []);
  assert.deepEqual(filterArchivedLessonsForRecovery(undefined), []);
  assert.deepEqual(filterDeletedLessonsForRecovery(null), []);
});
