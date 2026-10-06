import { setGuestLessonAccess } from './lesson-guest-access-runtime.js';
import {
  findGuestByName,
  findGuestLessonAssignment,
  updateGuestLessonAssignment,
  createGuestLessonAssignment
} from './lesson-guest-access-write-service.js';

const REQUIRED_BRIDGE_KEYS = Object.freeze([
  'requireParent',
  'currentStudent',
  'db',
  'renderParentStudent',
  'showMessage'
]);

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A V4.78 guest-lesson runtime bridge is required.');
  }
  for (const key of REQUIRED_BRIDGE_KEYS) {
    if (!(key in runtime)) throw new Error(`The guest-lesson runtime bridge is missing: ${key}.`);
  }
  return runtime;
}

export async function executeSetGuestLessonAccess(runtime, lessonId, active) {
  const bridge = requireRuntime(runtime);
  return setGuestLessonAccess({
    authorize: bridge.requireParent,
    currentStudent: bridge.currentStudent,
    lessonId,
    active,
    findGuest: ({ guestName }) => findGuestByName({ db: bridge.db, guestName }),
    findAssignment: ({ guestId, lessonId: id }) => findGuestLessonAssignment({
      db: bridge.db,
      guestId,
      lessonId: id
    }),
    updateAssignment: ({ assignmentId, active: nextActive }) => updateGuestLessonAssignment({
      db: bridge.db,
      assignmentId,
      active: nextActive
    }),
    createAssignment: ({ guestId, lessonId: id, active: nextActive }) => createGuestLessonAssignment({
      db: bridge.db,
      guestId,
      lessonId: id,
      active: nextActive
    }),
    renderParentStudent: bridge.renderParentStudent,
    showMessage: bridge.showMessage
  });
}

export function installLessonGuestAccessRuntimeEntry(runtime, target = globalThis) {
  requireRuntime(runtime);
  if (!target || typeof target !== 'object') {
    throw new Error('A guest-lesson runtime target is required.');
  }
  target.setGuestLesson = (lessonId, active) => executeSetGuestLessonAccess(runtime, lessonId, active);
  return Object.freeze({ setGuestLesson: target.setGuestLesson });
}
