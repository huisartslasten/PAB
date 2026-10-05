import test from 'node:test';
import assert from 'node:assert/strict';
import { agendaTitleSimilarity, agendaEventsAreDuplicate, mergeAgendaAiEvents } from '../src/features/agenda/merge.js';

test('agenda title similarity handles exact and contained titles', () => {
  assert.equal(agendaTitleSimilarity('Maatschappijleer', 'Maatschappijleer'), 1);
  assert.equal(agendaTitleSimilarity('Maatschappijleer', 'Toets maatschappijleer'), 0.94);
});

test('agenda duplicate rule requires the same date', () => {
  assert.equal(agendaEventsAreDuplicate({ date: '2026-11-11', title: 'Maatschappijleer' }, { date: '2026-11-12', title: 'Maatschappijleer' }), false);
});

test('agenda duplicate rule catches equivalent titles on the same date', () => {
  assert.equal(agendaEventsAreDuplicate({ date: '2026-11-11', title: 'maatschappijleer' }, { date: '2026-11-11', title: 'Maatschappijleer' }), true);
});

test('agenda duplicate rule can use matching times for similar titles', () => {
  assert.equal(agendaEventsAreDuplicate(
    { date: '2026-11-11', title: 'Toets wiskunde', time: '10:00' },
    { date: '2026-11-11', title: 'Wiskunde', time: '10:00' }
  ), true);
});

test('mergeAgendaAiEvents preserves unique events and limits output to 30', () => {
  const existing = [{ date: '2026-11-11', title: 'Maatschappijleer' }];
  const result = mergeAgendaAiEvents(existing, [
    { date: '2026-11-11', title: 'maatschappijleer' },
    { date: '2026-11-12', title: 'Topografie' }
  ]);
  assert.equal(result.length, 2);
  assert.equal(result[1].title, 'Topografie');
});
