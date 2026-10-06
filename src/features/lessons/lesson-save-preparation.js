// Pure pre-coordinator seam for the V4.78 save flow.
// It combines the already-proven editor draft, collectItems() contract, and save model.
// No DOM, auth, persistence, UI, navigation, or application-state side effects.

import { collectLessonItems } from './lesson-item-collector.js';
import { buildLessonSaveRequest } from './lesson-save-adapter.js';

export function prepareLessonSaveCoreInput({
  draft,
  editorRows = []
} = {}) {
  if (!draft || typeof draft !== 'object') {
    throw new Error('A lesson editor draft is required.');
  }

  const items = collectLessonItems(draft.type, editorRows);
  const request = buildLessonSaveRequest({ draft, items });

  const coordinatorDraft = Object.freeze({
    lessonId: request.lessonId,
    student: request.lesson.student,
    subject: request.lesson.subject,
    subvak: request.lesson.subvak,
    title: request.lesson.title,
    type: request.lesson.type,
    explanation: request.lesson.explanation,
    aiCheckAnswers: request.lesson.ai_check_answers,
    aiInstruction: request.lesson.ai_instruction,
    editorLabels: request.lesson.editor_labels,
    lesson: request.lesson,
    testDate: request.testDate
  });

  return Object.freeze({
    draft: coordinatorDraft,
    items: request.items,
    collectItems: async () => request.items
  });
}
