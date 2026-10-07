import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgendaImportRuntime } from '../src/features/agenda/import-runtime.js';

function storage(seed = {}) {
  const data = new Map(Object.entries(seed).map(([key, value]) => [key, JSON.stringify(value)]));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)) };
}

function documentStub() {
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, { value: '', checked: false, classList: { toggle() {}, add() {}, remove() {} }, classListToggle() {} });
    return elements.get(id);
  };
  return {
    getElementById: get,
    querySelector: selector => selector === 'input[name="agendaManualRange"]:checked' ? { value: 'single' } : null,
    querySelectorAll: () => [],
    get elements() { return elements; }
  };
}

const db = { functions: { invoke: async () => ({ data: { status: 'none', events: [] }, error: null }) } };

test('professional Agenda import runtime adds a manual item', () => {
  const s = storage();
  const doc = documentStub();
  const runtime = createAgendaImportRuntime({ storage: s, documentRef: doc, db, currentStudent: () => 'Zyon', now: () => new Date('2026-10-07T10:00:00') });
  doc.getElementById('agendaManualTitle').value = 'Topografie';
  doc.getElementById('agendaManualDate').value = '2026-10-09';
  doc.getElementById('agendaManualType').value = 'test';
  doc.getElementById('agendaManualMeta').value = 'Hoofdstuk 4';
  const result = runtime.addManualItem();
  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(s.getItem('pacogo_agenda_items'))[0], {
    id: JSON.parse(s.getItem('pacogo_agenda_items'))[0].id,
    student: 'Zyon', date: '2026-10-09', type: 'test', title: 'Topografie', meta: 'Hoofdstuk 4', source: 'handmatig', createdAt: '2026-10-07T10:00:00.000Z'
  });
});

test('professional Agenda import runtime commits reviewed items without duplicates', () => {
  const s = storage({ pacogo_agenda_items: [{ id: 'existing', student: 'Zyon', date: '2026-10-09', title: 'Topografie', type: 'test', meta: '' }] });
  const doc = documentStub();
  const runtime = createAgendaImportRuntime({ storage: s, documentRef: doc, db, currentStudent: () => 'Zyon', lessonMatchHtml: () => '' });
  runtime.renderReview([
    { date: '2026-10-09', title: 'Topografie', type: 'test', meta: '' },
    { date: '2026-10-10', title: 'Geschiedenis', type: 'homework', meta: '' }
  ]);
  doc.getElementById('agendaReviewDate0').value = '2026-10-09';
  doc.getElementById('agendaReviewTitle0').value = 'Topografie';
  doc.getElementById('agendaReviewType0').value = 'test';
  doc.getElementById('agendaReviewDate1').value = '2026-10-10';
  doc.getElementById('agendaReviewTitle1').value = 'Geschiedenis';
  doc.getElementById('agendaReviewType1').value = 'homework';
  const result = runtime.saveReview();
  assert.deepEqual(result, { ok: true, count: 1 });
  assert.equal(JSON.parse(s.getItem('pacogo_agenda_items')).length, 2);
});
