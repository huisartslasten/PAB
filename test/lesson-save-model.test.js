import { describe, expect, it } from 'vitest';
import { buildLessonSaveModel } from '../src/features/lessons/lesson-save-model.js';

describe('buildLessonSaveModel', () => {
  it('builds the exact lesson-level V4.78 payload', () => {
    expect(buildLessonSaveModel({
      student: 'Zyon',
      subject: 'Nederlands',
      enteredSubvak: 'Werkwoorden',
      existingSubvak: 'Werkwoorden',
      title: 'Testles',
      type: 'words',
      explanation: 'Uitleg',
      aiCheckAnswers: true,
      aiInstruction: 'Gebruik context',
      editorLabels: null,
      items: [{ question: 'Q', answer: 'A', min_words: 2 }],
      lessonId: 42,
      testDate: '2026-10-10'
    })).toEqual({
      lessonId: 42,
      lesson: {
        student: 'Zyon',
        subject: 'Nederlands',
        subvak: 'Werkwoorden',
        title: 'Testles',
        type: 'words',
        explanation: 'Uitleg',
        ai_check_answers: true,
        ai_instruction: 'Gebruik context',
        editor_labels: null
      },
      items: [{
        question: 'Q',
        answer: 'A',
        min_words: 2,
        hint: '',
        required_terms: []
      }],
      testDate: '2026-10-10'
    });
  });

  it('prefers the existing subvak spelling when supplied', () => {
    expect(buildLessonSaveModel({
      enteredSubvak: 'werkwoorden',
      existingSubvak: 'Werkwoorden'
    }).lesson.subvak).toBe('Werkwoorden');
  });

  it('normalizes item defaults exactly as the legacy insert path', () => {
    expect(buildLessonSaveModel({
      items: [{ min_words: 0, required_terms: ['x'] }, { min_words: null }]
    }).items).toEqual([
      { min_words: 0, required_terms: ['x'], hint: '' },
      { min_words: 0, hint: '', required_terms: [] }
    ]);
  });
});
