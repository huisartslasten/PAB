import {
  getLessonSaveValidationError,
  lessonSaveValidationMessages,
  validateLessonSaveInput
} from '../src/features/lessons/lesson-save-validation.js';

describe('lesson-save-validation', () => {
  test('accepts the exact minimum valid save input', () => {
    expect(validateLessonSaveInput({
      student: 'Zyon',
      subject: 'Nederlands',
      title: 'Themawoorden',
      items: [{ question: 'Vraag', answer: 'Antwoord' }]
    })).toEqual({ valid: true, errorMessage: '' });
  });

  test.each([
    ['student', { subject: 'Nederlands', title: 'Les', items: [{}] }],
    ['subject', { student: 'Zyon', title: 'Les', items: [{}] }],
    ['title', { student: 'Zyon', subject: 'Nederlands', items: [{}] }],
    ['items', { student: 'Zyon', subject: 'Nederlands', title: 'Les', items: [] }]
  ])('rejects missing %s', (_name, input) => {
    expect(validateLessonSaveInput(input)).toEqual({
      valid: false,
      errorMessage: lessonSaveValidationMessages.required
    });
  });

  test('treats whitespace-only required fields as empty', () => {
    expect(getLessonSaveValidationError({
      student: ' Zyon ',
      subject: '   ',
      title: 'Les',
      items: [{}]
    })).toBe(lessonSaveValidationMessages.required);
  });

  test('requires an actual non-empty items array', () => {
    expect(getLessonSaveValidationError({
      student: 'Zyon',
      subject: 'Nederlands',
      title: 'Les',
      items: null
    })).toBe(lessonSaveValidationMessages.required);
  });

  test('does not inspect item contents at this boundary', () => {
    expect(getLessonSaveValidationError({
      student: 'Zyon',
      subject: 'Nederlands',
      title: 'Les',
      items: [{}]
    })).toBeNull();
  });
});
