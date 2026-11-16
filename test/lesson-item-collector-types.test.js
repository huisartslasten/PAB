import { describe, expect, it } from 'vitest';
import { collectLessonItems } from '../src/features/lessons/lesson-item-collector.js';

const row = (answerParts, questionParts = ['Vraag']) => ({ questionParts, answerParts });

describe('collectLessonItems by lesson type', () => {
  it('collects questions with only answer-role parts in answer', () => {
    expect(collectLessonItems('questions', [row([
      { text: 'Antwoord', role: 'answer' },
      { text: 'Extra', role: 'extra' }
    ])])).toEqual([expect.objectContaining({
      question: 'Vraag',
      answer: 'Antwoord',
      question_parts: ['Vraag'],
      answer_parts: [
        { text: 'Antwoord', role: 'answer' },
        { text: 'Extra', role: 'extra' }
      ],
      sort_order: 0
    })]);
  });

  it('collects dictation using newline-separated required answers', () => {
    expect(collectLessonItems('dictation', [row([
      { text: 'woord1', role: 'answer' },
      { text: 'woord2', role: 'answer' }
    ])])[0].answer).toBe('woord1\nwoord2');
  });

  it('rejects math when a required answer is not numeric', () => {
    expect(collectLessonItems('math', [row([
      { text: '12', role: 'answer' },
      { text: 'abc', role: 'answer' }
    ])])).toEqual([]);
  });

  it('accepts math when every required answer is numeric', () => {
    expect(collectLessonItems('math', [row([
      { text: '12', role: 'answer' },
      { text: '3.5', role: 'answer' }
    ])])[0].answer).toBe('12\n3.5');
  });

  it('uses the V4.78 spelling separator', () => {
    expect(collectLessonItems('spelling', [row([
      { text: 'gelopen', role: 'answer' },
      { text: 'lopend', role: 'answer' }
    ])])[0].answer).toBe('gelopen || lopend');
  });

  it('preserves word/custom rules', () => {
    expect(collectLessonItems('custom', [{
      questionParts: ['Vraag'],
      answerParts: [{ text: 'Antwoord', role: 'answer' }],
      rules: { hint: 'Hint', min_words: 2, required_terms: ['woord'] }
    }])[0]).toEqual(expect.objectContaining({
      hint: 'Hint',
      min_words: 2,
      required_terms: ['woord']
    }));
  });
});
