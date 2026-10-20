import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonService } from '../src/services/lesson-service.js';

const learningTopics = { async ensureTopic(payload) { return { id: 99, ...payload }; } };

function mockDb(rows = []) {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push({ op: 'from', table });
      return {
        insert(payload) {
          calls.push({ op: 'insert', payload });
          return { select() { return { single() { return Promise.resolve({ data: rows[0] ?? { id: 17, ...payload }, error: null }); } }; } };
        },
        update(payload) {
          calls.push({ op: 'update', payload });
          return { eq(column, value) {
            calls.push({ op: 'eq', column, value });
            return { select() { return { single() { return Promise.resolve({ data: rows[0] ?? { id: 17, ...payload }, error: null }); } }; } };
          } };
        }
      };
    }
  };
}

test('lesson service persists subvak through the canonical topic owner on create and update', async () => {
  const db = mockDb();
  const service = createLessonService(db, { learningTopics });

  await service.createLesson({ student: 'Zyon', subject: 'Nederlands', subvak: 'Themawoorden', title: 'Week 4', type: 'words' });
  await service.updateLesson(17, { student: 'Zyon', subject: 'Nederlands', subvak: 'Werkwoorden', title: 'Week 5', type: 'words' });

  const inserts = db.calls.filter(call => call.op === 'insert');
  const updates = db.calls.filter(call => call.op === 'update');
  assert.equal(inserts[0].payload.subvak, 'Themawoorden');
  assert.equal(updates[0].payload.subvak, 'Werkwoorden');
  assert.equal(inserts[0].payload.learning_topic_id, 99);
  assert.equal(updates[0].payload.learning_topic_id, 99);
});
