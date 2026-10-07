import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgendaCustomActions } from '../src/features/agenda/custom-actions.js';

function storage(seed = {}) {
  const data = new Map(Object.entries(seed).map(([key, value]) => [key, JSON.stringify(value)]));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)) };
}

function documentStub() {
  const elements = new Map();
  return {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, { value: '', classList: { toggle() {}, add() {}, remove() {} } });
      return elements.get(id);
    }
  };
}

function setValues(doc, values) {
  for (const [id, value] of Object.entries(values)) doc.getElementById(id).value = value;
}

test('professional custom actions edit and delete a single agenda item', () => {
  const s = storage({ pacogo_agenda_items: [{ id: 'a', student: 'Zyon', date: '2026-10-09', type: 'homework', title: 'Oud', meta: '' }] });
  const doc = documentStub();
  let changed = 0;
  const actions = createAgendaCustomActions({ storage: s, documentRef: doc, currentStudent: () => 'Zyon', onChanged: () => { changed += 1; } });
  assert.equal(actions.editAgendaItem('a'), true);
  setValues(doc, { agendaEditTitle: 'Nieuw', agendaEditDate: '2026-10-10', agendaEditType: 'test', agendaEditMeta: 'Meta', agendaEditTime: '09:00' });
  assert.equal(actions.saveAgendaEditModal(), true);
  const saved = JSON.parse(s.getItem('pacogo_agenda_items'));
  assert.deepEqual(saved[0], { id: 'a', student: 'Zyon', date: '2026-10-10', type: 'test', title: 'Nieuw', meta: 'Meta', time: '09:00' });
  assert.equal(changed, 1);
  globalThis.confirm = () => true;
  assert.equal(actions.deleteAgendaItem('a'), true);
  assert.deepEqual(JSON.parse(s.getItem('pacogo_agenda_items')), []);
  assert.equal(changed, 2);
  delete globalThis.confirm;
});

test('professional custom actions preserve period semantics', () => {
  const s = storage({ pacogo_agenda_items: [
    { id: 'p_2026-10-09', student: 'Zyon', date: '2026-10-09', type: 'activity', title: 'Oud', meta: '', periodId: 'p', periodStart: '2026-10-09', periodEnd: '2026-10-10' },
    { id: 'p_2026-10-10', student: 'Zyon', date: '2026-10-10', type: 'activity', title: 'Oud', meta: '', periodId: 'p', periodStart: '2026-10-09', periodEnd: '2026-10-10' }
  ] });
  const doc = documentStub();
  const actions = createAgendaCustomActions({ storage: s, documentRef: doc, currentStudent: () => 'Zyon' });
  assert.equal(actions.editAgendaItem('p_2026-10-09'), true);
  setValues(doc, { agendaEditTitle: 'Nieuw', agendaEditStartDate: '2026-10-11', agendaEditEndDate: '2026-10-13', agendaEditType: 'test', agendaEditMeta: '', agendaEditTime: '' });
  assert.equal(actions.saveAgendaEditModal(), true);
  const saved = JSON.parse(s.getItem('pacogo_agenda_items'));
  assert.deepEqual(saved.map(item => item.date), ['2026-10-11', '2026-10-12', '2026-10-13']);
  assert.ok(saved.every(item => item.periodId === 'p' && item.title === 'Nieuw'));
});
