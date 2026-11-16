import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLessonSubjectGroups,
  getLessonSubjectIcon,
  getLessonSubjectLabel,
  normalizeLessonSubject
} from '../src/features/lessons/list-view-model.js';

const lessons = [
  { id: 1, student: 'Zyon', subject: 'Nederlands', archived: false },
  { id: 2, student: 'Zyon', subject: 'Rekenen', archived: true },
  { id: 3, student: 'Zyon', subject: 'Nederlands', archived: false },
  { id: 4, student: 'Zenith', subject: 'Nederlands', archived: false }
];

test('lesson subject normalization preserves the legacy key contract', () => {
  assert.equal(normalizeLessonSubject('  Begrijpend   Lezen '), 'begrijpend lezen');
  assert.equal(normalizeLessonSubject('  Café '), 'cafe');
});

test('lesson subject labels preserve canonical V4.78 labels and unknown fallback', () => {
  assert.equal(getLessonSubjectLabel(' nederlands '), 'Nederlands');
  assert.equal(getLessonSubjectLabel('   eigen vak '), 'Eigen vak');
  assert.equal(getLessonSubjectLabel(''), 'Onbekend vak');
});

test('lesson subject groups contain only active lessons for the selected student', () => {
  assert.deepEqual(
    getLessonSubjectGroups(lessons, 'Zyon').map(subject => [subject.key, subject.label, subject.lessons.map(lesson => lesson.id)]),
    [['nederlands', 'Nederlands', [1, 3]]]
  );
});

test('lesson subject icons use the canonical mapping and generic fallback', () => {
  assert.equal(getLessonSubjectIcon('Nederlands'), '📚');
  assert.equal(getLessonSubjectIcon('Onbekend vak'), '🎓');
});
