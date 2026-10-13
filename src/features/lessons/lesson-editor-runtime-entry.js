import { createLessonWriteService } from './lesson-write-service.js';
import { createLessonEditorController } from './editor-controller.js';
import { createTestCalendarStorage } from '../agenda/test-calendar.js';

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') throw new Error('A lesson editor runtime is required.');
  if (!runtime.db) throw new Error('Lesson editor runtime requires db.');
  if (typeof runtime.refreshLessons !== 'function') throw new Error('Lesson editor runtime requires refreshLessons.');
  return runtime;
}

export function createLessonEditorRuntime(runtime) {
  const app = requireRuntime(runtime);
  const writeService = createLessonWriteService(app.db);
  const calendar = createTestCalendarStorage(app.storage);

  const saveDraft = async ({ lessonId = null, lesson = {}, items = [], testDate = '' } = {}) => {
    if (typeof app.authorize === 'function') {
      const authorized = await app.authorize();
      if (!authorized) return { ok: false, stage: 'authorization' };
    }

    const written = await writeService.saveLesson({ id: lessonId, lesson, items });
    const savedLesson = written?.lesson;
    const savedLessonId = savedLesson?.id ?? lessonId;
    const student = savedLesson?.student ?? lesson.student ?? '';

    if (testDate) {
      calendar.upsert({ lessonId: savedLessonId, student, date: testDate, lesson: savedLesson });
    } else {
      calendar.remove({ lessonId: savedLessonId, student });
    }

    return { ...written, lessonId: savedLessonId, testDate };
  };

  const controller = createLessonEditorController({
    saveDraft,
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
