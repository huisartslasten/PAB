import { buildLessonPayload, buildEditorModel } from './editor-model.js';
import { buildItemsForType } from './editor-items.js';
import { validateEditorDraft, editorErrorText } from './editor-validation.js';

export function createLessonEditorController({ editorService, refreshLessons, onSaved } = {}) {
  if (!editorService) throw new Error('editorService is required.');

  async function save(raw = {}) {
    const type = raw.type || 'words';
    const lesson = buildLessonPayload(raw);
    const items = buildItemsForType(type, raw.items || []);
    const validation = validateEditorDraft({ ...lesson, items });
    if (!validation.valid) return { ok: false, validation, message: editorErrorText(validation) };

    const result = await editorService.saveDraft({ lessonId: raw.lessonId ?? null, lesson, items });
    if (refreshLessons) await refreshLessons();
    const saved = { ...buildEditorModel({ lesson: { ...lesson, id: result.lessonId, lesson_items: items }, testDate: raw.testDate }), lessonId: result.lessonId };
    if (onSaved) await onSaved(saved);
    return { ok: true, ...saved };
  }

  return Object.freeze({ save });
}
