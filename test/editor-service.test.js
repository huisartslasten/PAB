import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorService } from '../src/features/lessons/editor-service.js';

function mockDb() {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push({ op: 'from', table });
      return {
        insert(rows) {
          calls.push({ op: 'insert', table, rows });
          return {
            select() {
              return {
                single() {
                  calls.push({ op: 'single-after-insert', table });
                  return Promise.resolve({ data: { id: 42 }, error: null });
                }
              };
            }
          };
        },
        update(payload) {
          calls.push({ op: 'update', table, payload });
          return {
            eq(column, value) {
              calls.push({ op: 'eq-update', table, column, value });
              return { select: () => ({ single: () => Promise.resolve({ data: { id: value }, error: null }) }) };
            }
          };
        },
        delete() {
          calls.push({ op: 'delete', table });
          return { eq: (column, value) => {
            calls.push({ op: 'eq-delete', table, column, value });
            return Promise.resolve({ error: null });
          } };
        }
      };
    }
  };
}

test('new editor save creates lesson, then replaces its items', async () => {
  const db = mockDb();
  const service = createEditorService(db);
  const result = await service.saveDraft({
    lesson: { student: 'Zyon', subject: 'Taal', title: 'Themawoorden', type: 'words' },
    items: [{ question: 'huis', answer: 'house' }]
  });

  assert.equal(result.lessonId, 42);
  assert.deepEqual(
    db.calls.filter(x => ['insert', 'delete'].includes(x.op)).map(x => `${x.op}:${x.table}`),
    ['insert:lessons', 'delete:lesson_items', 'insert:lesson_items']
  );
});

test('existing editor save updates lesson, then replaces its items', async () => {
  const db = mockDb();
  const service = createEditorService(db);
  const result = await service.saveDraft({
    lessonId: 7,
    lesson: { student: 'Zyon', subject: 'Taal', title: 'Bewerkt', type: 'words' },
    items: [{ question: 'boom', answer: 'tree' }]
  });

  assert.equal(result.lessonId, 7);
  assert.deepEqual(
    db.calls.filter(x => ['update', 'delete', 'insert'].includes(x.op)).map(x => `${x.op}:${x.table}`),
    ['update:lessons', 'delete:lesson_items', 'insert:lesson_items']
  );
});
