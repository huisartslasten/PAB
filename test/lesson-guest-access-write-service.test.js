import test from 'node:test';
import assert from 'node:assert/strict';
import {
  findGuestByName,
  findGuestLessonAssignment,
  listGuestLessonAssignments,
  updateGuestLessonAssignment,
  createGuestLessonAssignment
} from '../src/features/lessons/lesson-guest-access-service.js';

function dbFor(result) {
  const calls = [];
  const chain = {
    select(value) { calls.push(['select', value]); return chain; },
    eq(field, value) { calls.push(['eq', field, value]); return chain; },
    maybeSingle: async () => { calls.push(['maybeSingle']); return result; },
    update(value) { calls.push(['update', value]); return chain; },
    insert(value) { calls.push(['insert', value]); return chain; }
  };
  return { db: { from(table) { calls.push(['from', table]); return chain; } }, calls };
}

test('findGuestByName queries the canonical guest_access table by guest_name', async () => {
  const { db, calls } = dbFor({ data: { id: 7 }, error: null });
  assert.deepEqual(await findGuestByName({ db, guestName: 'Zyon' }), { id: 7 });
  assert.deepEqual(calls, [
    ['from', 'guest_access'],
    ['select', 'id'],
    ['eq', 'guest_name', 'Zyon'],
    ['maybeSingle']
  ]);
});

test('findGuestLessonAssignment queries the guest lesson pair', async () => {
  const { db, calls } = dbFor({ data: { id: 11 }, error: null });
  assert.deepEqual(await findGuestLessonAssignment({ db, guestId: 7, lessonId: 12 }), { id: 11 });
  assert.deepEqual(calls, [
    ['from', 'guest_lessons'],
    ['select', 'id'],
    ['eq', 'guest_id', 7],
    ['eq', 'lesson_id', 12],
    ['maybeSingle']
  ]);
});

test('listGuestLessonAssignments reads all assignments for the guest', async () => {
  const { db, calls } = dbFor({ data: [{ id: 11, lesson_id: 12, active: true }], error: null });
  assert.deepEqual(await listGuestLessonAssignments({ db, guestId: 7 }), [{ id: 11, lesson_id: 12, active: true }]);
  assert.deepEqual(calls, [
    ['from', 'guest_lessons'],
    ['select', 'id,lesson_id,active'],
    ['eq', 'guest_id', 7]
  ]);
});

test('updateGuestLessonAssignment preserves active value', async () => {
  const { db, calls } = dbFor({ error: null });
  const result = await updateGuestLessonAssignment({ db, assignmentId: 11, active: false });
  assert.deepEqual(result, { ok: true, assignmentId: 11, active: false });
  assert.deepEqual(calls, [
    ['from', 'guest_lessons'],
    ['update', { active: false }],
    ['eq', 'id', 11]
  ]);
});

test('createGuestLessonAssignment inserts the active assignment', async () => {
  const { db, calls } = dbFor({ error: null });
  const result = await createGuestLessonAssignment({ db, guestId: 7, lessonId: 12, active: true });
  assert.deepEqual(result, { ok: true, guestId: 7, lessonId: 12, active: true });
  assert.deepEqual(calls, [
    ['from', 'guest_lessons'],
    ['insert', { guest_id: 7, lesson_id: 12, active: true }]
  ]);
});

test('persistence errors are thrown to the runtime boundary', async () => {
  const error = new Error('database down');
  const { db } = dbFor({ data: null, error });
  await assert.rejects(
    findGuestByName({ db, guestName: 'Zyon' }),
    error
  );
});
