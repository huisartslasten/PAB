import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonOrderService } from '../src/services/lesson-order-service.js';

function createMockDb(data = []) {
  return {
    from() {
      return {
        select() {
          const builder = {
            eq() { return builder; },
            order() { return Promise.resolve({ data, error: null }); }
          };
          return builder;
        }
      };
    }
  };
}

function createStorage() {
  const values = new Map();
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
}

test('canonical lesson-order service applies persisted subject order', async () => {
  const service = createLessonOrderService({
    db: createMockDb([
      { lesson_id: 8, position: 0 },
      { lesson_id: 2, position: 1 }
    ]),
    storage: createStorage()
  });

  const lessons = [
    { id: 2, title: 'Tweede' },
    { id: 8, title: 'Eerste' },
    { id: 5, title: 'Nieuw' }
  ];

  assert.deepEqual(await service.getOrderedLessons(lessons, 'Zyon', 'Nederlands'), [
    { id: 8, title: 'Eerste' },
    { id: 2, title: 'Tweede' },
    { id: 5, title: 'Nieuw' }
  ]);
});