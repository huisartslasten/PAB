import test from 'node:test';
import assert from 'node:assert/strict';
import {
  executeMoveCurrentLessonToTrash,
  executeArchiveCurrentLesson,
  executeRestoreArchivedLesson,
  executeRestoreDeletedLesson,
  installLessonRecoveryRuntimeEntry
} from '../src/features/lessons/lesson-recovery-runtime-entry.js';

function makeDb(log) {
  return {
    from(table) {
      log.push(['from', table]);
      return {
        update(patch) {
          log.push(['update', patch]);
          return {
            eq(column, value) {
              log.push(['eq', column, value]);
              return Promise.resolve({ error: null });
            }
          };
        }
      };
    }
  };
}

function makeRuntime(overrides = {}) {
  const log = [];
  const runtime = {
    requireParent: async () => { log.push('authorize'); return true; },
    currentLesson: { id: 42, title: 'Rekenen' },
    currentSubject: 'Rekenen',
    currentStudent: 'Zyon',
    parentSelectedStudent: 'Zyon',
    closeDeleteModal: () => log.push('close-delete'),
    closeArchiveModal: () => log.push('close-archive'),
    loadLessons: async () => log.push('load-lessons'),
    showSubject: async subject => log.push(['show-subject', subject]),
    showParentDashboard: async () => log.push('show-parent-dashboard'),
    renderParentDashboard: async () => log.push('render-parent-dashboard'),
    showMessage: (text, type) => log.push(['message', text, type]),
    db: makeDb(log),
    ...overrides
  };
  return { runtime, log };
}

test('trash runtime entry preserves V4.78 application order and state', async () => {
  const { runtime, log } = makeRuntime();
  const result = await executeMoveCurrentLessonToTrash(runtime);
  assert.equal(result.ok, true);
  assert.deepEqual(log, [
    'authorize', 'close-delete', ['from', 'lessons'], ['update', { deleted: true, archived: false }],
    ['eq', 'id', 42], 'load-lessons', ['show-subject', 'Rekenen'],
    ['message', 'Les naar de prullenbak verplaatst.', 'success']
  ]);
  assert.equal(runtime.currentLesson, null);
  assert.equal(runtime.currentSubject, 'Rekenen');
});

test('archive runtime entry preserves V4.78 application order and state', async () => {
  const { runtime, log } = makeRuntime();
  const result = await executeArchiveCurrentLesson(runtime);
  assert.equal(result.ok, true);
  assert.deepEqual(log, [
    'authorize', 'close-archive', ['from', 'lessons'], ['update', { archived: true }],
    ['eq', 'id', 42], 'load-lessons', 'show-parent-dashboard',
    ['message', 'Les gearchiveerd.', 'success']
  ]);
  assert.equal(runtime.currentLesson, null);
  assert.equal(runtime.currentSubject, 'Rekenen');
});

test('archived restore entry preserves Number(id), reload, student and dashboard order', async () => {
  const { runtime, log } = makeRuntime({ currentStudent: 'Oud' });
  const result = await executeRestoreArchivedLesson(runtime, '42');
  assert.equal(result.ok, true);
  assert.deepEqual(log, [
    'authorize', ['from', 'lessons'], ['update', { deleted: false, archived: false }],
    ['eq', 'id', 42], 'load-lessons', 'render-parent-dashboard',
    ['message', 'Les teruggezet.', 'success']
  ]);
  assert.equal(runtime.currentStudent, 'Zyon');
});

test('deleted restore entry preserves Number(id), reload and success message', async () => {
  const { runtime, log } = makeRuntime();
  const result = await executeRestoreDeletedLesson(runtime, '42');
  assert.equal(result.ok, true);
  assert.deepEqual(log, [
    'authorize', ['from', 'lessons'], ['update', { deleted: false, archived: false }],
    ['eq', 'id', 42], 'load-lessons',
    ['message', 'Les uit de prullenbak hersteld.', 'success']
  ]);
});

test('runtime entry hard-stops unauthorized recovery before persistence', async () => {
  const { runtime, log } = makeRuntime({ requireParent: async () => { log.push('authorize'); return false; } });
  const result = await executeRestoreDeletedLesson(runtime, '42');
  assert.equal(result.ok, false);
  assert.equal(result.stage, 'authorization');
  assert.deepEqual(log, ['authorize']);
});

test('runtime entry installs the four legacy global handlers', () => {
  const { runtime } = makeRuntime();
  const target = {};
  const installed = installLessonRecoveryRuntimeEntry(runtime, target);
  assert.equal(typeof target.confirmDeleteLesson, 'function');
  assert.equal(typeof target.confirmArchiveLesson, 'function');
  assert.equal(typeof target.restoreArchivedLesson, 'function');
  assert.equal(typeof target.restoreDeletedLesson, 'function');
  assert.deepEqual(Object.keys(installed), [
    'confirmDeleteLesson', 'confirmArchiveLesson', 'restoreArchivedLesson', 'restoreDeletedLesson'
  ]);
});

test('runtime entry rejects an incomplete bridge', () => {
  assert.throws(
    () => installLessonRecoveryRuntimeEntry({}, {}),
    /lesson recovery runtime bridge is missing/
  );
});
