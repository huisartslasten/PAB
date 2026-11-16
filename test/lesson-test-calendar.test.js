import test from 'node:test';
import assert from 'node:assert/strict';
import {
  removeLessonTestDate,
  syncLessonTestDate,
  upsertLessonTestDate
} from '../src/features/lessons/lesson-test-calendar.js';

test('adds a new V4.78 test-calendar entry with a generated id', () => {
  assert.deepEqual(upsertLessonTestDate({
    items: [],
    lessonId: '42',
    student: 'Zyon',
    date: '2026-11-12',
    lesson: { subject: 'Nederlands', title: 'Dictee' },
    createId: () => 'generated-id'
  }), [{
    id: 'generated-id',
    student: 'Zyon',
    lessonId: 42,
    subject: 'Nederlands',
    title: 'Dictee',
    date: '2026-11-12'
  }]);
});

test('updates the matching lesson/student while preserving the existing id', () => {
  assert.deepEqual(upsertLessonTestDate({
    items: [{
      id: 'existing-id',
      student: 'Zyon',
      lessonId: 42,
      subject: 'Oud vak',
      title: 'Oude titel',
      date: '2026-11-10'
    }],
    lessonId: '42',
    student: 'Zyon',
    date: '2026-11-12',
    lesson: { subject: 'Nederlands', title: 'Dictee' },
    createId: () => 'must-not-be-used'
  }), [{
    id: 'existing-id',
    student: 'Zyon',
    lessonId: 42,
    subject: 'Nederlands',
    title: 'Dictee',
    date: '2026-11-12'
  }]);
});

test('does not update another student or another lesson', () => {
  const items = [
    { id: 'a', student: 'Zyon', lessonId: 42, subject: 'Nederlands', title: 'A', date: '2026-11-10' },
    { id: 'b', student: 'Zenith', lessonId: 42, subject: 'Nederlands', title: 'B', date: '2026-11-11' }
  ];

  assert.deepEqual(upsertLessonTestDate({
    items,
    lessonId: 99,
    student: 'Zyon',
    date: '2026-11-12',
    lesson: { subject: 'Rekenen', title: 'C' },
    createId: () => 'c'
  }), [
    ...items,
    { id: 'c', student: 'Zyon', lessonId: 99, subject: 'Rekenen', title: 'C', date: '2026-11-12' }
  ]);
});

test('removes only the matching lesson/student entry', () => {
  const items = [
    { id: 'a', student: 'Zyon', lessonId: 42, date: '2026-11-10' },
    { id: 'b', student: 'Zenith', lessonId: 42, date: '2026-11-10' },
    { id: 'c', student: 'Zyon', lessonId: 99, date: '2026-11-10' }
  ];

  assert.deepEqual(removeLessonTestDate({ items, lessonId: '42', student: 'Zyon' }), [
    items[1],
    items[2]
  ]);
});

test('empty date follows the V4.78 removal path', () => {
  const items = [{ id: 'a', student: 'Zyon', lessonId: 42, date: '2026-11-10' }];
  assert.deepEqual(syncLessonTestDate({
    items,
    lessonId: 42,
    student: 'Zyon',
    date: '',
    lesson: { subject: 'Nederlands', title: 'Dictee' }
  }), []);
});

test('non-empty date follows the V4.78 upsert path', () => {
  assert.deepEqual(syncLessonTestDate({
    items: [],
    lessonId: 42,
    student: 'Zyon',
    date: '2026-11-12',
    lesson: { subject: 'Nederlands', title: 'Dictee' },
    createId: () => 'id-42'
  }), [{
    id: 'id-42',
    student: 'Zyon',
    lessonId: 42,
    subject: 'Nederlands',
    title: 'Dictee',
    date: '2026-11-12'
  }]);
});
