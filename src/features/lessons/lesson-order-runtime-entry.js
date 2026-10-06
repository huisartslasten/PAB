import { createLessonOrderService } from './lesson-order-service.js';
import { getOrderedLessonsRuntime, saveLessonOrderRuntime } from './lesson-order-runtime.js';

const REQUIRED_KEYS = ['db', 'storage', 'isParentLoggedIn'];

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A lesson-order runtime bridge is required.');
  }
  for (const key of REQUIRED_KEYS) {
    if (!(key in runtime)) {
      throw new Error(`The lesson-order runtime bridge is missing: ${key}.`);
    }
  }
  if (!runtime.db) throw new Error('The lesson-order runtime bridge is missing: db.');
  if (!runtime.storage) throw new Error('The lesson-order runtime bridge is missing: storage.');
  if (typeof runtime.isParentLoggedIn !== 'function') {
    throw new Error('The lesson-order runtime bridge is missing: isParentLoggedIn function.');
  }
}

export async function executeGetOrderedLessons(runtime, list, student, subject) {
  requireRuntime(runtime);
  const service = createLessonOrderService({ db: runtime.db, storage: runtime.storage });
  return getOrderedLessonsRuntime({
    list,
    student,
    subject,
    readOrder: service.readOrder,
    applyOrder: service.applyLessonOrder
  });
}

export async function executeSaveLessonOrder(runtime, student, subject, list) {
  requireRuntime(runtime);
  const service = createLessonOrderService({ db: runtime.db, storage: runtime.storage });
  return saveLessonOrderRuntime({
    student,
    subject,
    list,
    writeOrder: service.writeOrder,
    persistRemote: runtime.isParentLoggedIn()
  });
}

export function installLessonOrderRuntimeEntry(runtime, target = globalThis) {
  requireRuntime(runtime);
  if (!target || typeof target !== 'object') throw new Error('A runtime target is required.');
  target.pacoGOGetOrderedLessons = (list, student, subject) => executeGetOrderedLessons(runtime, list, student, subject);
  target.pacoGOSaveLessonOrder = (student, subject, list) => executeSaveLessonOrder(runtime, student, subject, list);
  return Object.freeze({
    getOrderedLessons: target.pacoGOGetOrderedLessons,
    saveLessonOrder: target.pacoGOSaveLessonOrder
  });
}
