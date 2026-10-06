export function bootstrapLessonGuestAccessRuntime({
  runtime,
  target = globalThis,
  loadRuntimeEntry = () => import('./lesson-guest-access-runtime-entry.js')
} = {}) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A V4.78 guest-lesson runtime bridge is required.');
  }
  if (!target || typeof target !== 'object') {
    throw new Error('A guest-lesson runtime target is required.');
  }
  if (typeof loadRuntimeEntry !== 'function') {
    throw new Error('A guest-lesson runtime loader is required.');
  }

  const readiness = Promise.resolve()
    .then(() => loadRuntimeEntry())
    .then(({ installLessonGuestAccessRuntimeEntry }) => {
      if (typeof installLessonGuestAccessRuntimeEntry !== 'function') {
        throw new Error('The guest-lesson runtime entry installer is unavailable.');
      }
      installLessonGuestAccessRuntimeEntry(runtime, target);
      return target;
    });

  target.pacoGOLessonGuestAccessRuntimeReady = readiness;
  return readiness;
}
