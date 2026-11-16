import test from 'node:test';
import assert from 'node:assert/strict';
import { addAgendaItems, createAgendaImportItem } from '../src/features/agenda/persistence.js';

test('agenda persistence rejects empty date/title and de-duplicates by date and case-insensitive title', () => {
  const existing = [{ id: 1, date: '2026-11-11', title: 'Maatschappijleer' }];
  const result = addAgendaItems(existing, [
    { id: 2, date: '2026-11-11', title: 'maatschappijleer' },
    { id: 3, date: '2026-11-12', title: 'Topografie' },
    { id: 4, date: '', title: 'Leeg' },
    { id: 5, date: '2026-11-13', title: '' }
  ]);
  assert.deepEqual(result.items.map(item => item.id), [1, 3]);
  assert.deepEqual(result.added.map(item => item.id), [3]);
});

test('agenda import item keeps the V4.78 persisted shape', () => {
  const item = createAgendaImportItem({
    index: 2,
    student: 'Zyon',
    date: '2026-11-11',
    type: 'test',
    title: 'Maatschappijleer',
    meta: 'hoofdstuk 3',
    source: 'AI agenda-import',
    createdAt: '2026-10-05T20:00:00.000Z'
  });
  assert.deepEqual(item, {
    id: 'agenda_2_' + item.id.split('_').pop(),
    student: 'Zyon',
    date: '2026-11-11',
    type: 'test',
    title: 'Maatschappijleer',
    meta: 'hoofdstuk 3',
    source: 'AI agenda-import',
    createdAt: '2026-10-05T20:00:00.000Z'
  });
});
