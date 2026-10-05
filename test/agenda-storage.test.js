import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgendaStorage } from '../src/features/agenda/storage.js';

test('agenda storage requires an explicitly verified key', () => {
  assert.throws(() => createAgendaStorage({ storage: new Map() }), /verified storage key/);
});

test('agenda storage isolates items by student', () => {
  const data = new Map();
  const storage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value)
  };
  const agenda = createAgendaStorage({ storage, key: 'verified-key' });
  agenda.saveItems([{ id: 1 }], 'Zyon');
  agenda.saveItems([{ id: 2 }], 'Mila');
  assert.deepEqual(agenda.getItems('Zyon'), [{ id: 1 }]);
  assert.deepEqual(agenda.getItems('Mila'), [{ id: 2 }]);
});
