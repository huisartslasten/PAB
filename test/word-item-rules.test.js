import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWordItemRules } from '../src/features/lessons/word-item-rules.js';

test('word item rules preserve the V4.78 normalization contract', () => {
  assert.deepEqual(normalizeWordItemRules({
    hint: '  Denk aan een huisdier  ',
    minWords: '3',
    requiredTerms: ' hond, huisdier, ,  dier '
  }), {
    hint: 'Denk aan een huisdier',
    min_words: 3,
    required_terms: ['hond', 'huisdier', 'dier']
  });
});

test('word item rules clamp negative minimum words to zero', () => {
  assert.deepEqual(normalizeWordItemRules({ minWords: '-4' }), {
    hint: '',
    min_words: 0,
    required_terms: []
  });
});

test('word item rules use zero for non-finite minimum words', () => {
  assert.deepEqual(normalizeWordItemRules({ minWords: 'geen getal' }), {
    hint: '',
    min_words: 0,
    required_terms: []
  });
});
