import test from 'node:test';
import assert from 'node:assert/strict';
import { installManagementRuntimeEntry } from '../src/features/management/management-runtime-entry.js';

function createFeedbackDb() {
  const calls = [];
  const db = {
    from(table) {
      const chain = {
        select(fields) {
          calls.push(['select', table, fields]);
          return chain;
        },
        order(field, options) {
          calls.push(['order', table, field, options]);
          return Promise.resolve({ data: [{ id: 1, feedback_type: 'idea' }], error: null });
        }
      };
      return chain;
    }
  };
  return { db, calls };
}

function createRuntime(overrides = {}) {
  const { db, calls } = createFeedbackDb();
  const target = {};
  const runtime = installManagementRuntimeEntry({
    db,
    isParent: () => true,
    loadLessons: async () => {},
    ...overrides
  }, target);
  return { db, calls, target, runtime };
}

test('management runtime entry exposes feedback through the management boundary', async () => {
  const { calls, target, runtime } = createRuntime();

  assert.equal(typeof runtime.listFeedback, 'function');
  assert.equal(target.pacoGOManagementListFeedback, runtime.listFeedback);
  assert.deepEqual(await runtime.listFeedback(), [{ id: 1, feedback_type: 'idea' }]);
  assert.deepEqual(calls, [
    ['select', 'parent_feedback', 'id,feedback_type,subject,message,status,created_at'],
    ['order', 'parent_feedback', 'created_at', { ascending: false }]
  ]);
});

test('management runtime entry exposes the management orchestration surface', async () => {
  const { target, runtime } = createRuntime();

  assert.equal(typeof runtime.getStudents, 'function');
  assert.equal(typeof runtime.selectStudent, 'function');
  assert.equal(typeof runtime.getSelectedStudent, 'function');
  assert.equal(typeof runtime.loadLessons, 'function');
  assert.equal(typeof runtime.getScopedLessons, 'function');
  assert.equal(typeof runtime.getAllScopedLessons, 'function');
  assert.equal(typeof runtime.getRecoveryLessons, 'function');
  assert.equal(typeof runtime.createLesson, 'function');
  assert.equal(typeof runtime.updateLesson, 'function');
  assert.equal(typeof runtime.archiveLesson, 'function');
  assert.equal(typeof runtime.moveToTrash, 'function');
  assert.equal(typeof runtime.restoreLesson, 'function');
  assert.equal(target.pacoGOManagementSelectStudent, runtime.selectStudent);

  assert.deepEqual(runtime.getStudents(), ['Zyon', 'Zenith', 'Zephon']);
  assert.equal(runtime.selectStudent('Zenith'), 'Zenith');
  assert.equal(runtime.getSelectedStudent(), 'Zenith');
});

test('management runtime entry enforces parent authorization before management access', async () => {
  const { calls, runtime } = createRuntime({ isParent: () => false });

  await assert.rejects(() => runtime.listFeedback(), /parent session/);
  assert.throws(() => runtime.getStudents(), /parent session/);
  assert.deepEqual(calls, []);
});

test('management runtime entry rejects missing bridge contracts', () => {
  assert.throws(
    () => installManagementRuntimeEntry({ db: {}, isParent: true, loadLessons: async () => {} }, {}),
    /isParent function/
  );
});
