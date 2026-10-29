import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonService } from './lesson-service.js';

function createDbStub() {
  const calls = [];
  const chain = (result) => ({
    select: () => ({ single: async () => result }),
    order: async () => result,
    eq: () => ({ select: () => ({ single: async () => result }), delete: async () => result }),
    insert: async () => result,
    update: () => ({ eq: () => ({ select: () => ({ single: async () => result }) }) }),
    delete: () => ({ eq: () => ({ select: async () => result }) })
  });
  return {
    calls,
    from(table) {
      calls.push(table);
      return chain({ data: [{ id: 1 }], error: null });
    }
  };
}

test('lesson service does not require or create learning topics', async () => {
  const db = createDbStub();
  const lessons = createLessonService(db);

  const created = await lessons.createLesson({
    student: 'Testleerling',
    subject: 'Rekenen',
    subvak: 'Breuken',
    title: 'Les 1',
    type: 'practice'
  });

  assert.equal(created.id, 1);
  assert.deepEqual(db.calls, ['lessons']);
});
