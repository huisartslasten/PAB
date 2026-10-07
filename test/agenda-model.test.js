import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAgendaDate, agendaTitleSimilarity, agendaEventsAreDuplicate } from '../src/features/agenda/agenda-model.js';

test('agenda date normalization preserves V4.78 canonical dates',()=>{
  assert.equal(normalizeAgendaDate('2026-10-07'),'2026-10-07');
  assert.equal(normalizeAgendaDate('7-10-2026'),'2026-10-07');
  assert.equal(normalizeAgendaDate('07/10/2026'),'2026-10-07');
});

test('agenda title similarity follows V4.78 thresholds',()=>{
  assert.equal(agendaTitleSimilarity('Toets: Topografie','topografie'),0.94);
  assert.equal(agendaTitleSimilarity('Topografie hoofdstuk 6','Topografie hoofdstuk 6'),1);
  assert.equal(agendaTitleSimilarity('Rekenen breuken','Topografie'),0);
});

test('agenda duplicate detection requires same date and V4.78 title/time rules',()=>{
  assert.equal(agendaEventsAreDuplicate({date:'2026-10-07',title:'Toets: Topografie'},{date:'07/10/2026',title:'Topografie'}),true);
  assert.equal(agendaEventsAreDuplicate({date:'2026-10-07',title:'Rekenen breuken',time:'10:00'},{date:'2026-10-07',title:'Rekenen hoofdstuk',time:'10:00'}),true);
  assert.equal(agendaEventsAreDuplicate({date:'2026-10-07',title:'Topografie'},{date:'2026-10-08',title:'Topografie'}),false);
});
