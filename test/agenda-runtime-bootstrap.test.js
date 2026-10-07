import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapAgendaRuntime } from '../src/features/agenda/runtime-bootstrap.js';

function storage() { return { getItem: () => null, setItem: () => {} }; }

test('agenda runtime bootstrap installs the application-facing runtime', () => {
  const target = {};
  const entry = bootstrapAgendaRuntime({
    storage: storage(),
    currentStudent: () => 'Zyon',
    lessons: () => [],
    demoItems: () => [],
    documentRef: { getElementById: () => null, querySelectorAll: () => [] }
  }, target);
  assert.equal(target.pacoGOAgendaRuntime, entry);
  assert.equal(typeof target.showAgenda, 'function');
  assert.equal(typeof target.agendaMoveWeek, 'function');
});

test('agenda runtime bootstrap rejects an incomplete application host', () => {
  assert.throws(() => bootstrapAgendaRuntime({ storage: storage() }, {}), /currentStudent/);
});
