import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonEditorRuntime } from '../src/features/lessons/lesson-editor-runtime-entry.js';

function createDb() {
  const calls = [];
  let nextId = 1;
  const client = {
    from(table) {
      assert.ok(table === 'lessons' || table === 'lesson_items');
      return {
        insert(payload) {
          calls.push({ table, operation: 'insert', payload });
          return {
            select() {
              return {
                single: async () => ({
                  data: table === 'lessons' ? { ...payload, id: nextId++ } : payload,
                  error: null
                })
              };
            }
          };
        },
        delete() {
          return { eq: async () => ({ data: null, error: null }) };
        }
      };
    }
  };
  return { client, calls };
}

function createStorage() {
  const data = new Map();
  return {
    getItem(key) { return data.get(key) ?? null; },
    setItem(key, value) { data.set(key, value); }
  };
}

test('canonical lesson editor runtime writes through lesson-write-service and owns test-date persistence', async () => {
  const { client, calls } = createDb();
  let refreshCount = 0;
  const runtime = createLessonEditorRuntime({
    db: client,
    storage: createStorage(),
    refreshLessons: async () => { refreshCount += 1; }
  });

  const result = await runtime.save({
    student: 'Zyon',
    subject: 'Taal',
    title: 'Themawoorden',
    type: 'words',
    testDate: '2026-11-11',
    items: [{ question: 'expert', answer: 'deskundige' }]
  });

  assert.equal(result.ok, true);
  assert.equal(result.lessonId, 1);
  assert.equal(refreshCount, 1);
  assert.equal(calls.filter(call => call.table === 'lessons').length, 1);
  assert.equal(calls.filter(call => call.table === 'lesson_items').length, 1);
});

test('authorization remains a runtime concern and prevents writes', async () => {
  const { client, calls } = createDb();
  const runtime = createLessonEditorRuntime({
    db: client,
    storage: createStorage(),
    refreshLessons: async () => {},
    authorize: async () => false
  });

  const result = await runtime.save({
    student: 'Zyon', subject: 'Taal', title: 'Niet opslaan', type: 'words',
    items: [{ question: 'a', answer: 'b' }]
  });

  assert.deepEqual(result, { ok: false, stage: 'authorization' });
  assert.equal(calls.length, 0);
});
