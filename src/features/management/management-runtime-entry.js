import { createManagement } from './management.js';
import { createLessonService } from '../../services/lesson-service.js';
import { createFeedbackService } from '../../services/feedback-service.js';

const REQUIRED_KEYS = Object.freeze(['db', 'isParent', 'loadLessons']);
const MANAGEMENT_ACTIONS = Object.freeze([
  'getStudents',
  'selectStudent',
  'getSelectedStudent',
  'loadLessons',
  'getScopedLessons',
  'getAllScopedLessons',
  'getRecoveryLessons',
  'createLesson',
  'updateLesson',
  'archiveLesson',
  'moveToTrash',
  'restoreLesson',
  'listFeedback',
  'submitFeedback',
  'updateFeedbackStatus'
]);

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A management runtime bridge is required.');
  }
  for (const key of REQUIRED_KEYS) {
    if (!(key in runtime)) throw new Error(`The management runtime bridge is missing: ${key}.`);
  }
  if (!runtime.db) throw new Error('The management runtime bridge is missing: db.');
  if (typeof runtime.isParent !== 'function') {
    throw new Error('The management runtime bridge is missing: isParent function.');
  }
  if (typeof runtime.loadLessons !== 'function') {
    throw new Error('The management runtime bridge is missing: loadLessons function.');
  }
}

export function createManagementRuntime(runtime) {
  requireRuntime(runtime);
  const lessonService = createLessonService(runtime.db);
  const feedbackService = createFeedbackService(runtime.db);

  return createManagement({
    auth: {
      get isParent() {
        return Boolean(runtime.isParent());
      }
    },
    lessonService,
    feedbackService,
    loadLessons: runtime.loadLessons
  });
}

export function executeManagementAction(runtime, action, ...args) {
  const management = createManagementRuntime(runtime);
  if (!MANAGEMENT_ACTIONS.includes(action)) {
    throw new Error(`Unknown management action: ${action}.`);
  }
  return management[action](...args);
}

export function installManagementRuntimeEntry(runtime, target = globalThis) {
  requireRuntime(runtime);
  if (!target || typeof target !== 'object') {
    throw new Error('A management runtime target is required.');
  }

  const entries = Object.freeze({
    getStudents: (...args) => executeManagementAction(runtime, 'getStudents', ...args),
    selectStudent: (...args) => executeManagementAction(runtime, 'selectStudent', ...args),
    getSelectedStudent: (...args) => executeManagementAction(runtime, 'getSelectedStudent', ...args),
    loadLessons: (...args) => executeManagementAction(runtime, 'loadLessons', ...args),
    getScopedLessons: (...args) => executeManagementAction(runtime, 'getScopedLessons', ...args),
    getAllScopedLessons: (...args) => executeManagementAction(runtime, 'getAllScopedLessons', ...args),
    getRecoveryLessons: (...args) => executeManagementAction(runtime, 'getRecoveryLessons', ...args),
    createLesson: (...args) => executeManagementAction(runtime, 'createLesson', ...args),
    updateLesson: (...args) => executeManagementAction(runtime, 'updateLesson', ...args),
    archiveLesson: (...args) => executeManagementAction(runtime, 'archiveLesson', ...args),
    moveToTrash: (...args) => executeManagementAction(runtime, 'moveToTrash', ...args),
    restoreLesson: (...args) => executeManagementAction(runtime, 'restoreLesson', ...args),
    listFeedback: (...args) => executeManagementAction(runtime, 'listFeedback', ...args),
    submitFeedback: (...args) => executeManagementAction(runtime, 'submitFeedback', ...args),
    updateFeedbackStatus: (...args) => executeManagementAction(runtime, 'updateFeedbackStatus', ...args)
  });

  target.pacoGOManagementGetStudents = entries.getStudents;
  target.pacoGOManagementSelectStudent = entries.selectStudent;
  target.pacoGOManagementGetSelectedStudent = entries.getSelectedStudent;
  target.pacoGOManagementLoadLessons = entries.loadLessons;
  target.pacoGOManagementGetScopedLessons = entries.getScopedLessons;
  target.pacoGOManagementGetAllScopedLessons = entries.getAllScopedLessons;
  target.pacoGOManagementGetRecoveryLessons = entries.getRecoveryLessons;
  target.pacoGOManagementCreateLesson = entries.createLesson;
  target.pacoGOManagementUpdateLesson = entries.updateLesson;
  target.pacoGOManagementArchiveLesson = entries.archiveLesson;
  target.pacoGOManagementMoveToTrash = entries.moveToTrash;
  target.pacoGOManagementRestoreLesson = entries.restoreLesson;
  target.pacoGOManagementListFeedback = entries.listFeedback;
  target.pacoGOManagementSubmitFeedback = entries.submitFeedback;
  target.pacoGOManagementUpdateFeedbackStatus = entries.updateFeedbackStatus;

  return Object.freeze({
    getStudents: target.pacoGOManagementGetStudents,
    selectStudent: target.pacoGOManagementSelectStudent,
    getSelectedStudent: target.pacoGOManagementGetSelectedStudent,
    loadLessons: target.pacoGOManagementLoadLessons,
    getScopedLessons: target.pacoGOManagementGetScopedLessons,
    getAllScopedLessons: target.pacoGOManagementGetAllScopedLessons,
    getRecoveryLessons: target.pacoGOManagementGetRecoveryLessons,
    createLesson: target.pacoGOManagementCreateLesson,
    updateLesson: target.pacoGOManagementUpdateLesson,
    archiveLesson: target.pacoGOManagementArchiveLesson,
    moveToTrash: target.pacoGOManagementMoveToTrash,
    restoreLesson: target.pacoGOManagementRestoreLesson,
    listFeedback: target.pacoGOManagementListFeedback,
    submitFeedback: target.pacoGOManagementSubmitFeedback,
    updateFeedbackStatus: target.pacoGOManagementUpdateFeedbackStatus
  });
}
