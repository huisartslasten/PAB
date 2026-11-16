import { buildLessonSaveRequest } from './lesson-save-adapter.js';
import { buildItemsForType } from './element-registry.js';
import { validateEditorDraft, editorErrorText } from './editor-validation.js';

export function createLessonEditorController({ saveDraft, refreshLessons, onSaved } = {}) {
  if (typeof saveDraft !== 'function') throw new Error('saveDraft is required.');

  async function save(raw = {}) {
    const type = raw.type || 'words';
    try {
      const items = buildItemsForType(type, raw.items || []);
      const request = buildLessonSaveRequest({ draft: raw, items });
      const validation = validateEditorDraft({ ...request.lesson, items: request.items });
      if (!validation.valid) return { ok: false, validation, message: editorErrorText(validation) };

      const result = await saveDraft({
        lessonId: request.lessonId,
        lesson: request.lesson,
        items: request.items,
        testDate: request.testDate
      });

      if (!result?.ok) return result || { ok: false, stage: 'persistence' };

      if (refreshLessons) await refreshLessons();

      const lessonId = result?.lesson?.id ?? result?.lessonId ?? request.lessonId;
      const saved = {
        lesson: { ...request.lesson, id: lessonId, lesson_items: request.items },
        lessonId,
        testDate: request.testDate
      };
      if (onSaved) await onSaved({ ok: true, ...saved });
      return { ok: true, ...saved };
    } catch (error) {
      const message = error instanceof Error && error.message
        ? error.message
        : 'De les kon niet worden opgeslagen.';
      return {
        ok: false,
        stage: 'save',
        message
      };
    }
  }

  return Object.freeze({ save });
}
