// Pure reconstruction of the V4.78 saveLesson() pre-persistence validation boundary.
// Contract source: TEST V4.78 backup index.html (blob de4ebcc75b1b333cc985936c86f7c654c818be24).
// No DOM access, AI calls, persistence, UI rendering, or navigation belongs here.

const REQUIRED_ERROR = 'Vul het vak, de lestitel en minstens één item in.';

export function validateLessonSaveInput({
  student = '',
  subject = '',
  title = '',
  items = []
} = {}) {
  const valid = Boolean(String(student ?? '').trim())
    && Boolean(String(subject ?? '').trim())
    && Boolean(String(title ?? '').trim())
    && Array.isArray(items)
    && items.length > 0;

  return Object.freeze({
    valid,
    errorMessage: valid ? '' : REQUIRED_ERROR
  });
}

export function getLessonSaveValidationError(args = {}) {
  const result = validateLessonSaveInput(args);
  return result.valid ? null : result.errorMessage;
}

export const lessonSaveValidationMessages = Object.freeze({
  required: REQUIRED_ERROR
});
