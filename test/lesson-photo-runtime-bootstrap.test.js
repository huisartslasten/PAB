import assert from 'node:assert/strict';
import test from 'node:test';
import { bootstrapLessonPhotoRuntime } from '../src/features/lessons/lesson-photo-runtime-bootstrap.js';

test('photo runtime bootstrap loads and installs the entry', async () => {
  const target = {};
  const runtime = {
    requireParent: () => true,
    db: {},
    loadLessons: () => {},
    lessons: [],
    setCurrentStudent: () => {},
    setCurrentSubject: () => {},
    setCurrentLesson: () => {},
    showParentDashboard: () => {},
    showMessage: () => {}
  };
  const handler = await bootstrapLessonPhotoRuntime({
    runtime,
    target,
    loadEntry: async () => ({
      installLessonPhotoRuntimeEntry(bridge, destination) {
        assert.equal(bridge, runtime);
        destination.installed = true;
        return 'installed';
      }
    })
  });
  assert.equal(handler, 'installed');
  assert.equal(target.installed, true);
});

test('photo runtime bootstrap rejects an invalid entry', async () => {
  await assert.rejects(
    bootstrapLessonPhotoRuntime({ runtime: {}, target: {}, loadEntry: async () => ({}) }),
    /lesson-photo runtime entry is invalid/
  );
});
