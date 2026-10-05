import { createLessonService } from '../../services/lesson-service.js';

export function createEditorService(supabaseClient) {
  const lessons = createLessonService(supabaseClient);

  async function saveDraft({ lessonId = null, lesson, items = [] } = {}) {
    if (lessonId != null) {
      await lessons.updateLesson(lessonId, lesson);
      await lessons.replaceLessonItems(lessonId, items);
      return { lessonId };
    }

    const created = await lessons.createLesson(lesson);
    const createdId = created?.id;
    if (createdId == null) throw new Error('Nieuwe les kreeg geen id.');
    await lessons.replaceLessonItems(createdId, items);
    return { lessonId: createdId };
  }

  return Object.freeze({ saveDraft });
}
