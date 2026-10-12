// Deterministic write orchestration for the V4.78 lesson editor.
// Contract source: legacy saveLesson() in TEST V4.78.
// No DOM work, AI behavior, navigation, or schema changes belong here.

import { createLessonService } from '../../services/lesson-service.js';

export function createLessonWriteService(db) {
  const lessons = createLessonService(db);

  async function saveLesson({
    id = null,
    lesson = {},
    items = []
  } = {}) {
    const payload = {
      student: lesson.student,
      subject: lesson.subject,
      subvak: lesson.subvak,
      title: lesson.title,
      type: lesson.type,
      explanation: lesson.explanation || '',
      ai_check_answers: lesson.ai_check_answers === true,
      ai_instruction: lesson.ai_instruction || '',
      editor_labels: lesson.editor_labels ?? null
    };

    if (id != null) {
      const updated = await lessons.updateLesson(id, payload);
      const savedItems = await lessons.replaceLessonItems(id, items);
      return Object.freeze({ lesson: updated, items: savedItems });
    }

    return lessons.createLessonWithItems({
      lesson: payload,
      items
    });
  }

  async function updateLessonSubvak(id, subvak) {
    return lessons.updateLesson(id, { subvak: String(subvak ?? '').trim() });
  }

  return Object.freeze({ saveLesson, updateLessonSubvak });
}
