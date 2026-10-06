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

  it('reconstructs non-word answers using the V4.78 separator rules', () => {
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

  it('returns no models for missing lesson items', () => {
    expect(buildLessonEditItemModels('words')).toEqual([]);
  });
});
