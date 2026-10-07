import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgendaRuntimeEntry } from '../src/features/agenda/runtime-entry.js';

function storage(seed = {}) {
  const data = new Map(Object.entries(seed).map(([key, value]) => [key, JSON.stringify(value)]));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)) };
}

function documentStub(values = {}) {
  const elements = new Map(Object.entries(values).map(([id, value]) => [id, { value, classList: { toggle() {}, add() {}, remove() {} } }]));
  return {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, { value: '', classList: { toggle() {}, add() {}, remove() {} } });
      return elements.get(id);
    },
    querySelectorAll() { return []; },
    querySelector() { return null; }
  };
}

test('runtime entry owns custom agenda edit/delete actions', () => {
  const s = storage({ pacogo_agenda_items: [{ id: 'a', student: 'Zyon', date: '2026-10-09', title: 'Oud', type: 'homework', meta: '' }] });
  const doc = documentStub({ agendaEditTitle: 'Nieuw', agendaEditDate: '2026-10-10', agendaEditType: 'test', agendaEditMeta: '', agendaEditTime: '' });
  const target = { getElementById() { return null; }, querySelectorAll() { return []; } };
  const entry = createAgendaRuntimeEntry({ storage: s, documentRef: doc, currentStudent: () => 'Zyon', lessons: () => [], demoItems: () => [] });
  assert.equal(typeof entry.editAgendaItem, 'function');
  assert.equal(typeof entry.deleteAgendaItem, 'function');
  assert.equal(entry.editAgendaItem('a'), true);
  assert.equal(entry.saveAgendaEditModal(), true);
  assert.equal(JSON.parse(s.getItem('pacogo_agenda_items'))[0].title, 'Nieuw');
  globalThis.confirm = () => true;
  assert.equal(entry.deleteAgendaItem('a'), true);
  assert.deepEqual(JSON.parse(s.getItem('pacogo_agenda_items')), []);
  delete globalThis.confirm;
  void target;
});
