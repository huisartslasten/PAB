import { describe, expect, it } from 'vitest';
import { buildLessonEditItemModels } from '../src/features/lessons/lesson-edit-model.js';

describe('buildLessonEditItemModels', () => {
  it('preserves word/custom question and answer parts', () => {
    const result = buildLessonEditItemModels('words', [{
      question_parts: ['Wat is dit?', 'Leg uit.'],
      answer_parts: [
        { text: 'Antwoord', role: 'answer' },
        { text: 'Extra', role: 'extra' }
      ],
      hint: 'Denk goed na',
      min_words: 3,
      required_terms: ['term1', 'term2']
    }]);

    expect(result).toEqual([{
      questionParts: ['Wat is dit?', 'Leg uit.'],
      answerParts: [
        { text: 'Antwoord', role: 'answer' },
        { text: 'Extra', role: 'extra' }
      ],
      rules: {
        hint: 'Denk goed na',
        min_words: 3,
        required_terms: ['term1', 'term2']
      }
    }]);
  });

  it('falls back to legacy question/answer fields when parts are absent', () => {
    const result = buildLessonEditItemModels('custom', [{
      question: 'Vraag',
      answer: 'Antwoord'
    }]);

    expect(result[0].questionParts).toEqual(['Vraag']);
    expect(result[0].answerParts).toEqual([{ text: 'Antwoord', role: 'answer' }]);
  });

  it('reconstructs non-word answers using the exact V4.78 separator rules', () => {
    expect(buildLessonEditItemModels('spelling', [{
      question: 'Werkwoord',
      answer: 'gelopen || lopend'
    }])[0].answerParts).toEqual([
      { text: 'gelopen', role: 'answer' },
      { text: 'lopend', role: 'answer' }
    ]);

    expect(buildLessonEditItemModels('questions', [{
      question: 'Vraag',
      answer: 'Antwoord\nUitleg'
    }])[0].answerParts).toEqual([
      { text: 'Antwoord', role: 'answer' },
      { text: 'Uitleg', role: 'answer' }
    ]);
  });

  it('returns the exact V4.78 type configuration for questions', () => {
    expect(buildLessonEditItemModels('questions', [{ question: 'Vraag', answer: '42' }])[0].config)
      .toEqual({
        editor: 'questionEditor',
        answers: 'question-answer-parts',
        answerClass: 'question-a-part',
        qLabel: 'Vraag',
        answerPlaceholder: 'Schrijf hier het antwoord of de uitleg.'
      });
  });

  it('returns the exact V4.78 type configuration for dictation and math', () => {
    expect(buildLessonEditItemModels('dictation', [{ question: 'Vraag', answer: 'antwoord' }])[0].config)
      .toEqual({
        editor: 'dictationEditor',
        answers: 'dictation-answer-parts',
        answerClass: 'dictation-a-part',
        qLabel: 'Vraag',
        answerPlaceholder: 'Vul hier het antwoord in'
      });

    expect(buildLessonEditItemModels('math', [{ question: '1+1', answer: '2' }])[0].config)
      .toEqual({
        editor: 'mathEditor',
        answers: 'math-answer-parts',
        answerClass: 'math-a-part',
        qLabel: 'Som',
        answerPlaceholder: 'Bijvoorbeeld 42'
      });
  });

  it('uses the supplied spelling question label', () => {
    expect(buildLessonEditItemModels('spelling', [{ question: 'lopen', answer: 'gelopen' }], {
      spellingQuestionLabel: 'Werkwoordsvorm'
    })[0].config.qLabel).toBe('Werkwoordsvorm');
  });

  it('returns no models for unsupported types or missing lesson items', () => {
    expect(buildLessonEditItemModels('unknown', [{ question: 'Vraag', answer: 'Antwoord' }])).toEqual([]);
    expect(buildLessonEditItemModels('words')).toEqual([]);
  });
});
