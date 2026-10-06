import assert from 'node:assert/strict';
import test from 'node:test';
import { executeCreateLessonFromPhoto, installLessonPhotoRuntimeEntry } from '../src/features/lessons/lesson-photo-runtime-entry.js';

function runtime() {
  return {
    requireParent: async () => true,
    db: { from() { throw new Error('db should be replaced by the persistence test seam'); } },
    loadLessons: async () => {},
    lessons: [{ id: 42 }],
    setCurrentStudent: () => {},
    setCurrentSubject: () => {},
    setCurrentLesson: () => {},
    showParentDashboard: async () => {},
    showMessage: () => {}
  };
}

test('photo runtime entry rejects missing bridge keys explicitly', async () => {
  await assert.rejects(
    executeCreateLessonFromPhoto({ ...runtime(), db: undefined }, { student: 'Zyon', subject: 'Rekenen', title: 'Foto', type: 'math', pairs: [{ question: '1+1', answer: '2' }] }),
    /The lesson-photo runtime bridge is missing: db\./
  );
});

test('photo runtime entry installs the public runtime handler', () => {
  const target = {};
  const handler = installLessonPhotoRuntimeEntry(runtime(), target);
  assert.equal(target.createLessonFromPhotoRuntime, handler);
  assert.equal(typeof handler, 'function');
});
