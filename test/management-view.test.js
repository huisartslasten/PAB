import assert from 'node:assert/strict';
import test from 'node:test';
import { renderStudentSelection, renderStudentLessons } from '../src/features/management/management-view.js';

function createContainer() {
  const listeners = [];
  return {
    innerHTML: '',
    querySelectorAll() {
      return [
        { dataset: { student: 'Zyon' }, addEventListener: (event, handler) => listeners.push([event, handler]) }
      ];
    },
    listeners
  };
}

test('management view renders students from the management boundary', () => {
  const container = createContainer();
  const management = { getStudents: () => ['Zyon', 'Zenith'] };

  assert.deepEqual(renderStudentSelection(container, management), ['Zyon', 'Zenith']);
  assert.match(container.innerHTML, /Zyon/);
  assert.match(container.innerHTML, /Zenith/);
  assert.equal(container.listeners.length, 1);
});

test('management view renders only lessons supplied by management', () => {
  const container = createContainer();
  const management = {
    getScopedLessons: () => [
      { id: '1', title: 'Woorden', subject: 'Nederlands', subvak: 'Spelling' }
    ]
  };

  assert.equal(renderStudentLessons(container, management).length, 1);
  assert.match(container.innerHTML, /Woorden/);
  assert.match(container.innerHTML, /Nederlands · Spelling/);
});
