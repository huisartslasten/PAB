import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDictationItem,
  buildItemsForType,
  isMeaningfulItem
} from './editor-items.js';

test('dictation item uses one entered word as the canonical answer', () => {
  const item = buildDictationItem({ word: 'paard' });

  assert.deepEqual(item, {
    question: '',
    answer: 'paard',
    question_parts: [],
    answer_parts: [{ text: 'paard', role: 'answer' }]
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
