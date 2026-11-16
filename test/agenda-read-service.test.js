import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgendaReadService } from '../src/features/agenda/read-service.js';

function storage(seed={}) { const data=new Map(Object.entries(seed).map(([k,v])=>[k,JSON.stringify(v)])); return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v))}; }

test('V4.78 agenda read service composes custom items and linked tests',()=>{
  const s=storage({
    pacogo_agenda_items:[{id:'a',student:'Zyon',date:'2026-10-09',type:'homework',title:'Rekenen',meta:'Bladzijde 42'}],
    pacogo_test_calendar:[{id:'t',student:'Zyon',lessonId:4,date:'2026-10-08'}]
  });
  const service=createAgendaReadService({storage:s,lessons:()=>[{id:4,student:'Zyon',subject:'Nederlands',title:'Themawoorden',archived:false,lesson_items:[{}]}],currentStudent:()=> 'Zyon'});
  const items=service.buildAgendaItemsForRender();
  assert.deepEqual(items.map(x=>x.id),['test_t','a']);
  assert.equal(items[0].title,'Nederlands — Themawoorden');
  assert.equal(items[0].lessonId,4);
});

test('V4.78 demo source exists only for Testleerling',()=>{
  const service=createAgendaReadService({storage:storage(),currentStudent:()=> 'Testleerling',demoItems:()=>[{offset:1,title:'Demo',type:'test'}],now:()=>new Date('2026-10-07T10:00:00')});
  const items=service.buildAgendaItemsForRender();
  assert.equal(items.length,1);
  assert.equal(items[0].id,'demo_1');
  assert.equal(items[0].source,'demo');
});
