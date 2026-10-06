import { loadLessonsRuntime } from './lesson-load-runtime.js';
import { createLessonService } from '../../services/lesson-service.js';

const REQUIRED_KEYS = ['db', 'setLessons', 'showMessage', 'showHome'];

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A lesson-load runtime bridge is required.');
  }
  for (const key of REQUIRED_KEYS) {
    if (!(key in runtime)) {
      throw new Error(`The lesson-load runtime bridge is missing: ${key}.`);
    }
  }
  if (!runtime.db) {
    throw new Error('The lesson-load runtime bridge is missing: db.');
  }
}

export async function executeLoadLessons(runtime) {
  requireRuntime(runtime);
  const service = createLessonService(runtime.db);
  return loadLessonsRuntime({
    listLessons: () => service.listAll(),
    setLessons: runtime.setLessons,
    showMessage: runtime.showMessage,
    showHome: runtime.showHome
  });
}

export function installLessonLoadRuntimeEntry(runtime, target = globalThis) {
  requireRuntime(runtime);
  if (!target || typeof target !== 'object') {
    throw new Error('A runtime target is required.');
  }
  target.loadLessonsRuntime = () => executeLoadLessons(runtime);
  return target.loadLessonsRuntime;
}
