import assert from 'node:assert/strict';
import test from 'node:test';
import { renderStudentSelection, renderStudentLessons, renderFeedback } from '../src/features/management/management-view.js';

function createContainer() {
  const listeners = [];
  return {
    innerHTML: '',
    addEventListener: (event, handler) => listeners.push([event, handler]),
    removeEventListener: () => {},
    querySelectorAll(selector) {
      if (selector === '[data-student]') {
        return [
          { dataset: { student: 'Zyon' }, addEventListener: (event, handler) => listeners.push([event, handler]) }
        ];
      }
      return [];
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

test('management view renders only lessons supplied by management', async () => {
  const container = createContainer();
  const management = {
    getOrderedScopedLessons: async () => [{
      subject: 'Nederlands',
      lessons: [{ id: '1', title: 'Woorden', subject: 'Nederlands', subvak: 'Spelling' }]
    }],
    getScopedLessons: () => [
      { id: '1', title: 'Woorden', subject: 'Nederlands', subvak: 'Spelling' }
    ]
  };

  assert.equal((await renderStudentLessons(container, management)).length, 1);
  assert.match(container.innerHTML, /Woorden/);
  assert.match(container.innerHTML, /Nederlands · Spelling/);
});

test('management view renders feedback supplied by management', async () => {
  const container = createContainer();
  const management = {
    async listFeedback() {
      return [{ id: 7, feedback_type: 'idea', subject: 'Meer oefenen', message: 'Graag extra breuken.', status: 'new' }];
    }
  };

  const feedback = await renderFeedback(container, management);
  assert.equal(feedback.length, 1);
  assert.match(container.innerHTML, /Meer oefenen/);
  assert.match(container.innerHTML, /Graag extra breuken\./);
  assert.match(container.innerHTML, /Idee \/ wens/);
});