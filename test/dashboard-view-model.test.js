import test from 'node:test';
import assert from 'node:assert/strict';
import { getDashboardSubjects, getDashboardProgress, getDashboardSubjectIcon } from '../src/features/dashboard/view-model.js';

const lessons = [
  { id: 1, student: 'Zyon', subject: 'Nederlands', lesson_items: [{ id: 11 }, { id: 12 }] },
  { id: 2, student: 'Zyon', subject: 'Rekenen', lesson_items: [{ id: 21 }], archived: true },
  { id: 3, student: 'Zyon', subject: 'Nederlands', lesson_items: [{ id: 13 }] },
  { id: 4, student: 'Zenith', subject: 'Nederlands', lesson_items: [{ id: 41 }] }
];

test('dashboard groups only active lessons for the selected student', () => {
  const subjects = getDashboardSubjects(lessons, 'Zyon');
  assert.deepEqual(subjects.map(subject => [subject.label, subject.lessons.map(lesson => lesson.id)]), [
    ['Nederlands', [1, 3]]
  ]);
});

test('dashboard progress derives lesson, item and mastery counts', () => {
  const mastery = {
    get: (student, lessonId, itemId) => ({
      mastered: student === 'Zyon' && lessonId === 1 && itemId === 11
    })
  };
  assert.deepEqual(getDashboardProgress(lessons, 'Zyon', mastery), {
    lessons: 2,
    subjects: 1,
    items: 3,
    mastered: 1,
    percent: 33
  });
});

test('dashboard uses a stable icon mapping with a generic fallback', () => {
  assert.equal(getDashboardSubjectIcon('Nederlands'), '📚');
  assert.equal(getDashboardSubjectIcon('Onbekend vak'), '📘');
});
