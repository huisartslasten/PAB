import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMemoryItems } from './content-adapter.js';

test('Memory language adapter creates an audio-to-text pair for word content', () => {
  const items = buildMemoryItems({
    contentKind: 'words',
    items: [{
      answer: 'vrienden',
      content_data: { content_kind: 'words', doelwoord: 'vrienden', zin: '' }
    }]
  });

  assert.deepEqual(items, [{
    question: { type: 'audio', value: '', audioText: 'vrienden' },
    answer: { type: 'text', value: 'vrienden' }
  }]);
});

test('Memory language adapter uses the full sentence for sentence content', () => {
  const items = buildMemoryItems({
    contentKind: 'sentences',
    items: [{
      answer: 'Gisteren speelde ik buiten met mijn vrienden.',
      content_data: {
        content_kind: 'sentences',
        doelwoord: 'vrienden',
        zin: 'Gisteren speelde ik buiten met mijn vrienden.'
      }
    }]
  });

  assert.equal(items[0].question.audioText, 'Gisteren speelde ik buiten met mijn vrienden.');
  assert.equal(items[0].answer.value, 'Gisteren speelde ik buiten met mijn vrienden.');
});

test('Memory adapter keeps non-language content text based', () => {
  const items = buildMemoryItems({
    contentKind: 'questions',
    items: [{ question: 'Wat is 2 + 2?', answer: '4' }]
  });

  assert.deepEqual(items, [{
    question: { type: 'text', value: 'Wat is 2 + 2?' },
    answer: { type: 'text', value: '4' }
  }]);
});
