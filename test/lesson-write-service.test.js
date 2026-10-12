import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonWriteService } from '../src/features/lessons/lesson-write-service.js';

function mockDb({ rows = [], insertError = null, itemInsertError = null, updateError = null, deleteError = null } = {}) {
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
              if (table === 'lesson_items') {
                return Promise.resolve({ data: payload, error: itemInsertError });
              }
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

test('lesson write service creates a lesson and its items through canonical createLessonWithItems ownership', async () => {
  const db = mockDb({ rows: [{ id: 41, title: 'Nieuwe les' }] });
  const service = createLessonWriteService(db);

  const result = await service.saveLesson({
    lesson: {
      student: 'Zyon', subject: 'Nederlands', subvak: 'Themawoorden', title: 'Nieuwe les', type: 'words',
      explanation: 'Uitleg', ai_check_answers: true, ai_instruction: 'Betekenis beoordelen', editor_labels: null
    },
    items: [{ question: 'Vraag', answer: 'Antwoord', hint: '', min_words: '', required_terms: null }]
  });

  assert.deepEqual(result.lesson, { id: 41, title: 'Nieuwe les' });
  assert.deepEqual(result.items, [{ question: 'Vraag', answer: 'Antwoord', hint: '', min_words: 0, required_terms: [], lesson_id: 41 }]);
  assert.deepEqual(db.calls, [
    { op: 'from', table: 'lessons' },
    { op: 'insert', table: 'lessons', payload: {
      student: 'Zyon', subject: 'Nederlands', subvak: 'Themawoorden', title: 'Nieuwe les', type: 'words',
      explanation: 'Uitleg', ai_check_answers: true, ai_instruction: 'Betekenis beoordelen', editor_labels: null
    } },
    { op: 'from', table: 'lesson_items' },
    { op: 'insert', table: 'lesson_items', payload: [{
      question: 'Vraag', answer: 'Antwoord', hint: '', min_words: 0, required_terms: [], lesson_id: 41
    }] }
  ]);
});

test('lesson write service rolls back the created lesson when canonical item persistence fails', async () => {
  const itemError = new Error('item insert failed');
  const db = mockDb({ itemInsertError: itemError, rows: [{ id: 41 }] });

  await assert.rejects(
    () => createLessonWriteService(db).saveLesson({
      lesson: { student: 'Zyon', subject: 'Rekenen', title: 'Les', type: 'math' },
      items: [{ question: 'Vraag', answer: 'Antwoord' }]
    }),
    itemError
  );

  assert.deepEqual(db.calls, [
    { op: 'from', table: 'lessons' },
    { op: 'insert', table: 'lessons', payload: {
      student: 'Zyon', subject: 'Rekenen', subvak: undefined, title: 'Les', type: 'math',
      explanation: '', ai_check_answers: false, ai_instruction: '', editor_labels: null
    } },
    { op: 'from', table: 'lesson_items' },
    { op: 'insert', table: 'lesson_items', payload: [{ question: 'Vraag', answer: 'Antwoord', lesson_id: 41 }] },
    { op: 'from', table: 'lessons' },
    { op: 'delete', table: 'lessons' },
    { op: 'eq-delete', table: 'lessons', column: 'id', value: 41 }
  ]);
});

test('lesson write service updates lesson before replacing its items', async () => {
  const db = mockDb({ rows: [{ id: 17, title: 'Aangepaste les' }] });

  await createLessonWriteService(db).saveLesson({
    id: 17,
    lesson: { student: 'Zyon', subject: 'Rekenen', subvak: '', title: 'Aangepaste les', type: 'math' },
    items: []
  });

  assert.deepEqual(db.calls, [
    { op: 'from', table: 'lessons' },
    { op: 'update', table: 'lessons', payload: {
      student: 'Zyon', subject: 'Rekenen', subvak: '', title: 'Aangepaste les', type: 'math',
      explanation: '', ai_check_answers: false, ai_instruction: '', editor_labels: null
    } },
    { op: 'eq', table: 'lessons', column: 'id', value: 17 },
    { op: 'from', table: 'lesson_items' },
    { op: 'delete', table: 'lesson_items' },
    { op: 'eq-delete', table: 'lesson_items', column: 'lesson_id', value: 17 }
  ]);
});

test('lesson write service propagates lesson update errors before touching items', async () => {
  const error = new Error('update failed');
  const db = mockDb({ updateError: error });

  await assert.rejects(
    () => createLessonWriteService(db).saveLesson({ id: 17, lesson: { student: 'Zyon', subject: 'Rekenen', title: 'Les', type: 'math' }, items: [] }),
    error
  );
  assert.equal(db.calls.some(call => call.op === 'delete'), false);
});

test('lesson write service propagates create errors before touching items', async () => {
  const error = new Error('create failed');
  const db = mockDb({ insertError: error });

  await assert.rejects(
    () => createLessonWriteService(db).saveLesson({ lesson: { student: 'Zyon', subject: 'Rekenen', title: 'Les', type: 'math' }, items: [] }),
    error
  );
  assert.equal(db.calls.some(call => call.table === 'lesson_items'), false);
});

test('lesson write service delegates item normalization to the lesson service', async () => {
  const db = mockDb({ rows: [{ id: 41 }] });

  await createLessonWriteService(db).saveLesson({
    lesson: { student: 'Zyon', subject: 'Nederlands', title: 'Woorden', type: 'words' },
    items: [{ question: 'Vraag', answer: 'Antwoord', hint: '', min_words: '', required_terms: null }]
  });

  const itemInsert = db.calls.find(call => call.op === 'insert' && call.table === 'lesson_items');
  assert.deepEqual(itemInsert.payload, [{ question: 'Vraag', answer: 'Antwoord', hint: '', min_words: 0, required_terms: [], lesson_id: 41 }]);
});

test('lesson write service owns subvak mutation and normalizes whitespace before persistence', async () => {
  const db = mockDb({ rows: [{ id: 17, subvak: 'Themawoorden' }] });

  const result = await createLessonWriteService(db).updateLessonSubvak(17, '  Themawoorden  ');

  assert.deepEqual(result, { id: 17, subvak: 'Themawoorden' });
  assert.deepEqual(db.calls, [
    { op: 'from', table: 'lessons' },
    { op: 'update', table: 'lessons', payload: { subvak: 'Themawoorden' } },
    { op: 'eq', table: 'lessons', column: 'id', value: 17 }
  ]);
});
