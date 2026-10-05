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
          calls.push({ op: 'insert', rows });
          return {
            select() {
              return {
                single() {
                  calls.push({ op: 'single-after-insert' });
                  return Promise.resolve({ data: { id: 42 }, error: null });
                }
              };
            }
          };
        },
        update(payload) {
          calls.push({ op: 'update', payload });
          return {
            eq(column, value) {
              calls.push({ op: 'eq-update', column, value });
              return { select: () => ({ single: () => Promise.resolve({ data: { id: value }, error: null }) }) };
            }
          };
        },
        delete() {
          calls.push({ op: 'delete' });
          return { eq: () => Promise.resolve({ error: null }) };
        }
      };
    }
  };
}

test('new editor save uses lesson service create flow', async () => {
  const db = mockDb();
  const service = createEditorService(db);
  const result = await service.saveDraft({
    lesson: { student: 'Zyon', subject: 'Taal', title: 'Themawoorden', type: 'words' },
    items: [{ question: 'huis', answer: 'house' }]
  });

  assert.equal(result.lessonId, 42);
  assert.deepEqual(db.calls.filter(x => ['insert', 'delete'].includes(x.op)).map(x => x.op), ['insert', 'delete']);
});

test('existing editor save updates lesson then replaces items', async () => {
  const db = mockDb();
  const service = createEditorService(db);
  const result = await service.saveDraft({
    lessonId: 7,
    lesson: { student: 'Zyon', subject: 'Taal', title: 'Bewerkt', type: 'words' },
    items: [{ question: 'boom', answer: 'tree' }]
  });

  assert.equal(result.lessonId, 7);
  assert.deepEqual(db.calls.filter(x => ['update', 'delete'].includes(x.op)).map(x => x.op), ['update', 'delete']);
});
