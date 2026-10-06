// Controlled TEST runtime entry for the V4.78 lesson save flow.
// This is the only adapter that knows the legacy application globals.
// The save behavior itself remains in the proven feature boundaries.

import { executeLessonSaveApplication } from './lesson-save-runtime-integration.js';
import { requireParentAccess, readLessonEditorDraft } from './lesson-save-runtime-adapter.js';
import { readLessonEditorRows } from './lesson-save-dom-rows.js';
import { prepareLessonSaveCoreInput } from './lesson-save-preparation.js';
import { executeLessonSaveCore } from './lesson-save-coordinator.js';
import { createLessonWriteService } from './lesson-write-service.js';
import { validateLessonSave } from './lesson-save-validation.js';
import { resolveLessonSavePostPersistence } from './lesson-save-post-persistence.js';
import { buildLessonSaveRuntimeEffects } from './lesson-save-runtime-effects.js';

function buildRuntimeState() {
  return {
    get currentSubject() { return currentSubject; },
    set currentSubject(value) { currentSubject = value; },
    get currentLesson() { return currentLesson; },
    set currentLesson(value) { currentLesson = value; }
  };
}

function readEditorRows(documentRef, type) {
  return readLessonEditorRows({ documentRef, type });
}

export async function executeLessonSaveRuntimeEntry() {
  const documentRef = document;
  const state = buildRuntimeState();
  const errorElement = documentRef.getElementById('editorError');
  const writeService = createLessonWriteService(db);

  const runtimeEffects = buildLessonSaveRuntimeEffects({
    outcome: {
      currentSubject: currentSubject || '',
      currentLesson: currentLesson || null,
      successMessage: ''
    },
    errorElement,
    state,
    refreshTestCalendar: async () => renderTestCalendar(),
    refreshSidebars: async () => refreshPageSidebars(),
    showMessage: async (message, type) => showMessage(message, type)
  });

  return executeLessonSaveApplication({
    authorize: async () => requireParentAccess({
      session: currentSession,
      parentIds: PARENT_IDS,
      onDenied: message => {
        showMessage(message, 'error');
        showHome();
      }
    }),
    readDraft: async () => readLessonEditorDraft({
      documentRef,
      lessons,
      currentStudent,
      currentLesson,
      normalizeSubvakKey
    }),
    prepare: async ({ draft }) => prepareLessonSaveCoreInput({
      draft,
      editorRows: readEditorRows(documentRef, draft.type)
    }),
    executeCoordinator: async input => executeLessonSaveCore({
      draft: input.draft,
      collectItems: input.collectItems,
      validate: validateLessonSave,
      runDictationCheck: async () => checkDictationSpelling(),
      writeLesson: async request => writeService.saveLesson(request),
      reloadLessons: async () => {
        await loadLessons();
        return lessons;
      },
      resolvePostPersistence: resolveLessonSavePostPersistence,
      syncTestCalendar: async ({ action, lesson, lessonId, student, testDate }) => {
        if (action === 'upsert') upsertTestDate(lessonId, student, testDate, lesson);
        if (action === 'remove') removeTestDate(lessonId, student);
      },
      onWarning: async warning => {
        errorElement.textContent = warning;
        errorElement.classList.remove('hidden');
      },
      onWriteError: async () => {}
    }),
    runtimeEffects,
    onValidationFailure: async result => {
      if (result?.validation?.message) {
        errorElement.textContent = result.validation.message;
        errorElement.classList.remove('hidden');
      }
    },
    onPersistenceFailure: async () => {},
    onComplete: async result => {
      const outcome = result?.outcome;
      if (!outcome) return;
      currentSubject = outcome.currentSubject;
      currentLesson = null;
    }
  });
}

export function installLessonSaveRuntimeEntry() {
  const legacySaveLesson = window.saveLesson;
  window.saveLesson = async function saveLessonRuntimeEntry() {
    return executeLessonSaveRuntimeEntry();
  };
  return legacySaveLesson;
}
