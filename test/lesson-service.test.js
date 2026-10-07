import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonService } from '../src/services/lesson-service.js';

function mockDb({ rows = [], error = null, insertError = null, updateError = null } = {}) {
  const calls = [];
  const result = {
    from(table) {
      calls.push({ op: 'from', table });
      return {
        select(columns) {
          calls.push({ op: 'select', columns });
          return {
            order(column, options) {
              calls.push({ op: 'order', column, options });
              return Promise.resolve({ data: rows, error });
            },
            single() {
              return Promise.resolve({ data: rows[0] ?? null, error });
            }
          };
        },
        update(payload) {
          calls.push({ op: 'update', payload });
          return {
            eq(column, value) {
              calls.push({ op: 'eq', column, value });
              return {
                select(columns = '*') {
                  calls.push({ op: 'select-after-update', columns });
                  return {
                    single() {
                      return Promise.resolve({ data: rows[0] ?? null, error: updateError });
                    }
                  };
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
              return Promise.resolve({ error: null });
            }
          };
        },
        insert(insertRows) {
          calls.push({ op: 'insert', rows: insertRows });
          return {
            select() {
              const selectedRow = Array.isArray(insertRows) ? (insertRows[0] ?? null) : insertRows;
              const selected = Promise.resolve({ data: Array.isArray(insertRows) ? insertRows : [insertRows], error: insertError });
              selected.single = () => Promise.resolve({ data: selectedRow, error: insertError });
              return selected;
            }
          };
        }
      };
    },
    calls
  };
  return result;
}

test('lesson service preserves V4.78 item ordering and query shape', async () => {
  const db = mockDb({ rows: [{ id: 4, lesson_items: [{ id: 2, sort_order: 2 }, { id: 1, sort_order: 1 }] }] });
  const service = createLessonService(db);
  const result = await service.listAll();
  assert.deepEqual(result[0].lesson_items.map(item => item.id), [1, 2]);
  assert.deepEqual(db.calls[1], { op: 'select', columns: '*, lesson_items(*)' });
  assert.deepEqual(db.calls[2], { op: 'order', column: 'id', options: { ascending: true } });
});

test('lesson service creates a lesson through insert-select-single', async () => {
  const payload = { title: 'Nieuwe les', student: 'Zyon', type: 'words' };
  const db = mockDb({ rows: [{ id: 17, ...payload }] });
  const service = createLessonService(db);

  const result = await service.createLesson(payload);

  assert.deepEqual(result, { id: 17, ...payload });
  assert.deepEqual(db.calls, [
    { op: 'from', table: 'lessons' },
    { op: 'insert', rows: payload }
  ]);
});

test('lesson service propagates create errors', async () => {
  const error = new Error('create failed');
  const db = mockDb({ insertError: error });
  const service = createLessonService(db);

  await assert.rejects(
    () => service.createLesson({ title: 'Nieuwe les' }),
    error
  );
});

test('lesson service updates a lesson through update-filter-select-single', async () => {
  const payload = { title: 'Aangepaste les', archived: false };
  const db = mockDb({ rows: [{ id: 17, ...payload }] });
  const service = createLessonService(db);

  const result = await service.updateLesson(17, payload);

  assert.deepEqual(result, { id: 17, ...payload });
  assert.deepEqual(db.calls, [
    { op: 'from', table: 'lessons' },
    { op: 'update', payload },
    { op: 'eq', column: 'id', value: 17 },
    { op: 'select-after-update', columns: '*' }
  ]);
});

test('lesson service propagates update errors', async () => {
  const error = new Error('update failed');
  const db = mockDb({ updateError: error });
  const service = createLessonService(db);

  await assert.rejects(
    () => service.updateLesson(17, { title: 'Aangepaste les' }),
    error
  );
});

test('lesson service exposes archive, trash and restore operations', async () => {
  const db = mockDb({ rows: [{ id: 7 }] });
  const service = createLessonService(db);
  await service.archive(7);
  await service.moveToTrash(7);
  await service.restore(7);
  const updates = db.calls.filter(call => call.op === 'update').map(call => call.payload);
  assert.deepEqual(updates, [
    { archived: true },
    { deleted: true, archived: false },
    { archived: false, deleted: false }
  ]);
});

test('lesson service replaces lesson items with normalized defaults', async () => {
  const db = mockDb();
  const service = createLessonService(db);
  await service.replaceLessonItems(12, [{ prompt: 'woord', min_words: '', required_terms: null }]);
  const inserted = db.calls.find(call => call.op === 'insert').rows;
  assert.deepEqual(inserted, [{
    prompt: 'woord',
    min_words: 0,
    required_terms: [],
    lesson_id: 12,
    hint: ''
  }]);
});
