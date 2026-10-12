import { createManagement } from './management.js';
import { createLessonService } from '../../services/lesson-service.js';
import { createFeedbackService } from '../../services/feedback-service.js';

const REQUIRED_KEYS = Object.freeze(['db', 'isParent', 'loadLessons']);

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

export async function executeManagementFeedbackAction(runtime, action, ...args) {
  const management = createManagementRuntime(runtime);
  if (!['listFeedback', 'submitFeedback', 'updateFeedbackStatus'].includes(action)) {
    throw new Error(`Unknown management feedback action: ${action}.`);
  }
  return management[action](...args);
}

export function installManagementRuntimeEntry(runtime, target = globalThis) {
  requireRuntime(runtime);
  if (!target || typeof target !== 'object') {
    throw new Error('A management runtime target is required.');
  }

  target.pacoGOManagementListFeedback = () => executeManagementFeedbackAction(runtime, 'listFeedback');
  target.pacoGOManagementSubmitFeedback = payload => executeManagementFeedbackAction(runtime, 'submitFeedback', payload);
  target.pacoGOManagementUpdateFeedbackStatus = (id, status) => executeManagementFeedbackAction(runtime, 'updateFeedbackStatus', id, status);

  return Object.freeze({
    listFeedback: target.pacoGOManagementListFeedback,
    submitFeedback: target.pacoGOManagementSubmitFeedback,
    updateFeedbackStatus: target.pacoGOManagementUpdateFeedbackStatus
  });
}
