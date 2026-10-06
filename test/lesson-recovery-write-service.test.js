import test from 'node:test';
import assert from 'node:assert/strict';
import {
  moveLessonToTrash,
  archiveLesson,
  restoreLesson
} from '../src/features/lessons/lesson-recovery-write-service.js';

function makeDb() {
  const calls = [];
  return {
    calls,
    from(table) {
      assert.equal(table, 'lessons');
      return {
        update(patch) {
          calls.push({ operation: 'update', patch });
          return {
            eq(column, value) {
              calls.push({ operation: 'eq', column, value });
              return Promise.resolve({ data: null, error: null });
            }
          };
        }
      };
    }
  };
}

test('moveLessonToTrash preserves the exact V4.78 trash patch', async () => {
  const db = makeDb();
  const outcome = await moveLessonToTrash({ db, lessonId: 42 });
  assert.deepEqual(db.calls, [
    { operation: 'update', patch: { deleted: true, archived: false } },
    { operation: 'eq', column: 'id', value: 42 }
  ]);
  assert.deepEqual(outcome, {
    ok: true,
    lessonId: 42,
    patch: { deleted: true, archived: false }
  });
});

test('archiveLesson preserves the exact V4.78 archive patch', async () => {
  const db = makeDb();
  const outcome = await archiveLesson({ db, lessonId: 7 });
  assert.deepEqual(db.calls, [
    { operation: 'update', patch: { archived: true } },
    { operation: 'eq', column: 'id', value: 7 }
  ]);
  assert.deepEqual(outcome, {
    ok: true,
    lessonId: 7,
    patch: { archived: true }
  });
});

test('restoreLesson preserves the exact V4.78 restore patch', async () => {
  const db = makeDb();
  const outcome = await restoreLesson({ db, lessonId: 9 });
  assert.deepEqual(db.calls, [
    { operation: 'update', patch: { deleted: false, archived: false } },
    { operation: 'eq', column: 'id', value: 9 }
  ]);
  assert.deepEqual(outcome, {
    ok: true,
    lessonId: 9,
    patch: { deleted: false, archived: false }
  });
});

test('recovery write boundary propagates database errors', async () => {
  const error = new Error('database unavailable');
  const db = {
    from() {
      return {
        update() {
          return { eq: async () => ({ error }) };
        }
      };
    }
  };
  await assert.rejects(
    () => moveLessonToTrash({ db, lessonId: 1 }),
    error
  );
});

test('recovery write boundary rejects missing database clients and ids', async () => {
  await assert.rejects(
    () => moveLessonToTrash({ lessonId: 1 }),
    /database client is required/
  );
  const db = makeDb();
  await assert.rejects(
    () => restoreLesson({ db }),
    /lesson id is required/
  );
});
