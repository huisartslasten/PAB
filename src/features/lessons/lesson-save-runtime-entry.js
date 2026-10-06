// Controlled TEST runtime entry for the V4.78 lesson save flow.
// This is the only adapter that knows the legacy application globals.
// The save behavior itself remains in the proven feature boundaries.
//
// The legacy page is a classic script while this file is an ES module. Do not
// resolve classic-script lexical bindings directly from module scope. The
// classic-script bridge injects the exact V4.78 runtime dependencies instead.

import { executeLessonSaveApplication } from './lesson-save-runtime-integration.js';
import { requireParentAccess, readLessonEditorDraft } from './lesson-save-runtime-adapter.js';
import { readLessonEditorRows } from './lesson-save-dom-rows.js';
import { prepareLessonSaveCoreInput } from './lesson-save-preparation.js';
import { executeLessonSaveCore } from './lesson-save-coordinator.js';
import { createLessonWriteService } from './lesson-write-service.js';
import { validateLessonSaveInput } from './lesson-save-validation.js';
import { resolveLessonSavePostPersistence } from './lesson-save-post-persistence.js';
import { buildLessonSaveRuntimeEffects } from './lesson-save-runtime-effects.js';

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A V4.78 lesson save runtime bridge is required.');
  }
  const required = [
    'document',
    'db',
    'currentSubject',
    'currentLesson',
    'currentSession',
    'PARENT_IDS',
    'lessons',
    'currentStudent',
    'normalizeSubvakKey',
    'renderTestCalendar',
    'refreshPageSidebars',
    'showMessage',
    'showHome',
    'loadLessons',
    'checkDictationSpelling',
    'upsertTestDate',
    'removeTestDate'
  ];
  for (const key of required) {
    if (!(key in runtime)) throw new Error(`Missing V4.78 runtime bridge dependency: ${key}.`);
  }
  return runtime;
}

function buildRuntimeState(runtime) {
  return {
    get currentSubject() { return runtime.currentSubject; },
    set currentSubject(value) { runtime.currentSubject = value; },
    get currentLesson() { return runtime.currentLesson; },
    set currentLesson(value) { runtime.currentLesson = value; }
  };
}

function readEditorRows(documentRef, type) {
  return readLessonEditorRows({ documentRef, type });
}

export async function executeLessonSaveRuntimeEntry(runtime) {
  const app = requireRuntime(runtime);
  const documentRef = app.document;
  const state = buildRuntimeState(app);
  const errorElement = documentRef.getElementById('editorError');
  const writeService = createLessonWriteService(app.db);

  const runtimeEffects = buildLessonSaveRuntimeEffects({
    outcome: {
      currentSubject: app.currentSubject || '',
      currentLesson: app.currentLesson || null,
      successMessage: ''
    },
    errorElement,
    state,
    refreshTestCalendar: async () => app.renderTestCalendar(),
    refreshSidebars: async () => app.refreshPageSidebars(),
    showMessage: async (message, type) => app.showMessage(message, type)
  });

  return executeLessonSaveApplication({
    authorize: async () => requireParentAccess({
      session: app.currentSession,
      parentIds: app.PARENT_IDS,
      onDenied: message => {
        app.showMessage(message, 'error');
        app.showHome();
      }
    }),
    readDraft: async () => readLessonEditorDraft({
      documentRef,
      lessons: app.lessons,
      currentStudent: app.currentStudent,
      currentLesson: app.currentLesson,
      normalizeSubvakKey: app.normalizeSubvakKey
    }),
    prepare: async ({ draft }) => prepareLessonSaveCoreInput({
      draft,
      editorRows: readEditorRows(documentRef, draft.type)
    }),
    executeCoordinator: async input => executeLessonSaveCore({
      draft: input.draft,
      collectItems: input.collectItems,
      validate: validateLessonSaveInput,
      runDictationCheck: async () => app.checkDictationSpelling(),
      writeLesson: async request => writeService.saveLesson(request),
      reloadLessons: async () => {
        await app.loadLessons();
        return app.lessons;
      },
      resolvePostPersistence: resolveLessonSavePostPersistence,
      syncTestCalendar: async ({ action, lesson, lessonId, student, testDate }) => {
        if (action === 'upsert') app.upsertTestDate(lessonId, student, testDate, lesson);
        if (action === 'remove') app.removeTestDate(lessonId, student);
      },
      onWarning: async warning => {
        errorElement.textContent = warning;
        errorElement.classList.remove('hidden');
      },
      onWriteError: async () => {}
    }),
    runtimeEffects,
    onValidationFailure: async result => {
      if (result?.validation?.errorMessage) {
        errorElement.textContent = result.validation.errorMessage;
        errorElement.classList.remove('hidden');
      }
    },
    onPersistenceFailure: async () => {},
    onComplete: async result => {
      const outcome = result?.outcome;
      if (!outcome) return;
      app.currentSubject = outcome.currentSubject;
      app.currentLesson = null;
    }
  });
}

export function installLessonSaveRuntimeEntry(runtime) {
  const legacySaveLesson = window.saveLesson;
  window.saveLesson = async function saveLessonRuntimeEntry() {
    return executeLessonSaveRuntimeEntry(runtime);
  };
  return legacySaveLesson;
}
