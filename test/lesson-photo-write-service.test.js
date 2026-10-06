import assert from 'node:assert/strict';
import test from 'node:test';
import { createLessonFromPhotoPersistence } from '../src/features/lessons/lesson-photo-write-service.js';

function makeDb({ createError = null, insertError = null } = {}) {
  const calls = [];
  const db = {
    from(table) {
      calls.push(['from', table]);
      if (table === 'lessons') {
        return {
          insert(payload) {
            calls.push(['lessons.insert', payload]);
            return {
              select() { return { single: async () => ({ data: createError ? null : { id: 42, ...payload }, error: createError }) }; }
            };
          },
          delete() {
            return { eq: async (...args) => { calls.push(['lessons.delete.eq', ...args]); return { error: null }; } };
          }
        };
      }
      if (table === 'lesson_items') {
        return {
          insert(rows) {
            calls.push(['lesson_items.insert', rows]);
            return Promise.resolve({ error: insertError });
          }
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    }
  };
  return { db, calls };
}

test('photo persistence creates lesson then inserts ordered items', async () => {
  const { db, calls } = makeDb();
  const result = await createLessonFromPhotoPersistence({
    db,
    student: 'Zyon',
    subject: 'Themawoorden',
    title: 'Foto-les',
    type: 'words',
    pairs: [
      { question: 'kat', answer: 'dier' },
      { question: 'boom', answer: 'plant' }
    ]
  });

  assert.equal(result.lesson.id, 42);
  assert.deepEqual(calls, [
    ['from', 'lessons'],
    ['lessons.insert', { student: 'Zyon', subject: 'Themawoorden', title: 'Foto-les', type: 'words' }],
    ['from', 'lesson_items'],
    ['lesson_items.insert', [
      { lesson_id: 42, question: 'kat', answer: 'dier', sort_order: 0 },
      { lesson_id: 42, question: 'boom', answer: 'plant', sort_order: 1 }
    ]]
  ]);
});

test('photo persistence rolls back the lesson when item insertion fails', async () => {
  const itemError = new Error('item insert failed');
  const { db, calls } = makeDb({ insertError: itemError });
  await assert.rejects(
    createLessonFromPhotoPersistence({ db, student: 'Zyon', subject: 'Rekenen', title: 'Foto', type: 'math', pairs: [{ question: '1+1', answer: '2' }] }),
    error => error === itemError
  );
  assert.deepEqual(calls.slice(-1)[0], ['lessons.delete.eq', 'id', 42]);
});

test('photo persistence stops on lesson creation failure', async () => {
  const createError = new Error('lesson insert failed');
  const { db, calls } = makeDb({ createError });
  await assert.rejects(
    createLessonFromPhotoPersistence({ db, student: 'Zyon', subject: 'Rekenen', title: 'Foto', type: 'math', pairs: [{ question: '1+1', answer: '2' }] }),
    error => error === createError
  );
  assert.equal(calls.some(call => call[0] === 'lesson_items.insert'), false);
});

test('photo persistence rejects incomplete input before touching the database', async () => {
  let calls = 0;
  const db = { from() { calls += 1; throw new Error('should not be called'); } };
  await assert.rejects(
    createLessonFromPhotoPersistence({ db, student: 'Zyon', subject: 'Rekenen', title: 'Foto', type: 'math', pairs: [] }),
    /at least one pair/
  );
  assert.equal(calls, 0);
});
