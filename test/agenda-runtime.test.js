import test from 'node:test';
import assert from 'node:assert/strict';
import { agendaStartOfWeek, agendaKey, agendaFormatRange, createAgendaRuntime } from '../src/features/agenda/agenda-runtime.js';

test('agenda week boundary is Monday based like V4.78',()=>{
  assert.equal(agendaKey(agendaStartOfWeek(new Date('2026-10-07T12:00:00'))),'2026-10-05');
  assert.equal(agendaKey(agendaStartOfWeek(new Date('2026-10-11T12:00:00'))),'2026-10-05');
  assert.equal(agendaFormatRange(new Date('2026-10-05T12:00:00')),'5 okt – 11 okt');
});

test('agenda runtime moves by whole school weeks and re-renders composed data',()=>{
  const renders=[];
  const dataService={buildAgendaItemsForRender:student=>[{student,date:'2026-10-07'}]};
  const runtime=createAgendaRuntime({dataService,student:()=> 'Zyon',render:state=>renders.push(state),now:()=>new Date('2026-10-07T12:00:00')});
  assert.equal(agendaKey(runtime.getState().weekStart),'2026-10-05');
  runtime.moveWeek(1);
  assert.equal(agendaKey(runtime.getState().weekStart),'2026-10-12');
  assert.equal(renders.at(-1).items[0].student,'Zyon');
});
