import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgendaRuntimeEntry } from '../src/features/agenda/runtime-entry.js';

function storage(seed = {}) {
  const data = new Map(Object.entries(seed).map(([key, value]) => [key, JSON.stringify(value)]));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)) };
}

function documentStub() {
  const elements = new Map();
  return {
    getElementById(id) {
      if (id === 'agendaContent') return null;
      if (!elements.has(id)) elements.set(id, { value: '', classList: { toggle() {}, add() {}, remove() {} } });
      return elements.get(id);
    },
    querySelectorAll() { return []; },
    querySelector() { return null; }
  };
}

test('runtime entry owns custom agenda edit/delete actions', () => {
  const s = storage({ pacogo_agenda_items: [{ id: 'a', student: 'Zyon', date: '2026-10-09', title: 'Oud', type: 'homework', meta: '' }] });
  const doc = documentStub();
  const target = { getElementById() { return null; }, querySelectorAll() { return []; } };
  const entry = createAgendaRuntimeEntry({ storage: s, documentRef: doc, currentStudent: () => 'Zyon', lessons: () => [], demoItems: () => [] });
  assert.equal(typeof entry.editAgendaItem, 'function');
  assert.equal(typeof entry.deleteAgendaItem, 'function');
  assert.equal(entry.editAgendaItem('a'), true);
  doc.getElementById('agendaEditTitle').value = 'Nieuw';
  doc.getElementById('agendaEditDate').value = '2026-10-10';
  doc.getElementById('agendaEditType').value = 'test';
  assert.equal(entry.saveAgendaEditModal(), true);
  assert.equal(JSON.parse(s.getItem('pacogo_agenda_items'))[0].title, 'Nieuw');
  assert.equal(JSON.parse(s.getItem('pacogo_agenda_items'))[0].date, '2026-10-10');
  globalThis.confirm = () => true;
  assert.equal(entry.deleteAgendaItem('a'), true);
  assert.deepEqual(JSON.parse(s.getItem('pacogo_agenda_items')), []);
  delete globalThis.confirm;
  void target;
});
