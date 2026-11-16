import test from 'node:test';
import assert from 'node:assert/strict';
import { getArchiveEntries, getTrashEntries, canRestoreLesson } from '../src/features/management/recovery.js';

const lessons = [
  { id: 1, student: 'Zyon', archived: true, deleted: false },
  { id: 2, student: 'Zyon', archived: false, deleted: true },
  { id: 3, student: 'Zyon', archived: true, deleted: true }
];

test('archive and trash entries remain separate', () => {
  assert.deepEqual(getArchiveEntries(lessons, 'Zyon').map(x => x.id), [1]);
  assert.deepEqual(getTrashEntries(lessons, 'Zyon').map(x => x.id), [2, 3]);
});

test('archived or deleted lessons can be restored', () => {
  assert.equal(canRestoreLesson(lessons[0]), true);
  assert.equal(canRestoreLesson(lessons[1]), true);
  assert.equal(canRestoreLesson({ id: 9 }), false);
});
