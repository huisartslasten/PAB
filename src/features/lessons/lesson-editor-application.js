import { createLessonWriteService } from './lesson-write-service.js';
import { createTestCalendarStorage } from '../agenda/test-calendar.js';
import { createLessonEditorRuntime } from './lesson-editor-runtime-entry.js';

export function createLessonEditorApplication({ db, storage = globalThis.localStorage, initializeSession, isParent, refreshLessons = null, onSaved = null } = {}) {
  if (!db) throw new Error('Lesson editor application requires db.');
  if (typeof initializeSession !== 'function') throw new Error('Lesson editor application requires initializeSession.');
  if (typeof isParent !== 'function') throw new Error('Lesson editor application requires parent authorization.');

  const writeService = createLessonWriteService(db);
  const calendar = createTestCalendarStorage(storage);

  const saveDraft = async ({ lessonId = null, lesson = {}, items = [], testDate = '' } = {}) => {
    await initializeSession();
    if (!isParent()) return { ok: false, stage: 'authorization', message: 'Je hebt geen toegang tot lesbeheer.' };

    const written = await writeService.saveLesson({ id: lessonId, lesson, items });
    const savedLesson = written?.lesson;
    const savedLessonId = savedLesson?.id ?? lessonId;
    const student = savedLesson?.student ?? lesson.student ?? '';

    if (testDate) calendar.upsert({ lessonId: savedLessonId, student, date: testDate, lesson: savedLesson });
    else calendar.remove({ lessonId: savedLessonId, student });

    if (typeof refreshLessons === 'function') await refreshLessons();
    return { ok: true, ...written, lessonId: savedLessonId, testDate };
  };

  return Object.freeze({
    editor: createLessonEditorRuntime({ saveDraft, refreshLessons: async () => {} , onSaved }),
    saveDraft,
    calendar
  });
}
