import { normalizeAgendaDate } from './agenda-model.js';

export const CUSTOM_AGENDA_STORAGE_KEY='pacogo_agenda_items';
export const TEST_CALENDAR_STORAGE_KEY='pacogo_test_calendar';

export function createAgendaDataService({storage=globalThis.localStorage, lessons=()=>[], demoItems=()=>[], now=()=>new Date()}={}) {
  const read=(key,fallback=[])=>{
    try { const value=JSON.parse(storage?.getItem(key)||'null'); return Array.isArray(value)?value:fallback; }
    catch { return fallback; }
  };
  const write=(key,value)=>storage?.setItem(key,JSON.stringify(value));

  function getCustomAgendaItems(student) { return read(CUSTOM_AGENDA_STORAGE_KEY).filter(x=>x?.student===student); }
  function saveCustomAgendaItems(items,student) {
    const all=read(CUSTOM_AGENDA_STORAGE_KEY), others=all.filter(x=>x?.student!==student);
    write(CUSTOM_AGENDA_STORAGE_KEY,[...others,...items]);
  }
  function getTestCalendar() { return read(TEST_CALENDAR_STORAGE_KEY); }
  function saveTestCalendar(items) { write(TEST_CALENDAR_STORAGE_KEY,items); }

  function buildAgendaItemsForRender(student) {
    const custom=getCustomAgendaItems(student);
    const demo=student==='Testleerling'
      ? demoItems().map(item=>({...item,date:demoDate(item.offset),id:'demo_'+item.offset,student,source:'demo'}))
      : [];
    const linkedTests=getTestCalendar()
      .filter(t=>t?.student===student&&t?.date)
      .map(t=>{
        const lesson=t.lessonId?lessons().find(l=>Number(l.id)===Number(t.lessonId)&&l.student===student&&!l.archived):null;
        return {
          id:'test_'+String(t.id),date:t.date,type:'test',icon:'📝',
          title:lesson?(lesson.subject+' — '+lesson.title):((t.subject||'Toets')+' — '+(t.title||'Toets')),
          meta:lesson?'Toets gekoppeld aan deze PacoGO-les':(t.subject||'Toets'),student,source:'testCalendar',
          lessonId:lesson?Number(lesson.id):null
        };
      });
    return [...demo,...custom,...linkedTests].sort((a,b)=>new Date(a.date)-new Date(b.date));
  }

  function demoDate(offset) {
    const d=new Date(now()); d.setHours(12,0,0,0); d.setDate(d.getDate()+Number(offset||0)); return d;
  }

  return Object.freeze({getCustomAgendaItems,saveCustomAgendaItems,getTestCalendar,saveTestCalendar,buildAgendaItemsForRender,normalizeAgendaDate});
}
