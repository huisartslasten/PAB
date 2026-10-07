import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgendaRuntimeEntry } from '../src/features/agenda/runtime-entry.js';

function storage(seed = {}) {
  const data = new Map(Object.entries(seed).map(([key, value]) => [key, JSON.stringify(value)]));
  return {
    getItem: key => data.get(key) || null,
    setItem: (key, value) => data.set(key, String(value))
  };
}

function documentRef() {
  return { getElementById: () => null, querySelectorAll: () => [] };
}

test('agenda runtime entry exposes deterministic read and storage boundaries', () => {
  const store = storage({
    pacogo_agenda_items: [{ id: 'a', student: 'Zyon', date: '2026-10-09', title: 'Rekenen' }],
    pacogo_test_calendar: [{ id: 't', student: 'Zyon', lessonId: 4, date: '2026-10-08' }]
  });
  const entry = createAgendaRuntimeEntry({
    storage: store,
    documentRef: documentRef(),
    currentStudent: () => 'Zyon',
    lessons: () => [{ id: 4, student: 'Zyon', subject: 'Nederlands', title: 'Themawoorden', archived: false }],
    demoItems: () => []
  });

  assert.deepEqual(entry.buildAgendaItemsForRender().map(item => item.id), ['test_t', 'a']);
  assert.equal(entry.getCustomAgendaItems()[0].title, 'Rekenen');
  entry.saveCustomAgendaItems([{ id: 'b', student: 'Zyon', date: '2026-10-10', title: 'Lezen' }], 'Zyon');
  assert.equal(entry.getCustomAgendaItems('Zyon')[0].id, 'b');
  entry.saveTestCalendar([{ id: 't2', student: 'Zyon', lessonId: 4, date: '2026-10-11' }]);
  assert.equal(entry.getTestCalendar()[0].id, 't2');
});

test('agenda runtime entry installs only the application-facing agenda surface', () => {
  const target = {};
  const entry = createAgendaRuntimeEntry({
    storage: storage(),
    documentRef: documentRef(),
    currentStudent: () => 'Zyon',
    lessons: () => [],
    demoItems: () => []
  });
  target.showAgenda = entry.showAgenda;
  target.renderAgenda = entry.renderAgenda;
  assert.equal(typeof target.showAgenda, 'function');
  assert.equal(typeof target.renderAgenda, 'function');
});
