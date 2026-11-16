import { createLessonPayload, prepareLessonItems, validateLessonDraft } from './editor-model.js';

/**
 * Deterministic save boundary for the V4.78 lesson editor.
 * The controller deliberately knows nothing about DOM elements or UI rendering.
 */
export function createLessonSaveController({ lessonService, refresh = async () => {} } = {}) {
  if (!lessonService) throw new Error('createLessonSaveController requires lessonService');

  async function save({ id = null, student, subject, title, type, items = [] } = {}) {
    const draft = { student, subject, title, items };
    const validation = validateLessonDraft(draft);
    if (!validation.valid) {
      const error = new Error(`Invalid lesson draft: ${validation.errors.join(', ')}`);
      error.code = 'INVALID_LESSON_DRAFT';
      error.fields = validation.errors;
      throw error;
    }

    const payload = createLessonPayload({ student, subject, title, type });
    const preparedItems = prepareLessonItems(items);

    let lesson;
    if (id != null) {
      lesson = await lessonService.updateLesson(id, payload);
      await lessonService.replaceLessonItems(id, preparedItems);
    } else {
      lesson = await lessonService.createLesson(payload);
      await lessonService.replaceLessonItems(lesson.id, preparedItems);
    }

    await refresh();
    return { lesson, items: preparedItems };
  }

  return Object.freeze({ save });
}
