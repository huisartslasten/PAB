import test from 'node:test';
import assert from 'node:assert/strict';
import { buildItemsForType } from '../src/features/lessons/editor-items.js';

const cases = [
  ['words', { question_parts: ['Wat is expert?'], answer_parts: [{ text: 'deskundige', role: 'answer' }, { text: 'kenner', role: 'extra' }], hint: 'Denk aan kennis', min_words: 2, required_terms: ['kennis'] }, 'deskundige'],
  ['custom', { question_parts: ['Noem een voorbeeld'], answer_parts: [{ text: 'voorbeeld', role: 'answer' }] }, 'voorbeeld'],
  ['questions', { question_parts: ['Leg uit', 'waarom?'], answer_parts: [{ text: 'Omdat het regent', role: 'answer' }, { text: 'Extra uitleg', role: 'extra' }] }, 'Omdat het regent'],
  ['dictation', { question_parts: ['Vul het woord in'], answer_parts: [{ text: 'paard', role: 'answer' }] }, 'paard'],
  ['math', { question_parts: ['12 + 30'], answer_parts: [{ text: '42', role: 'answer' }] }, '42'],
  ['spelling', { question_parts: ['werken'], answer_parts: [{ text: 'werkte', role: 'answer' }, { text: 'gewerkt', role: 'answer' }, { text: 'werkend', role: 'extra' }] }, 'werkte || gewerkt']
];

for (const [type, row, expectedAnswer] of cases) {
  test(`${type} builds deterministic V4.78 item shape`, () => {
    const [item] = buildItemsForType(type, [row]);
    assert.ok(item);
    assert.equal(item.question, row.question_parts.join('\n'));
    assert.equal(item.answer, expectedAnswer);
    assert.deepEqual(item.question_parts, row.question_parts);
    assert.deepEqual(item.answer_parts, row.answer_parts);
    assert.equal(item.sort_order, 0);
  });
}

test('words preserve hint, min_words and required_terms', () => {
  const [item] = buildItemsForType('words', [{
    question: 'Wat is expert?', answer: 'deskundige', hint: 'Denk aan kennis', min_words: 2, required_terms: ['kennis', 'vak']
  }]);
  assert.equal(item.hint, 'Denk aan kennis');
  assert.equal(item.min_words, 2);
  assert.deepEqual(item.required_terms, ['kennis', 'vak']);
});

test('math rejects non-numeric required answers', () => {
  assert.deepEqual(buildItemsForType('math', [{
    question: '2 + 2', answer_parts: [{ text: 'vier', role: 'answer' }]
  }]), []);
});

test('extra answer parts remain persisted but are excluded from required answer', () => {
  const [item] = buildItemsForType('questions', [{
    question_parts: ['Vraag'],
    answer_parts: [{ text: 'antwoord', role: 'answer' }, { text: 'hinttekst', role: 'extra' }]
  }]);
  assert.equal(item.answer, 'antwoord');
  assert.deepEqual(item.answer_parts, [
    { text: 'antwoord', role: 'answer' },
    { text: 'hinttekst', role: 'extra' }
  ]);
});

test('preserves V4.78 source row order when an earlier row is omitted', () => {
  const items = buildItemsForType('words', [
    { question_parts: [], answer_parts: [{ text: 'genegeerd', role: 'answer' }] },
    { question_parts: ['Tweede vraag'], answer_parts: [{ text: 'tweede antwoord', role: 'answer' }] },
    { question_parts: ['Derde vraag'], answer_parts: [{ text: 'derde antwoord', role: 'answer' }] }
  ]);

  assert.deepEqual(items.map(item => item.sort_order), [1, 2]);
});
