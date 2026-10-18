import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonService } from '../src/services/lesson-service.js';

function mockDb(rows = []) {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push({ op: 'from', table });
      return {
        insert(payload) {
          calls.push({ op: 'insert', payload });
          return {
            select() {
              return {
                single() {
                  return Promise.resolve({ data: rows[0] ?? { id: 17, ...payload }, error: null });
                }
              };
            }
          };
        },
        update(payload) {
          calls.push({ op: 'update', payload });
          return {
            eq(column, value) {
              calls.push({ op: 'eq', column, value });
              return {
                select() {
                  return {
                    single() {
                      return Promise.resolve({ data: rows[0] ?? { id: 17, ...payload }, error: null });
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

test('lesson service persists subvak on create and update', async () => {
  const db = mockDb();
  const service = createLessonService(db);

  await service.createLesson({
    student: 'Zyon',
    subject: 'Nederlands',
    subvak: 'Themawoorden',
    title: 'Week 4',
    type: 'words'
  });

  await service.updateLesson(17, {
    student: 'Zyon',
    subject: 'Nederlands',
    subvak: 'Werkwoorden',
    title: 'Week 5',
    type: 'words'
  });

  assert.equal(db.calls[1].payload.subvak, 'Themawoorden');
  assert.equal(db.calls[3].payload.subvak, 'Werkwoorden');
});
