import test from 'node:test';
import assert from 'node:assert/strict';
import { applyLessonOrder, createLessonOrderService } from '../src/features/lessons/lesson-order-service.js';

function createMockDb({ data = [], selectError = null, deleteError = null, insertError = null } = {}) {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push({ op: 'from', table });
      return {
        select(columns) {
          calls.push({ op: 'select', columns });
          return {
            eq(column, value) {
              calls.push({ op: 'eq', column, value });
              return {
                order(columnName, options) {
                  calls.push({ op: 'order', column: columnName, options });
                  return Promise.resolve({ data, error: selectError });
                }
              };
            }
          };
        },
        delete() {
          calls.push({ op: 'delete' });
          return {
            eq(column, value) {
              calls.push({ op: 'eq-delete', column, value });
              return Promise.resolve({ error: deleteError });
            }
          };
        },
        insert(rows) {
          calls.push({ op: 'insert', rows });
          return Promise.resolve({ error: insertError });
        }
      };
    }
  };
}

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    values
  };
}

test('applyLessonOrder preserves saved rank and puts unknown lessons last by id', () => {
  const list = [{ id: 7 }, { id: 3 }, { id: 11 }, { id: 5 }];
  assert.deepEqual(applyLessonOrder(list, [11, 5]), [{ id: 11 }, { id: 5 }, { id: 3 }, { id: 7 }]);
});

test('lesson-order service prefers remote order when rows exist', async () => {
  const db = createMockDb({ data: [{ lesson_id: 9, position: 0 }, { lesson_id: 4, position: 1 }] });
  const storage = createStorage({ 'pacogo-lesson-order-Zyon-Nederlands': '[2,3]' });
  const service = createLessonOrderService({ db, storage });

  const order = await service.readOrder('Zyon', 'Nederlands');

  assert.deepEqual(order, [9, 4]);
  assert.equal(storage.values.get('pacogo-lesson-order-Zyon-Nederlands'), '[2,3]');
  assert.deepEqual(db.calls.slice(0, 5), [
    { op: 'from', table: 'lesson_order' },
    { op: 'select', columns: 'lesson_id,position' },
    { op: 'eq', column: 'student', value: 'Zyon' },
    { op: 'eq', column: 'subject', value: 'Nederlands' },
    { op: 'order', column: 'position', options: { ascending: true } }
  ]);
});

test('lesson-order service falls back to local order when remote has no rows', async () => {
  const db = createMockDb({ data: [] });
  const storage = createStorage({ 'pacogo-lesson-order-Zyon-Nederlands': '[8,2]' });
  const service = createLessonOrderService({ db, storage });

  assert.deepEqual(await service.readOrder('Zyon', 'Nederlands'), [8, 2]);
});

test('lesson-order service writes local order before remote persistence', async () => {
  const db = createMockDb();
  const storage = createStorage();
  const service = createLessonOrderService({ db, storage });

  await service.writeOrder('Zyon', 'Nederlands', [{ id: 8 }, { id: 2 }]);

  assert.equal(storage.values.get('pacogo-lesson-order-Zyon-Nederlands'), '[8,2]');
  assert.deepEqual(db.calls, [
    { op: 'from', table: 'lesson_order' },
    { op: 'delete' },
    { op: 'eq-delete', column: 'student', value: 'Zyon' },
    { op: 'from', table: 'lesson_order' },
    { op: 'insert', rows: [
      { student: 'Zyon', subject: 'Nederlands', lesson_id: 8, position: 0 },
      { student: 'Zyon', subject: 'Nederlands', lesson_id: 2, position: 1 }
    ] }
  ]);
});

test('lesson-order service skips remote persistence when explicitly disabled', async () => {
  const db = createMockDb();
  const storage = createStorage();
  const service = createLessonOrderService({ db, storage });

  await service.writeOrder('Zyon', 'Nederlands', [{ id: 8 }], { persistRemote: false });

  assert.equal(storage.values.get('pacogo-lesson-order-Zyon-Nederlands'), '[8]');
  assert.deepEqual(db.calls, []);
});

test('lesson-order service propagates remote delete errors', async () => {
  const error = new Error('delete failed');
  const db = createMockDb({ deleteError: error });
  const storage = createStorage();
  const service = createLessonOrderService({ db, storage });

  await assert.rejects(() => service.writeOrder('Zyon', 'Nederlands', [{ id: 8 }]), error);
});
