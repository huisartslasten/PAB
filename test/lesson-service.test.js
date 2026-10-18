import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonService } from '../src/services/lesson-service.js';

function mockDb() {
  const calls = [];
  const db = {
    calls,
    from(table) {
      return {
        insert(rows) {
          calls.push({ op: 'insert', table, rows });
          const data = table === 'lessons' ? { id: 31, ...rows } : rows;
          return {
            select() {
              const selected = Promise.resolve({ data: table === 'lessons' ? [data] : rows, error: null });
              selected.single = () => Promise.resolve({ data, error: null });
              return selected;
            }
          };
        },
        update(payload) {
          calls.push({ op: 'update', table, payload });
          return {
            eq(column, value) {
              calls.push({ op: 'eq', table, column, value });
              return {
                select() {
                  const selected = Promise.resolve({ data: [{ id: value, ...payload }], error: null });
                  selected.single = () => Promise.resolve({ data: { id: value, ...payload }, error: null });
                  return selected;
                }
              };
            }
          };
        },
        delete() {
          calls.push({ op: 'delete', table });
          return {
            eq(column, value) {
              calls.push({ op: 'eq-delete', column, value });
              return Promise.resolve({ error: null });
            }
          };
        }
      };
    }
  };
  return db;
}

test('lesson service replaces lesson items with normalized TEST-schema fields', async () => {
  const db = mockDb();
  const service = createLessonService(db);
  await service.replaceLessonItems(12, [{ prompt: 'woord', min_words: '', required_terms: null }]);
  const inserted = db.calls.find(call => call.op === 'insert').rows;
  assert.deepEqual(inserted, [{
    question: '',
    answer: '',
    question_parts: [],
    answer_parts: [],
    hint: '',
    response_type: 'text',
    answer_options: [],
    sort_order: 0,
    lesson_id: 12
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
          const isLesson = table === 'lessons';
          const data = isLesson ? { id: 31, ...rows } : rows;
          return {
            select() {
              const selected = Promise.resolve({ data: isLesson ? [data] : rows, error: null });
              selected.single = () => Promise.resolve({ data, error: null });
              return selected;
            }
          };
        },
        delete() {
          calls.push({ op: 'delete', table });
          return {
            eq(column, value) {
              calls.push({ op: 'eq-delete', column, value });
              return Promise.resolve({ error: null });
            }
          };
        }
      };
    }
  };

  const service = createLessonService(db);
  const result = await service.createLessonWithItems({
    lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Foto-les', type: 'words' },
    items: [{ question: 'Wat betekent kapen?', answer: 'Een schip overnemen', min_words: '', required_terms: null }]
  });

  assert.equal(result.lesson.id, 31);
  assert.deepEqual(calls[1], {
    op: 'insert',
    table: 'lessons',
    rows: {
      student: 'Zyon',
      subject: 'Nederlands',
      subvak: '',
      title: 'Foto-les',
      type: 'words',
      archived: false,
      deleted: false
    }
  });
  assert.deepEqual(calls[3].rows, [{
    question: 'Wat betekent kapen?',
    answer: 'Een schip overnemen',
    question_parts: [{ text: 'Wat betekent kapen?', role: 'answer' }],
    answer_parts: [{ text: 'Een schip overnemen', role: 'answer' }],
    hint: '',
    response_type: 'text',
    answer_options: [],
    sort_order: 0,
    lesson_id: 31
  }]);
});
