import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonService } from '../src/services/lesson-service.js';

function mockDb({ rows = [], error = null } = {}) {
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
                      return Promise.resolve({ data: rows[0] ?? null, error });
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
              return Promise.resolve({ data: insertRows, error: null });
            }
          };
        }
      };
    },
    calls
  };
  return result;
}

test('lesson service preserves item ordering', async () => {
  const db = mockDb({ rows: [{ id: 4, lesson_items: [{ id: 2, sort_order: 2 }, { id: 1, sort_order: 1 }] }] });
  const service = createLessonService(db);
  const result = await service.listAll();
  assert.deepEqual(result[0].lesson_items.map(item => item.id), [1, 2]);
  assert.deepEqual(db.calls[1], { op: 'select', columns: '*, lesson_items(*)' });
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
