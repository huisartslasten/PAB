// Pure adapter from the V4.78 runtime/editor draft to the canonical save model.
// No DOM, persistence, UI, navigation, or application-state side effects.

import { buildLessonSaveModel } from './lesson-save-model.js';

export function buildLessonSaveRequest({
  draft,
  items = []
} = {}) {
  if (!draft || typeof draft !== 'object') {
    throw new Error('A lesson editor draft is required.');
  }

  const model = buildLessonSaveModel({
    lessonId: draft.lessonId ?? null,
    student: draft.student || '',
    subject: draft.subject || '',
    enteredSubvak: draft.enteredSubvak || '',
    existingSubvak: draft.existingSubvak || '',
    title: draft.title || '',
    type: draft.type || '',
    explanation: draft.explanation || '',
    aiCheckAnswers: draft.aiCheckAnswers === true,
    aiInstruction: draft.aiInstruction || '',
    editorLabels: draft.editorLabels ?? null,
    items,
    testDate: draft.testDate || ''
  });

  return Object.freeze(model);
}
