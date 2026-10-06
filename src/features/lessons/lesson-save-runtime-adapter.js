// Runtime boundary for the V4.78 saveLesson() application responsibilities.
// Authentication and DOM/editor extraction stay outside the core save coordinator.

export const PARENT_AUTH_ERROR_MESSAGE = 'Alleen ouders kunnen lessen wijzigen. Log eerst in.';

export function isAuthorizedParent(session, parentIds) {
  if (!session?.user?.id) return false;
  const ids = parentIds instanceof Set ? parentIds : new Set(parentIds || []);
  return ids.has(session.user.id);
}

export function requireParentAccess({ session, parentIds, onDenied } = {}) {
  const allowed = isAuthorizedParent(session, parentIds);
  if (allowed) return true;
  if (typeof onDenied === 'function') onDenied(PARENT_AUTH_ERROR_MESSAGE);
  return false;
}

function readValue(documentRef, id) {
  return String(documentRef?.getElementById?.(id)?.value || '').trim();
}

function readChecked(documentRef, id) {
  return documentRef?.getElementById?.(id)?.checked === true;
}

export function readLessonEditorDraft({
  documentRef,
  lessons = [],
  currentStudent = '',
  currentLesson = null,
  normalizeSubvakKey = value => String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('nl-NL')
} = {}) {
  if (!documentRef) throw new Error('A document reference is required.');

  const subject = readValue(documentRef, 'lessonSubject');
  const student = documentRef.querySelector?.('input[name=lessonStudent]:checked')?.value || currentStudent || '';
  const title = readValue(documentRef, 'lessonName');
  const explanation = readValue(documentRef, 'lessonExplanation');
  const type = String(documentRef.getElementById?.('lessonType')?.value || '');
  const enteredSubvak = readValue(documentRef, 'lessonSubvak');
  const existingSubvak = (lessons || []).find(lesson =>
    lesson.student === student &&
    lesson.subject === subject &&
    normalizeSubvakKey(lesson.subvak) === normalizeSubvakKey(enteredSubvak) &&
    String(lesson.subvak || '').trim()
  );
  const subvak = existingSubvak?.subvak?.trim() || enteredSubvak;
  const aiCheckAnswers = readChecked(documentRef, 'lessonAiCheckAnswers');
  const aiInstruction = readValue(documentRef, 'lessonAiInstruction');
  const editorLabels = type === 'spelling'
    ? {
        question: readValue(documentRef, 'spellingLabelQuestion') || 'Werkwoord',
        perfect: readValue(documentRef, 'spellingLabelPerfect') || 'Voltooid deelwoord',
        adjective: readValue(documentRef, 'spellingLabelAdjective') || 'Bijvoeglijk gebruikt voltooid deelwoord'
      }
    : null;
  const testDate = String(documentRef.getElementById?.('lessonTestDate')?.value || '');

  return Object.freeze({
    lessonId: currentLesson?.id ?? null,
    student,
    subject,
    enteredSubvak,
    existingSubvak: existingSubvak?.subvak?.trim() || '',
    subvak,
    title,
    type,
    explanation,
    aiCheckAnswers,
    aiInstruction,
    editorLabels,
    testDate
  });
}
