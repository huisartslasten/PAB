import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestCalendarStorage, getUpcomingTests, upsertTestDate } from '../src/features/agenda/test-calendar.js';

function fakeStorage() {
  let value = null;
  return { getItem: () => value, setItem: (_key, next) => { value = next; } };
}

test('test calendar uses the existing pacogo storage key', () => {
  const storage = fakeStorage();
  const calendar = createTestCalendarStorage(storage);
  calendar.save([{ id: '1' }]);
  assert.deepEqual(calendar.getAll(), [{ id: '1' }]);
});

test('upcoming tests are scoped to student, sorted and limited to four', () => {
  const items = [
    { id: 1, student: 'Zyon', date: '2026-10-10' },
    { id: 2, student: 'Other', date: '2026-10-06' },
    { id: 3, student: 'Zyon', date: '2026-10-07' }
  ];
  assert.deepEqual(getUpcomingTests(items, 'Zyon', new Date('2026-10-05')).map(x => x.id), [3, 1]);
});

test('upsert replaces an existing lesson date and preserves its id', () => {
  const items = [{ id: 'abc', lessonId: 5, student: 'Zyon', date: '2026-10-07', subject: 'Nederlands', title: 'Oud' }];
  const result = upsertTestDate(items, { lessonId: 5, student: 'Zyon', date: '2026-10-08', lesson: { subject: 'Nederlands', title: 'Nieuw' } });
  assert.deepEqual(result, [{ id: 'abc', lessonId: 5, student: 'Zyon', date: '2026-10-08', subject: 'Nederlands', title: 'Nieuw' }]);
});
