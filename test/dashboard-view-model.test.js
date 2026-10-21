import test from 'node:test';
import assert from 'node:assert/strict';
import { getDashboardSubjects, getDashboardSubjectIcon, getDashboardAgendaItems } from '../src/features/dashboard/view-model.js';

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

test('dashboard uses a stable icon mapping with a generic fallback', () => {
  assert.equal(getDashboardSubjectIcon('Nederlands'), '📚');
  assert.equal(getDashboardSubjectIcon('Onbekend vak'), '🎓');
});

test('dashboard agenda read model keeps only upcoming items and preserves lesson links', () => {
  const agendaRead = {
    buildAgendaItemsForRender: () => [
      { id: 'past', date: '2026-10-10', title: 'Voorbij', type: 'test' },
      { id: 'later', date: '2026-10-15', title: 'Toets rekenen', type: 'test', lessonId: 42 },
      { id: 'soon', date: '2026-10-12', title: 'Huiswerk', type: 'homework', meta: 'Bladzijde 4' },
      { id: 'latest', date: '2026-10-20', title: 'Lezen', type: 'homework' }
    ]
  };

  assert.deepEqual(getDashboardAgendaItems(agendaRead, 2, new Date('2026-10-11T12:00:00Z')), [
    {
      id: 'soon',
      date: '2026-10-12',
      type: 'homework',
      icon: '📌',
      title: 'Huiswerk',
      meta: 'Bladzijde 4',
      lessonId: null
    },
    {
      id: 'later',
      date: '2026-10-15',
      type: 'test',
      icon: '📌',
      title: 'Toets rekenen',
      meta: '',
      lessonId: 42
    }
  ]);
});
