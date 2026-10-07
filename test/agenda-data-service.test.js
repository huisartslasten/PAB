import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgendaDataService } from '../src/features/agenda/agenda-data-service.js';

function memoryStorage(seed={}) {
  const data=new Map(Object.entries(seed).map(([k,v])=>[k,JSON.stringify(v)]));
  return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v))};
}

test('buildAgendaItemsForRender composes V4.78 demo, custom and linked test sources',()=>{
  const storage=memoryStorage({
    pacogo_agenda_items:[{id:'a1',student:'Zyon',date:'2026-10-09',type:'homework',title:'Rekenen',meta:'Bladzijde 42'}],
    pacogo_test_calendar:[{id:'t1',student:'Zyon',lessonId:4,date:'2026-10-08'}]
  });
  const lessons=()=>[{id:4,student:'Zyon',subject:'Nederlands',title:'Themawoorden',archived:false,lesson_items:[{id:1}]}];
  const service=createAgendaDataService({storage,lessons,now:()=>new Date('2026-10-07T10:00:00')});
  const items=service.buildAgendaItemsForRender('Zyon');
  assert.deepEqual(items.map(x=>x.id),['test_t1','a1']);
  assert.equal(items[0].title,'Nederlands — Themawoorden');
  assert.equal(items[0].lessonId,4);
});

test('buildAgendaItemsForRender isolates students and activates demo only for Testleerling',()=>{
  const storage=memoryStorage({pacogo_agenda_items:[{id:'z',student:'Zyon',date:'2026-10-09',title:'Zyon'}]});
  const service=createAgendaDataService({storage,now:()=>new Date('2026-10-07T10:00:00'),demoItems:()=>[{offset:1,type:'test',title:'Demo'}]});
  assert.equal(service.buildAgendaItemsForRender('Zenith').length,0);
  assert.equal(service.buildAgendaItemsForRender('Testleerling')[0].id,'demo_1');
});
