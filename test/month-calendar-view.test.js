import test from 'node:test';
import assert from 'node:assert/strict';
import { getMonthCalendarCells, groupAgendaItemsByDate, formatMonthLabel } from '../src/features/agenda/month-calendar-view.js';

test('month calendar starts on Monday and covers the full month', () => {
  const cells = getMonthCalendarCells(2026, 9);
  assert.equal(cells[0].key, null);
  assert.equal(cells[3].key, '2026-10-01');
  assert.equal(cells.filter(cell => cell.key).length, 31);
  assert.equal(cells[33].key, '2026-10-31');
  assert.equal(cells.length, 35);
});

test('agenda items are grouped by date and ordered by time', () => {
  const grouped = groupAgendaItemsByDate([
    { date: '2026-10-08', title: 'Later', time: '14:00' },
    { date: '2026-10-08', title: 'Earlier', time: '09:00' },
    { date: '2026-10-09', title: 'Other day' }
  ]);
  assert.deepEqual(grouped.get('2026-10-08').map(item => item.title), ['Earlier', 'Later']);
  assert.equal(grouped.get('2026-10-09').length, 1);
});

test('month label uses Dutch month and year', () => {
  assert.equal(formatMonthLabel(2026, 9), 'oktober 2026');
});
