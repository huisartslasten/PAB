// Deterministic write orchestration for the V4.78 lesson editor.
// Contract source: legacy saveLesson() in TEST V4.78.
// No DOM work, AI behavior, navigation, or schema changes belong here.

import { createLessonService } from '../../services/lesson-service.js';

function normalizeItems(items = []) {
  return (Array.isArray(items) ? items : []).map(item => ({
    ...item,
    hint: item.hint || '',
    min_words: Number(item.min_words || 0),
    required_terms: Array.isArray(item.required_terms) ? item.required_terms : []
  }));
}

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
      const savedItems = await lessons.replaceLessonItems(id, normalizeItems(items));
      return Object.freeze({ lesson: updated, items: savedItems });
    }

    const created = await lessons.createLesson(payload);
    const savedItems = await lessons.replaceLessonItems(created.id, normalizeItems(items));
    return Object.freeze({ lesson: created, items: savedItems });
  }

  return Object.freeze({ saveLesson });
}
