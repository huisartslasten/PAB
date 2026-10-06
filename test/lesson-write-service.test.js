import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonWriteService } from '../src/features/lessons/lesson-write-service.js';

function mockDb({ rows = [{ id: 41, title: 'Nieuwe les' }], updateError = null, insertError = null, deleteError = null } = {}) {
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
                single: async () => ({ data: rows[0] ?? null, error: insertError })
              };
            }
          };
        },
        update(payload) {
          calls.push({ op: 'update', table, payload });
          return {
            eq(column, value) {
              calls.push({ op: 'eq-update', table, column, value });
              return {
                select() {
                  return {
                    single: async () => ({ data: rows[0] ?? null, error: updateError })
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
  assert.deepEqual(result.items, [{
    question: 'Vraag', answer: 'Antwoord', hint: '', min_words: 0, required_terms: [], lesson_id: 41
  }]);
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
    { op: 'eq-delete', table: 'lesson_items', column: 'lesson_id', value: 41 },
    {
      op: 'insert',
      table: 'lesson_items',
      payload: [{
        question: 'Vraag', answer: 'Antwoord', hint: '', min_words: 0, required_terms: [], lesson_id: 41
      }]
    }
  ]);
});
