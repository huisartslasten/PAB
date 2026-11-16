import { createLessonEditorController } from './editor-controller.js';

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') throw new Error('A lesson editor runtime is required.');
  if (typeof runtime.saveDraft !== 'function') throw new Error('Lesson editor runtime requires saveDraft.');
  if (typeof runtime.refreshLessons !== 'function') throw new Error('Lesson editor runtime requires refreshLessons.');
  return runtime;
}

export function createLessonEditorRuntime(runtime) {
  const app = requireRuntime(runtime);
  const controller = createLessonEditorController({
    saveDraft: app.saveDraft,
    refreshLessons: app.refreshLessons,
    onSaved: app.onSaved
  });

  return Object.freeze({ save: controller.save });
}

export function installLessonEditorRuntime(runtime) {
  const editor = createLessonEditorRuntime(runtime);
  globalThis.pacoGOLessonEditor = editor;
  return editor;
}
