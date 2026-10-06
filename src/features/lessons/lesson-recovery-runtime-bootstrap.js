export function bootstrapLessonRecoveryRuntime({
  runtime,
  target = globalThis,
  loadRuntimeEntry = () => import('./lesson-recovery-runtime-entry.js')
} = {}) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A V4.78 lesson recovery runtime bridge is required.');
  }
  if (!target || typeof target !== 'object') {
    throw new Error('A lesson recovery runtime target is required.');
  }
  if (typeof loadRuntimeEntry !== 'function') {
    throw new Error('A lesson recovery runtime loader is required.');
  }

  const readiness = Promise.resolve()
    .then(() => loadRuntimeEntry())
    .then(({ installLessonRecoveryRuntimeEntry }) => {
      if (typeof installLessonRecoveryRuntimeEntry !== 'function') {
        throw new Error('The lesson recovery runtime entry installer is unavailable.');
      }
      installLessonRecoveryRuntimeEntry(runtime, target);
      return target;
    });

  target.pacoGOLessonRecoveryRuntimeReady = readiness;
  return readiness;
}
