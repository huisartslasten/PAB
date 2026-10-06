import {
  moveCurrentLessonToTrash,
  archiveCurrentLesson,
  restoreArchivedLesson,
  restoreDeletedLesson
} from './lesson-recovery-runtime.js';
import { moveLessonToTrash, archiveLesson, restoreLesson } from './lesson-recovery-write-service.js';

const REQUIRED_BRIDGE_KEYS = Object.freeze([
  'requireParent',
  'currentLesson',
  'currentSubject',
  'closeDeleteModal',
  'closeArchiveModal',
  'loadLessons',
  'showSubject',
  'showParentDashboard',
  'parentSelectedStudent',
  'renderParentDashboard',
  'showMessage',
  'db'
]);

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A V4.78 lesson recovery runtime bridge is required.');
  }
  for (const key of REQUIRED_BRIDGE_KEYS) {
    if (!(key in runtime)) throw new Error(`The lesson recovery runtime bridge is missing: ${key}.`);
  }
  return runtime;
}

function buildState(runtime) {
  return {
    get currentLesson() { return runtime.currentLesson; },
    get currentSubject() { return runtime.currentSubject; },
    set currentLesson(value) { runtime.currentLesson = value; },
    set currentSubject(value) { runtime.currentSubject = value; },
    get parentSelectedStudent() { return runtime.parentSelectedStudent; },
    set currentStudent(value) { runtime.currentStudent = value; }
  };
}

export async function executeMoveCurrentLessonToTrash(runtime) {
  const bridge = requireRuntime(runtime);
  const state = buildState(bridge);
  return moveCurrentLessonToTrash({
    authorize: bridge.requireParent,
    currentLesson: state.currentLesson,
    currentSubject: state.currentSubject,
    closeModal: bridge.closeDeleteModal,
    moveToTrash: ({ lessonId }) => moveLessonToTrash({ db: bridge.db, lessonId }),
    setCurrentLesson: value => { state.currentLesson = value; },
    loadLessons: bridge.loadLessons,
    setCurrentSubject: value => { state.currentSubject = value; },
    showSubject: bridge.showSubject,
    showMessage: bridge.showMessage
  });
}

export async function executeArchiveCurrentLesson(runtime) {
  const bridge = requireRuntime(runtime);
  const state = buildState(bridge);
  return archiveCurrentLesson({
    authorize: bridge.requireParent,
    currentLesson: state.currentLesson,
    currentSubject: state.currentSubject,
    closeModal: bridge.closeArchiveModal,
    archiveLesson: ({ lessonId }) => archiveLesson({ db: bridge.db, lessonId }),
    setCurrentLesson: value => { state.currentLesson = value; },
    loadLessons: bridge.loadLessons,
    setCurrentSubject: value => { state.currentSubject = value; },
    showParentDashboard: bridge.showParentDashboard,
    showMessage: bridge.showMessage
  });
}

export async function executeRestoreArchivedLesson(runtime, lessonId) {
  const bridge = requireRuntime(runtime);
  const state = buildState(bridge);
  return restoreArchivedLesson({
    authorize: bridge.requireParent,
    lessonId,
    restoreLesson: ({ lessonId: id }) => restoreLesson({ db: bridge.db, lessonId: id }),
    loadLessons: bridge.loadLessons,
    setCurrentStudent: value => { state.currentStudent = value; },
    parentSelectedStudent: state.parentSelectedStudent,
    renderParentDashboard: bridge.renderParentDashboard,
    showMessage: bridge.showMessage
  });
}

export async function executeRestoreDeletedLesson(runtime, lessonId) {
  const bridge = requireRuntime(runtime);
  return restoreDeletedLesson({
    authorize: bridge.requireParent,
    lessonId,
    restoreLesson: ({ lessonId: id }) => restoreLesson({ db: bridge.db, lessonId: id }),
    loadLessons: bridge.loadLessons,
    showMessage: bridge.showMessage
  });
}

export function installLessonRecoveryRuntimeEntry(runtime, target = globalThis) {
  requireRuntime(runtime);
  if (!target || typeof target !== 'object') throw new Error('A lesson recovery runtime target is required.');
  target.confirmDeleteLesson = () => executeMoveCurrentLessonToTrash(runtime);
  target.confirmArchiveLesson = () => executeArchiveCurrentLesson(runtime);
  target.restoreArchivedLesson = id => executeRestoreArchivedLesson(runtime, id);
  target.restoreDeletedLesson = id => executeRestoreDeletedLesson(runtime, id);
  return Object.freeze({
    confirmDeleteLesson: target.confirmDeleteLesson,
    confirmArchiveLesson: target.confirmArchiveLesson,
    restoreArchivedLesson: target.restoreArchivedLesson,
    restoreDeletedLesson: target.restoreDeletedLesson
  });
}
