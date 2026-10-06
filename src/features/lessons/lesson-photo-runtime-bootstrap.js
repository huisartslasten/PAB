export async function bootstrapLessonPhotoRuntime({
  runtime,
  target = globalThis,
  loadEntry = () => import('./lesson-photo-runtime-entry.js')
} = {}) {
  if (!runtime || typeof runtime !== 'object') throw new Error('A lesson-photo runtime bridge is required.');
  if (!target || typeof target !== 'object') throw new Error('A runtime target is required.');
  if (typeof loadEntry !== 'function') throw new Error('A lesson-photo runtime entry loader is required.');

  const entry = await loadEntry();
  if (!entry || typeof entry.installLessonPhotoRuntimeEntry !== 'function') {
    throw new Error('The lesson-photo runtime entry is invalid.');
  }
  return entry.installLessonPhotoRuntimeEntry(runtime, target);
}
