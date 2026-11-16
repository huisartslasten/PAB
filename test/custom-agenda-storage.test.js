import test from 'node:test';
import assert from 'node:assert/strict';
import { createCustomAgendaStorage } from '../src/features/agenda/custom-storage.js';

function fakeStorage(initial = null) {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next; }
  };
}

test('custom agenda uses the existing pacogo_agenda_items key', () => {
  const storage = fakeStorage(JSON.stringify([
    { id: 1, student: 'Zyon', title: 'Toets' },
    { id: 2, student: 'Mila', title: 'Sport' }
  ]));
  const agenda = createCustomAgendaStorage(storage);
  assert.equal(agenda.key, 'pacogo_agenda_items');
  assert.deepEqual(agenda.getItems('Zyon'), [{ id: 1, student: 'Zyon', title: 'Toets' }]);
});

test('saving custom agenda replaces only the selected student items', () => {
  const storage = fakeStorage(JSON.stringify([
    { id: 1, student: 'Zyon', title: 'Oud' },
    { id: 2, student: 'Mila', title: 'Behouden' }
  ]));
  const agenda = createCustomAgendaStorage(storage);
  agenda.saveItems([{ id: 3, student: 'Zyon', title: 'Nieuw' }], 'Zyon');
  assert.deepEqual(agenda.getItems('Zyon'), [{ id: 3, student: 'Zyon', title: 'Nieuw' }]);
  assert.deepEqual(agenda.getItems('Mila'), [{ id: 2, student: 'Mila', title: 'Behouden' }]);
});

test('invalid stored agenda data behaves as an empty list', () => {
  const storage = fakeStorage('not-json');
  const agenda = createCustomAgendaStorage(storage);
  assert.deepEqual(agenda.getItems('Zyon'), []);
});
