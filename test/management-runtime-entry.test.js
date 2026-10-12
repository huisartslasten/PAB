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

test('management runtime entry exposes feedback through the management boundary', async () => {
  const { db, calls } = createFeedbackDb();
  const target = {};
  const runtime = installManagementRuntimeEntry({
    db,
    isParent: () => true,
    loadLessons: async () => {}
  }, target);

  assert.equal(typeof runtime.listFeedback, 'function');
  assert.equal(target.pacoGOManagementListFeedback, runtime.listFeedback);
  assert.deepEqual(await runtime.listFeedback(), [{ id: 1, feedback_type: 'idea' }]);
  assert.deepEqual(calls, [
    ['select', 'parent_feedback', 'id,feedback_type,subject,message,status,created_at'],
    ['order', 'parent_feedback', 'created_at', { ascending: false }]
  ]);
});

test('management runtime entry enforces parent authorization before feedback access', async () => {
  const { db, calls } = createFeedbackDb();
  const target = {};
  const runtime = installManagementRuntimeEntry({
    db,
    isParent: () => false,
    loadLessons: async () => {}
  }, target);

  await assert.rejects(() => runtime.listFeedback(), /parent session/);
  assert.deepEqual(calls, []);
});

test('management runtime entry rejects missing bridge contracts', () => {
  assert.throws(
    () => installManagementRuntimeEntry({ db: {}, isParent: true, loadLessons: async () => {} }, {}),
    /isParent function/
  );
});
