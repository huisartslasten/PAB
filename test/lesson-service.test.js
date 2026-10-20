import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonService } from '../src/services/lesson-service.js';

const learningTopics = {
  async ensureTopic(payload) { return { id: 99, ...payload }; }
};

function createService(db) {
  return createLessonService(db, { learningTopics });
}

function mockDb({ rows = [], error = null, insertError = null, updateError = null } = {}) {
  const calls = [];
  return {
    calls,
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
            single() { return Promise.resolve({ data: rows[0] ?? null, error }); }
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
                  return { single() { return Promise.resolve({ data: rows[0] ?? null, error: updateError }); } };
                }
              };
            }
          };
        },
        delete() {
          calls.push({ op: 'delete' });
          return { eq(column, value) { calls.push({ op: 'eq-delete', column, value }); return Promise.resolve({ error: null }); } };
        },
        insert(insertRows) {
          calls.push({ op: 'insert', rows: insertRows });
          return {
            select() {
              const selectedRow = rows[0] ?? (Array.isArray(insertRows) ? insertRows[0] : insertRows);
              const selected = Promise.resolve({ data: Array.isArray(insertRows) ? insertRows : [insertRows], error: insertError });
              selected.single = () => Promise.resolve({ data: selectedRow, error: insertError });
              return selected;
            }
          };
        }
      };
    }
  };
}

test('lesson service preserves item ordering and query shape', async () => {
  const db = mockDb({ rows: [{ id: 4, lesson_items: [{ id: 2, sort_order: 2 }, { id: 1, sort_order: 1 }] }] });
  const result = await createService(db).listAll();
  assert.deepEqual(result[0].lesson_items.map(item => item.id), [1, 2]);
  assert.deepEqual(db.calls[1], { op: 'select', columns: '*, lesson_items(*)' });
  assert.deepEqual(db.calls[2], { op: 'order', column: 'id', options: { ascending: true } });
});

test('lesson service creates a lesson through the canonical topic owner', async () => {
  const payload = { title: 'Nieuwe les', student: 'Zyon', subject: '', type: 'words' };
  const persisted = { student: 'Zyon', subject: '', subvak: '', title: 'Nieuwe les', type: 'words', archived: false, deleted: false, learning_topic_id: 99 };
  const db = mockDb({ rows: [{ id: 17, ...persisted }] });
  const result = await createService(db).createLesson(payload);
  assert.deepEqual(result, { id: 17, ...persisted });
  assert.deepEqual(db.calls[1], { op: 'insert', rows: persisted });
});

test('lesson service propagates create errors', async () => {
  const error = new Error('create failed');
  const db = mockDb({ insertError: error });
  await assert.rejects(() => createService(db).createLesson({ title: 'Nieuwe les' }), error);
});

test('lesson service updates a lesson through the canonical topic owner', async () => {
  const persisted = { student: null, subject: '', subvak: '', title: 'Aangepaste les', type: '', archived: false, deleted: false, learning_topic_id: 99 };
  const db = mockDb({ rows: [{ id: 17, ...persisted }] });
  const result = await createService(db).updateLesson(17, { title: 'Aangepaste les', archived: false });
  assert.deepEqual(result, { id: 17, ...persisted });
  assert.deepEqual(db.calls[1], { op: 'update', payload: persisted });
});

test('lesson service propagates update errors', async () => {
  const error = new Error('update failed');
  const db = mockDb({ updateError: error });
  await assert.rejects(() => createService(db).updateLesson(17, { title: 'Aangepaste les' }), error);
});

test('lesson service exposes archive, trash and restore operations', async () => {
  const db = mockDb();
  const service = createService(db);
  await service.archive(7);
  await service.moveToTrash(7);
  await service.restore(7);
  assert.deepEqual(db.calls.filter(call => call.op === 'update').map(call => call.payload), [
    { archived: true }, { deleted: true, archived: false }, { archived: false, deleted: false }
  ]);
});

test('lesson service replaces lesson items with normalized TEST-schema fields', async () => {
  const db = mockDb();
  await createService(db).replaceLessonItems(12, [{ prompt: 'woord', min_words: '', required_terms: null }]);
  assert.deepEqual(db.calls.find(call => call.op === 'insert').rows, [{
    question: '', answer: '', question_parts: [], answer_parts: [], hint: '', response_type: 'text',
    answer_options: [], sort_order: 0, lesson_id: 12
  }]);
});

test('lesson service owns photo-style lesson creation and preserves normalized item data', async () => {
  const calls = [];
  const db = {
    from(table) {
      calls.push({ op: 'from', table });
      return {
        insert(rows) {
          calls.push({ op: 'insert', table, rows });
          const data = table === 'lessons' ? { id: 31, ...rows } : rows;
          return { select() {
            const selected = Promise.resolve({ data: table === 'lessons' ? [data] : rows, error: null });
            selected.single = () => Promise.resolve({ data, error: null });
            return selected;
          } };
        },
        delete() { calls.push({ op: 'delete', table }); return { eq(column, value) { calls.push({ op: 'eq-delete', column, value }); return Promise.resolve({ error: null }); } }; }
      };
    }
  };
  const result = await createService(db).createLessonWithItems({
    lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Foto-les', type: 'words' },
    items: [{ question: 'Wat betekent kapen?', answer: 'Een schip overnemen' }]
  });
  assert.equal(result.lesson.id, 31);
  assert.equal(calls[1].rows.learning_topic_id, 99);
  assert.deepEqual(calls[3].rows, [{
    question: 'Wat betekent kapen?', answer: 'Een schip overnemen',
    question_parts: [{ text: 'Wat betekent kapen?', role: 'answer' }],
    answer_parts: [{ text: 'Een schip overnemen', role: 'answer' }],
    hint: '', response_type: 'text', answer_options: [], sort_order: 0, lesson_id: 31
  }]);
});

test('lesson service rolls back the created lesson when item persistence fails', async () => {
  const rollbackError = new Error('item insert failed');
  const calls = [];
  let insertCount = 0;
  const db = {
    from(table) {
      calls.push({ op: 'from', table });
      return {
        insert(rows) {
          insertCount += 1;
          calls.push({ op: 'insert', table, rows });
          return { select() {
            if (table === 'lessons') {
              const selected = Promise.resolve({ data: [{ id: 44, ...rows }], error: null });
              selected.single = () => Promise.resolve({ data: { id: 44, ...rows }, error: null });
              return selected;
            }
            const selected = Promise.resolve({ data: null, error: rollbackError });
            selected.single = () => Promise.resolve({ data: null, error: rollbackError });
            return selected;
          } };
        },
        delete() { calls.push({ op: 'delete', table }); return { eq(column, value) { calls.push({ op: 'eq-delete', column, value }); return Promise.resolve({ error: null }); } }; }
      };
    }
  };
  await assert.rejects(() => createService(db).createLessonWithItems({ lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Foto-les', type: 'words' }, items: [{ question: 'Vraag', answer: 'Antwoord' }] }), rollbackError);
  assert.equal(insertCount, 2);
  assert.deepEqual(calls.at(-2), { op: 'delete', table: 'lessons' });
  assert.deepEqual(calls.at(-1), { op: 'eq-delete', column: 'id', value: 44 });
});
