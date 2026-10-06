import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapLessonGuestAccessRuntime } from '../src/features/lessons/lesson-guest-access-runtime-bootstrap.js';

test('guest runtime bootstrap installs through the injected loader', async () => {
  const runtime = {
    requireParent: async () => true,
    currentStudent: 'Zyon',
    db: {},
    renderParentStudent: async () => {},
    showMessage: () => {}
  };
  const target = {};
  let installed = false;
  const ready = bootstrapLessonGuestAccessRuntime({
    runtime,
    target,
    loadRuntimeEntry: async () => ({
      installLessonGuestAccessRuntimeEntry(receivedRuntime, receivedTarget) {
        installed = receivedRuntime === runtime;
        receivedTarget.setGuestLesson = () => 'guest';
      }
    })
  });
  assert.equal(target.pacoGOLessonGuestAccessRuntimeReady, ready);
  await ready;
  assert.equal(installed, true);
  assert.equal(target.setGuestLesson(), 'guest');
});
