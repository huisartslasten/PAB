import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { collectLessonItems } from '../src/features/lessons/lesson-item-collector.js';

const row = (answerParts, questionParts = ['Vraag']) => ({ questionParts, answerParts });

function assertObjectContaining(actual, expected) {
  for (const [key, value] of Object.entries(expected)) {
    assert.deepStrictEqual(actual[key], value, `Expected property "${key}" to match`);
  }
}

describe('collectLessonItems by lesson type', () => {
  it('collects questions with only answer-role parts in answer', () => {
    const items = collectLessonItems('questions', [row([
      { text: 'Antwoord', role: 'answer' },
      { text: 'Extra', role: 'extra' }
    ])]);

    assert.equal(items.length, 1);
    assertObjectContaining(items[0], {
      question: 'Vraag',
      answer: 'Antwoord',
      question_parts: ['Vraag'],
      answer_parts: [
        { text: 'Antwoord', role: 'answer' },
        { text: 'Extra', role: 'extra' }
      ],
      sort_order: 0
    });
  });

  it('collects dictation using newline-separated required answers', () => {
    assert.equal(collectLessonItems('dictation', [row([
      { text: 'woord1', role: 'answer' },
      { text: 'woord2', role: 'answer' }
    ])])[0].answer, 'woord1\nwoord2');
  });

  it('rejects math when a required answer is not numeric', () => {
    assert.deepStrictEqual(collectLessonItems('math', [row([
      { text: '12', role: 'answer' },
      { text: 'abc', role: 'answer' }
    ])]), []);
  });

  it('accepts math when every required answer is numeric', () => {
    assert.equal(collectLessonItems('math', [row([
      { text: '12', role: 'answer' },
      { text: '3.5', role: 'answer' }
    ])])[0].answer, '12\n3.5');
  });

  it('uses the V4.78 spelling separator', () => {
    assert.equal(collectLessonItems('spelling', [row([
      { text: 'gelopen', role: 'answer' },
      { text: 'lopend', role: 'answer' }
    ])])[0].answer, 'gelopen || lopend');
  });

  it('preserves word/custom rules', () => {
    assertObjectContaining(collectLessonItems('custom', [{
      questionParts: ['Vraag'],
      answerParts: [{ text: 'Antwoord', role: 'answer' }],
      rules: { hint: 'Hint', min_words: 2, required_terms: ['woord'] }
    }])[0], {
      hint: 'Hint',
      min_words: 2,
      required_terms: ['woord']
    });
  });
});
