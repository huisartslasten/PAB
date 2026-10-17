import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStudentManagementCardModel } from '../src/features/management/student-card-view.js';

test('management cards show unique subjects and only the coming seven days', () => {
  const cards = buildStudentManagementCardModel({
    students: ['Zyon', 'Zenith'],
    lessons: [
      { student: 'Zyon', subject: 'Nederlands' },
      { student: 'Zyon', subject: 'Nederlands' },
      { student: 'Zyon', subject: 'Geschiedenis' },
      { student: 'Zenith', subject: 'Rekenen' }
    ],
    getAgendaItems: student => student === 'Zyon' ? [
      { student: 'Zyon', date: '2026-10-17', title: 'Vandaag' },
      { student: 'Zyon', date: '2026-10-20', title: 'Binnen de week' },
      { student: 'Zyon', date: '2026-10-24', title: 'Laatste dag' },
      { student: 'Zyon', date: '2026-10-25', title: 'Buiten de week' }
    ] : [],
    today: new Date('2026-10-17T12:00:00')
  });

  assert.deepEqual(cards[0].subjects, ['Geschiedenis', 'Nederlands']);
  assert.deepEqual(cards[0].agendaItems.map(item => item.title), ['Vandaag', 'Binnen de week', 'Laatste dag']);
  assert.equal(cards[1].agendaItems.length, 0);
});
