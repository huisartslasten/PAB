import { createLessonEditorController } from './editor-controller.js';

export function createLessonEditorPage({
  root,
  saveDraft,
  refreshLessons,
  onSaved,
  initialDraft = {}
} = {}) {
  if (!root || typeof root !== 'object') throw new Error('Lesson editor page requires a root element.');
  if (typeof saveDraft !== 'function') throw new Error('Lesson editor page requires saveDraft.');

  const controller = createLessonEditorController({ saveDraft, refreshLessons, onSaved });

  return Object.freeze({
    async save(draft = initialDraft) {
      return controller.save(draft);
    }
  });
}
