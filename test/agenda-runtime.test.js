import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgendaRuntime } from '../src/features/agenda/runtime.js';

function storage(seed = {}) {
  const data = new Map(Object.entries(seed).map(([key, value]) => [key, JSON.stringify(value)]));
  return { getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, String(value)) };
}

function documentFixture() {
  const listeners = [];
  const agendaContent = {
    innerHTML: '',
    querySelectorAll(selector) {
      if (selector === '[data-agenda-week]') return listeners.filter(x => x.type === 'week').map(x => x.node);
      if (selector === '[data-agenda-today]') return [];
      if (selector === '.agenda-edit') return [];
      if (selector === '.agenda-delete') return [];
      return [];
    },
    querySelector() { return null; }
  };
  return {
    listeners,
    getElementById(id) {
      if (id === 'agendaContent') return agendaContent;
      return null;
    },
    querySelectorAll() { return []; }
  };
}

test('agenda runtime renders the V4.78 school-week structure from the read service', () => {
  const documentRef = documentFixture();
  const runtime = createAgendaRuntime({
    storage: storage({
      pacogo_agenda_items: [{ id: 'agenda_1', student: 'Zyon', date: '2026-10-09', type: 'homework', title: 'Rekenen', meta: 'Bladzijde 42' }]
    }),
    documentRef,
    currentStudent: () => 'Zyon',
    now: () => new Date('2026-10-07T10:00:00')
  });

  assert.equal(runtime.setWeek(new Date('2026-10-05T12:00:00')).getDay(), 1);
  const html = documentRef.getElementById('agendaContent').innerHTML;
  assert.match(html, /Deze schoolweek/);
  assert.match(html, /Rekenen/);
  assert.match(html, /Bladzijde 42/);
  assert.match(html, /Vorige week/);
  assert.match(html, /Volgende week/);
});

test('agenda runtime week navigation moves in exact seven-day increments', () => {
  const runtime = createAgendaRuntime({
    storage: storage(),
    documentRef: documentFixture(),
    currentStudent: () => 'Zyon',
    now: () => new Date('2026-10-07T10:00:00')
  });
  const first = runtime.setWeek(new Date('2026-10-05T12:00:00'));
  const next = runtime.moveWeek(1);
  const previous = runtime.moveWeek(-1);
  assert.equal(first.toISOString().slice(0, 10), '2026-10-05');
  assert.equal(next.toISOString().slice(0, 10), '2026-10-12');
  assert.equal(previous.toISOString().slice(0, 10), '2026-10-05');
});
