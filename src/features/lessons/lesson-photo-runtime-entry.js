import { createLessonFromPhotoPersistence } from './lesson-photo-write-service.js';
import { createLessonFromPhotoRuntime } from './lesson-photo-runtime.js';

const REQUIRED_KEYS = [
  'requireParent',
  'db',
  'loadLessons',
  'lessons',
  'setCurrentStudent',
  'setCurrentSubject',
  'setCurrentLesson',
  'showParentDashboard',
  'showMessage'
];

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') throw new Error('A lesson-photo runtime bridge is required.');
  for (const key of REQUIRED_KEYS) {
    if (!(key in runtime)) throw new Error(`The lesson-photo runtime bridge is missing: ${key}.`);
  }
  if (!runtime.db) throw new Error('The lesson-photo runtime bridge is missing: db.');
}

export async function executeCreateLessonFromPhoto(runtime, input = {}) {
  requireRuntime(runtime);
  return createLessonFromPhotoRuntime({
    ...input,
    authorize: runtime.requireParent,
    persistLesson: values => createLessonFromPhotoPersistence({ db: runtime.db, ...values }),
    loadLessons: runtime.loadLessons,
    lessons: runtime.lessons,
    setCurrentStudent: runtime.setCurrentStudent,
    setCurrentSubject: runtime.setCurrentSubject,
    setCurrentLesson: runtime.setCurrentLesson,
    saveSourcePhoto: runtime.saveSourcePhoto,
    showMessage: runtime.showMessage,
    showParentDashboard: runtime.showParentDashboard
  });
}

export function installLessonPhotoRuntimeEntry(runtime, target = globalThis) {
  requireRuntime(runtime);
  if (!target || typeof target !== 'object') throw new Error('A runtime target is required.');
  target.createLessonFromPhotoRuntime = input => executeCreateLessonFromPhoto(runtime, input);
  return target.createLessonFromPhotoRuntime;
}
