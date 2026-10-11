import test from 'node:test';
import assert from 'node:assert/strict';
import { appState } from '../src/core/state.js';
import { createManagement } from '../src/features/management/management.js';

function makeService() {
  const lessons = [
    { id: 1, student: 'Zyon', title: 'Actief', archived: false, deleted: false },
    { id: 2, student: 'Zyon', title: 'Archief', archived: true, deleted: false },
    { id: 3, student: 'Zenith', title: 'Andere student', archived: false, deleted: false }
  ];

  return {
    calls: [],
    async listAll() { return lessons.map(item => ({ ...item })); },
    async createLesson(payload) { this.calls.push(['create', payload]); return { id: 4, ...payload }; },
    async updateLesson(id, payload) { this.calls.push(['update', id, payload]); return { id, ...payload }; },
    async archive(id) { this.calls.push(['archive', id]); },
    async moveToTrash(id) { this.calls.push(['trash', id]); },
    async restore(id) { this.calls.push(['restore', id]); }
  };
}

test('management owns student selection and scoped lesson operations', async () => {
  appState.currentStudent = null;
  appState.lessons = [];

  const service = makeService();
  const management = createManagement({ auth: { isParent: true }, lessonService: service });

  management.selectStudent('Zyon');
  assert.equal(management.getSelectedStudent(), 'Zyon');

  const active = await management.loadLessons();
  assert.deepEqual(active.map(item => item.id), [1]);
  assert.deepEqual(management.getAllScopedLessons().map(item => item.id), [1, 2]);

  await management.createLesson({ title: 'Nieuw' });
  await management.updateLesson(1, { title: 'Bijgewerkt' });
  await management.archiveLesson(1);
  assert.deepEqual(service.calls, [
    ['create', { title: 'Nieuw', student: 'Zyon' }],
    ['update', 1, { title: 'Bijgewerkt', student: 'Zyon' }],
    ['archive', 1]
  ]);
});

test('management rejects mutations outside the selected student scope', async () => {
  appState.currentStudent = null;
  appState.lessons = [];

  const service = makeService();
  const management = createManagement({ auth: { isParent: true }, lessonService: service });
  management.selectStudent('Zyon');
  await management.loadLessons();

  await assert.rejects(() => management.updateLesson(3, { title: 'Niet toegestaan' }), /outside the selected student scope/);
  await assert.rejects(() => management.archiveLesson(3), /outside the selected student scope/);
  assert.deepEqual(service.calls, []);
});

test('management exposes the boundary without authorizing a non-parent session', async () => {
  const service = makeService();
  const management = createManagement({ auth: { isParent: false }, lessonService: service });

  assert.throws(() => management.selectStudent('Zyon'), /parent session/);
  await assert.rejects(() => management.loadLessons(), /parent session/);
  assert.deepEqual(service.calls, []);
});
