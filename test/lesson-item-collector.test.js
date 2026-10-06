import test from 'node:test';
import assert from 'node:assert/strict';
import { collectLessonItems } from '../src/features/lessons/lesson-item-collector.js';

const row = (questionParts, answerParts, extra = {}) => ({
  questionParts,
  answerParts,
  ...extra
});

const answer = (text, role = 'answer') => ({ text, role });

test('collector preserves words/custom question and answer structure plus rules', () => {
  const items = collectLessonItems('words', [row(
    ['  Wat betekent  ', ' hond? '],
    [answer(' dier '), answer(' extra uitleg ', 'extra')],
    { rules: { hint: ' Denk aan een huisdier ', min_words: '3', required_terms: ['huisdier'] } }
  )]);

  assert.deepEqual(items, [{
    question: 'Wat betekent\nhond?',
    answer: 'dier',
    question_parts: ['Wat betekent', 'hond?'],
    answer_parts: [
      { text: 'dier', role: 'answer' },
      { text: 'extra uitleg', role: 'extra' }
    ],
    sort_order: 0,
    hint: 'Denk aan een huisdier',
    min_words: 3,
    required_terms: ['huisdier']
  }]);
});

test('collector excludes rows without a required answer', () => {
  const items = collectLessonItems('questions', [
    row(['Vraag'], [answer('')]),
    row([], [answer('Antwoord')]),
    row(['Geldige vraag'], [answer('Geldig antwoord')])
  ]);

  assert.deepEqual(items, [{
    question: 'Geldige vraag',
    answer: 'Geldig antwoord',
    question_parts: ['Geldige vraag'],
    answer_parts: [{ text: 'Geldig antwoord', role: 'answer' }],
    sort_order: 2
  }]);
});

test('collector uses the V4.78 spelling separator', () => {
  const items = collectLessonItems('spelling', [row(
    ['werkwoord'],
    [answer('gelopen'), answer('gelopen', 'answer'), answer('extra uitleg', 'extra')]
  )]);

  assert.equal(items[0].answer, 'gelopen || gelopen');
  assert.deepEqual(items[0].answer_parts, [
    { text: 'gelopen', role: 'answer' },
    { text: 'gelopen', role: 'answer' },
    { text: 'extra uitleg', role: 'extra' }
  ]);
});

test('collector rejects math rows when a required answer is not numeric', () => {
  const items = collectLessonItems('math', [
    row(['2 + 2'], [answer('4')]),
    row(['2 + 3'], [answer('vijf')]),
    row(['10 / 2'], [answer(' 5 '), answer('extra', 'extra')])
  ]);

  assert.deepEqual(items, [
    {
      question: '2 + 2', answer: '4', question_parts: ['2 + 2'],
      answer_parts: [{ text: '4', role: 'answer' }], sort_order: 0
    },
    {
      question: '10 / 2', answer: '5', question_parts: ['10 / 2'],
      answer_parts: [{ text: '5', role: 'answer' }, { text: 'extra', role: 'extra' }], sort_order: 2
    }
  ]);
});

test('collector keeps row order as zero-based sort_order', () => {
  const items = collectLessonItems('dictation', [
    row(['eerste'], [answer('one')]),
    row(['tweede'], [answer('two')])
  ]);

  assert.deepEqual(items.map(item => item.sort_order), [0, 1]);
});
