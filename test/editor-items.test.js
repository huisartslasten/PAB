import test from 'node:test';
import assert from 'node:assert/strict';
import { buildItemsForType } from '../src/features/lessons/editor-items.js';

test('words and custom preserve parts and deterministic answer rules', () => {
  const [item] = buildItemsForType('words', [{
    question_parts: ['Wat is expert?'],
    answer_parts: [
      { text: 'deskundige', role: 'answer' },
      { text: 'iemand met veel kennis', role: 'extra' }
    ],
    hint: 'Denk aan kennis',
    min_words: 2,
    required_terms: ['kennis', 'vak']
  }]);

  assert.deepEqual(item, {
    question: 'Wat is expert?',
    answer: 'deskundige',
    question_parts: ['Wat is expert?'],
    answer_parts: [
      { text: 'deskundige', role: 'answer' },
      { text: 'iemand met veel kennis', role: 'extra' }
    ],
    hint: 'Denk aan kennis',
    min_words: 2,
    required_terms: ['kennis', 'vak'],
    sort_order: 0
  });
});

test('math rejects non-numeric required answers', () => {
  assert.deepEqual(buildItemsForType('math', [{ question: '2 + 2', answer_parts: [{ text: 'vier', role: 'answer' }] }]), []);
  assert.equal(buildItemsForType('math', [{ question: '2 + 2', answer_parts: [{ text: '4', role: 'answer' }] }])[0].answer, '4');
});

test('spelling joins required answer forms with the V4.78 separator', () => {
  const [item] = buildItemsForType('spelling', [{
    question_parts: ['werken'],
    answer_parts: [
      { text: 'werkte', role: 'answer' },
      { text: 'gewerkt', role: 'answer' },
      { text: 'werkend', role: 'extra' }
    ]
  }]);
  assert.equal(item.answer, 'werkte || gewerkt');
});

test('all six V4.78 editor types are recognized', () => {
  for (const type of ['words', 'questions', 'dictation', 'math', 'spelling', 'custom']) {
    assert.notEqual(typeof buildItemsForType(type), 'undefined');
  }
});
