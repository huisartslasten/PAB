// Explicit browser bootstrap boundary for the V4.78 lesson-save runtime.
// The classic-script caller installs one readiness promise and one save entry.
// There is no timeout, fallback, duplicate legacy execution, or delayed patch.

export function bootstrapLessonSaveRuntime({
  runtime,
  target = globalThis,
  loadRuntimeEntry = () => import('./lesson-save-runtime-entry.js')
} = {}) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A V4.78 lesson save runtime bridge is required.');
  }
  if (!target || typeof target !== 'object') {
    throw new Error('A lesson save runtime target is required.');
  }
  if (typeof loadRuntimeEntry !== 'function') {
    throw new Error('A lesson save runtime loader is required.');
  }

  const readiness = Promise.resolve()
    .then(() => loadRuntimeEntry())
    .then(({ installLessonSaveRuntimeEntry }) => {
      if (typeof installLessonSaveRuntimeEntry !== 'function') {
        throw new Error('The lesson save runtime entry installer is unavailable.');
      }
      installLessonSaveRuntimeEntry(runtime);
      return target.saveLesson;
    });

  target.pacoGOLessonSaveRuntimeReady = readiness;

  return readiness;
}
