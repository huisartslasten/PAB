import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonService } from './lesson-service.js';

function createLessonDb() {
  const calls = [];

  return {
    calls,
    from(table) {
      assert.equal(table, 'lessons');
      return {
        insert(payload) {
          calls.push({ operation: 'insert', payload });
          return {
            select() {
              return {
                async single() {
                  return { data: { id: 123, ...payload }, error: null };
                }
              };
            }
          };
        },
        update(payload) {
          calls.push({ operation: 'update', payload });
          return {
            eq() {
              return {
                select() {
                  return {
                    async single() {
                      return { data: { id: 123, ...payload }, error: null };
                    }
                  };
                }
              };
            }
          };
        }
      };
    }
  };
}

test('lesson persistence does not send item sort_order to the lessons table', async () => {
  const db = createLessonDb();
  const service = createLessonService(db);

  await service.createLesson({
    student: 'Test leerling',
    subject: 'Nederlands',
    title: 'Dictee',
    type: 'dictation',
    sort_order: 7
  });

  await service.updateLesson(123, {
    student: 'Test leerling',
    subject: 'Nederlands',
    title: 'Dictee',
    type: 'dictation',
    sort_order: 8
  });

  assert.equal(db.calls.length, 2);
  for (const call of db.calls) {
    assert.equal(call.payload.sort_order, undefined);
    assert.deepEqual(Object.keys(call.payload).sort(), [
      'archived',
      'deleted',
      'student',
      'subject',
      'subvak',
      'title',
      'type'
    ]);
  }
});
