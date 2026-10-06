import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonWriteService } from '../src/features/lessons/lesson-write-service.js';

function mockDb({ rows = [], insertError = null, updateError = null, deleteError = null, itemInsertError = null } = {}) {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push({ op: 'from', table });
      return {
        insert(payload) {
          calls.push({ op: 'insert', table, payload });
          return {
            select() {
              return {
                single() {
                  return Promise.resolve({ data: rows[0] ?? { id: 41 }, error: insertError });
                }
              };
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
                  return {
                    single() {
                      return Promise.resolve({ data: rows[0] ?? { id: value }, error: updateError });
                    }
                  };
                }
              };
            }
          };
        },
        delete() {
          calls.push({ op: 'delete', table });
          return {
            eq(column, value) {
              calls.push({ op: 'eq-delete', table, column, value });
              return Promise.resolve({ error: deleteError });
            }
          };
        }
      };
    }
  };
}

test('lesson write service creates lesson before replacing its items', async () => {
  const db = mockDb({ rows: [{ id: 41, title: 'Nieuwe les' }] });
  const service = createLessonWriteService(db);

  const result = await service.saveLesson({
    lesson: {
      student: 'Zyon',
      subject: 'Nederlands',
      subvak: 'Themawoorden',
      title: 'Nieuwe les',
      type: 'words',
      explanation: 'Uitleg',
      ai_check_answers: true,
      ai_instruction: 'Betekenis beoordelen',
      editor_labels: null
    },
    items: [{ question: 'Vraag', answer: 'Antwoord', hint: '', min_words: '', required_terms: null }]
  });

  assert.deepEqual(result.lesson, { id: 41, title: 'Nieuwe les' });
  assert.deepEqual(db.calls, [
    { op: 'from', table: 'lessons' },
    {
      op: 'insert',
      table: 'lessons',
      payload: {
        student: 'Zyon', subject: 'Nederlands', subvak: 'Themawoorden', title: 'Nieuwe les',
        type: 'words', explanation: 'Uitleg', ai_check_answers: true,
        ai_instruction: 'Betekenis beoordelen', editor_labels: null
      }
    },
    { op: 'from', table: 'lesson_items' },
    { op: 'delete', table: 'lesson_items' },
    { op: 'eq-delete', table: 'lesson_items', column: 'lesson_id', value: 41 }
  ]);
});

test('lesson write service updates lesson before replacing its items', async () => {
  const db = mockDb({ rows: [{ id: 17, title: 'Aangepaste les' }] });
  const service = createLessonWriteService(db);

  await service.saveLesson({
    id: 17,
    lesson: { student: 'Zyon', subject: 'Rekenen', subvak: '', title: 'Aangepaste les', type: 'math' },
    items: []
  });

  assert.deepEqual(db.calls.slice(0, 5), [
    { op: 'from', table: 'lessons' },
    {
      op: 'update',
      table: 'lessons',
      payload: {
        student: 'Zyon', subject: 'Rekenen', subvak: '', title: 'Aangepaste les',
        type: 'math', explanation: '', ai_check_answers: false, ai_instruction: '', editor_labels: null
      }
    },
    { op: 'eq', table: 'lessons', column: 'id', value: 17 },
    { op: 'from', table: 'lesson_items' },
    { op: 'delete', table: 'lesson_items' }
  ]);
});

test('lesson write service preserves the editor item normalization contract', async () => {
  const db = mockDb({ rows: [{ id: 41 }] });
  const service = createLessonWriteService(db);

  await service.saveLesson({
    lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Woorden', type: 'words' },
    items: [{ question: 'Vraag', answer: 'Antwoord', hint: '', min_words: '', required_terms: null }]
  });

  assert.deepEqual(db.calls.slice(-3), [
    { op: 'from', table: 'lesson_items' },
    { op: 'delete', table: 'lesson_items' },
    { op: 'eq-delete', table: 'lesson_items', column: 'lesson_id', value: 41 }
  ]);
});
