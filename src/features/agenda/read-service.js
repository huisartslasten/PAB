import { createCustomAgendaStorage } from './custom-storage.js';
import { createTestCalendarStorage } from './test-calendar.js';
import { normalizeAgendaDateKey } from './date-normalization.js';

/** Deterministic V4.78 agenda composition boundary. */
export function createAgendaReadService({ storage = globalThis.localStorage, lessons = () => [], currentStudent = () => null, demoItems = () => [], now = () => new Date() } = {}) {
  const customStorage = createCustomAgendaStorage(storage);
  const testCalendar = createTestCalendarStorage(storage);
  const demoDateFromOffset = offset => { const date = new Date(now()); date.setHours(12,0,0,0); date.setDate(date.getDate()+Number(offset||0)); return date; };
  const getCustomAgendaItems = (student = currentStudent()) => customStorage.getItems(student);
  const getTestCalendar = () => testCalendar.getAll();

  function buildAgendaItemsForRender(student = currentStudent()) {
    const custom = getCustomAgendaItems(student);
    const demo = student === 'Testleerling' ? demoItems().map(item => ({ ...item, date: demoDateFromOffset(item.offset), id: 'demo_'+item.offset, student, source:'demo' })) : [];
    const linkedTests = getTestCalendar().filter(test => test?.student===student && test?.date).map(test => {
      const lesson = test.lessonId ? lessons().find(item => Number(item.id)===Number(test.lessonId) && item.student===student && !item.archived) : null;
      return { id:'test_'+String(test.id), date:test.date, type:'test', icon:'📝', title:lesson?`${lesson.subject} — ${lesson.title}`:`${test.subject||'Toets'} — ${test.title||'Toets'}`, meta:lesson?'Toets gekoppeld aan deze PacoGO-les':(test.subject||'Toets'), student, source:'testCalendar', lessonId:lesson?Number(lesson.id):null };
    });
    return [...demo,...custom,...linkedTests].sort((a,b)=>new Date(a.date)-new Date(b.date));
  }

  return Object.freeze({ getCustomAgendaItems, getTestCalendar, buildAgendaItemsForRender, normalizeAgendaDate: normalizeAgendaDateKey, customStorage, testCalendar });
}
