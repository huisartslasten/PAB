import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLessonSaveValidationError,
  lessonSaveValidationMessages,
  validateLessonSaveInput
} from '../src/features/lessons/lesson-save-validation.js';

test('accepts the exact minimum valid save input', () => {
  assert.deepEqual(validateLessonSaveInput({
    student: 'Zyon',
    subject: 'Nederlands',
    title: 'Themawoorden',
    items: [{ question: 'Vraag', answer: 'Antwoord' }]
  }), { valid: true, errorMessage: '' });
});

test('rejects missing required fields with the V4.78 message', () => {
  for (const input of [
    { subject: 'Nederlands', title: 'Les', items: [{}] },
    { student: 'Zyon', title: 'Les', items: [{}] },
    { student: 'Zyon', subject: 'Nederlands', items: [{}] },
    { student: 'Zyon', subject: 'Nederlands', title: 'Les', items: [] }
  ]) {
    assert.deepEqual(validateLessonSaveInput(input), {
      valid: false,
      errorMessage: lessonSaveValidationMessages.required
    });
  }
});

test('treats whitespace-only required fields as empty', () => {
  assert.equal(getLessonSaveValidationError({
    student: ' Zyon ',
    subject: '   ',
    title: 'Les',
    items: [{}]
  }), lessonSaveValidationMessages.required);
});

test('requires an actual non-empty items array', () => {
  assert.equal(getLessonSaveValidationError({
    student: 'Zyon',
    subject: 'Nederlands',
    title: 'Les',
    items: null
  }), lessonSaveValidationMessages.required);
});

test('does not inspect item contents at this boundary', () => {
  assert.equal(getLessonSaveValidationError({
    student: 'Zyon',
    subject: 'Nederlands',
    title: 'Les',
    items: [{}]
  }), null);
});
