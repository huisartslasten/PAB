import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDictationItem,
  buildItemsForType,
  isMeaningfulItem
} from './editor-items.js';
import {
  inheritMultipleChoiceConfig,
  normalizeMultipleChoiceConfig,
  validateMultipleChoiceOptions,
  MULTIPLE_CHOICE_LIMITS
} from './multiple-choice-config.js';

test('dictation item uses one entered word as the canonical answer', () => {
  const item = buildDictationItem({ word: 'paard' });

  assert.deepEqual(item, {
    question: '',
    answer: 'paard',
    question_parts: [],
    answer_parts: [{ text: 'paard', role: 'answer' }],
    response_type: 'text',
    answer_options: []
  });
});

test('dictation item accepts existing answer data when hydrating an older lesson', () => {
  const item = buildDictationItem({ answer: 'vriend' });

  assert.equal(item.answer, 'vriend');
  assert.deepEqual(item.question_parts, []);
  assert.deepEqual(item.answer_parts, [{ text: 'vriend', role: 'answer' }]);
});

test('dictation rows without a word are not saved', () => {
  assert.equal(buildDictationItem({ word: '   ' }), null);
  assert.equal(isMeaningfulItem({ question: '', answer: '   ' }, 'dictation'), false);
});

test('dictation build keeps exact word order', () => {
  const items = buildItemsForType('dictation', [
    { word: 'appel' },
    { word: 'fiets' },
    { word: 'huis' }
  ]);

  assert.deepEqual(items.map(item => [item.sort_order, item.answer]), [
    [0, 'appel'],
    [1, 'fiets'],
    [2, 'huis']
  ]);
});

test('math keeps every valid row when an item also contains a non-tested explanation answer', () => {
  const rows = Array.from({ length: 7 }, (_, index) => ({
    question_parts: [`${index + 1} + ${index + 1} = ?`],
    answer_parts: [
      { text: String((index + 1) * 2), role: 'answer' },
      { text: `Uitleg bij som ${index + 1}`, role: 'extra' }
    ],
    response_type: 'number'
  }));

  const items = buildItemsForType('math', rows);

  assert.equal(items.length, 7);
  assert.deepEqual(items.map(item => item.sort_order), [0, 1, 2, 3, 4, 5, 6]);
  assert.deepEqual(items[0].answer_parts, [
    { text: '2', role: 'answer' },
    { text: 'Uitleg bij som 1', role: 'extra' }
  ]);
});

test('multiple choice requires a selected correct option and preserves its options', () => {
  const items = buildItemsForType('questions', [{
    question_parts: ['Welke uitkomst is juist?'],
    answer_parts: [{ text: '4', role: 'answer' }],
    response_type: 'multiple_choice',
    answer_options: ['3', '4', '5'],
    correct_option: '4'
  }]);

  assert.equal(items.length, 1);
  assert.equal(items[0].answer, '4');
  assert.deepEqual(items[0].answer_options, ['3', '4', '5']);
});

test('multiple choice rejects duplicate options in the shared policy', () => {
  const result = validateMultipleChoiceOptions({
    options: ['Parijs', 'Londen', 'Parijs', 'Rome'],
    correctOption: 'Parijs'
  });

  assert.equal(result.valid, false);
  assert.equal(result.errors.includes('Elke antwoordoptie moet uniek zijn.'), true);
});

test('multiple choice builder uses the shared option policy', () => {
  const items = buildItemsForType('questions', [{
    question_parts: ['Welke stad is de hoofdstad van Frankrijk?'],
    answer_parts: [{ text: 'Parijs', role: 'answer' }],
    response_type: 'multiple_choice',
    answer_options: ['Parijs', 'Londen', 'Rome', 'Berlijn'],
    correct_option: 'Parijs'
  }]);

  assert.equal(items.length, 1);

  const invalid = buildItemsForType('questions', [{
    question_parts: ['Welke stad is de hoofdstad van Frankrijk?'],
    answer_parts: [{ text: 'Parijs', role: 'answer' }],
    response_type: 'multiple_choice',
    answer_options: ['Parijs', 'Londen', 'Londen', 'Berlijn'],
    correct_option: 'Parijs'
  }]);

  assert.equal(invalid.length, 0);
});

test('multiple choice config has a bounded default option count', () => {
  assert.deepEqual(normalizeMultipleChoiceConfig({ enabled: true }), {
    enabled: true,
    optionCount: MULTIPLE_CHOICE_LIMITS.defaultOptionCount
  });
  assert.deepEqual(normalizeMultipleChoiceConfig({ enabled: true, optionCount: 1 }), {
    enabled: true,
    optionCount: MULTIPLE_CHOICE_LIMITS.minOptionCount
  });
  assert.deepEqual(normalizeMultipleChoiceConfig({ enabled: true, optionCount: 99 }), {
    enabled: true,
    optionCount: MULTIPLE_CHOICE_LIMITS.maxOptionCount
  });
});

test('multiple choice inheritance copies configuration only', () => {
  const previous = { enabled: true, optionCount: 6, question: 'oude vraag', answer: 'juist' };
  const inherited = inheritMultipleChoiceConfig(previous);

  assert.deepEqual(inherited, { enabled: true, optionCount: 6 });
  assert.equal('question' in inherited, false);
  assert.equal('answer' in inherited, false);
});