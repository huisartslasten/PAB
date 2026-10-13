import { createLessonWriteService } from './lesson-write-service.js';
import { createLessonEditorController } from './editor-controller.js';
import { createTestCalendarStorage } from '../agenda/test-calendar.js';

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') throw new Error('A lesson editor runtime is required.');
  if (!runtime.db) throw new Error('Lesson editor runtime requires db.');
  if (!runtime.storage) throw new Error('Lesson editor runtime requires storage.');
  if (typeof runtime.initializeSession !== 'function') throw new Error('Lesson editor runtime requires initializeSession.');
  if (typeof runtime.isParent !== 'function') throw new Error('Lesson editor runtime requires parent authorization.');
  return runtime;
}

export function createLessonEditorRuntime(runtime) {
  const app = requireRuntime(runtime);
  const writeService = createLessonWriteService(app.db);
  const calendar = createTestCalendarStorage(app.storage);

  const saveDraft = async ({ lessonId = null, lesson = {}, items = [], testDate = '' } = {}) => {
    await app.initializeSession();
    if (!app.isParent()) return { ok: false, stage: 'authorization', message: 'Je hebt geen toegang tot lesbeheer.' };

    const written = await writeService.saveLesson({ id: lessonId, lesson, items });
    const savedLesson = written?.lesson;
    const savedLessonId = savedLesson?.id ?? lessonId;
    const student = savedLesson?.student ?? lesson.student ?? '';

    if (testDate) calendar.upsert({ lessonId: savedLessonId, student, date: testDate, lesson: savedLesson });
    else calendar.remove({ lessonId: savedLessonId, student });

    return { ok: true, ...written, lessonId: savedLessonId, testDate };
  };

  const controller = createLessonEditorController({ saveDraft });
  return Object.freeze({ save: controller.save });
}
