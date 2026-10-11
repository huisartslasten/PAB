import test from 'node:test';
import assert from 'node:assert/strict';
import { getLessonExplanation, getLessonViewItems } from '../src/features/lessons/view-model.js';

test('lesson view keeps the V4.78 explanation above the items', () => {
  assert.equal(
    getLessonExplanation({ explanation: 'Regel 1\nRegel 2' }),
    'Regel 1\nRegel 2'
  );
  assert.equal(getLessonExplanation({ explanation: '   ' }), '');
});

test('lesson view separates tested answers from V4.78 extra information', () => {
  const items = getLessonViewItems({
    lesson_items: [{
      question: 'Wat is een computer?',
      answer: 'Een apparaat.',
      answer_parts: [
        { text: 'Een apparaat.', role: 'answer' },
        { text: 'Kan informatie verwerken.', role: 'extra' },
        { text: '   ', role: 'extra' }
      ]
    }]
  });

  assert.deepEqual(items, [{
    question: 'Wat is een computer?',
    answer: 'Een apparaat.',
    extra: 'Kan informatie verwerken.'
  }]);
});

test('lesson view falls back to the canonical answer when answer parts are absent', () => {
  assert.deepEqual(
    getLessonViewItems({ lesson_items: [{ question: 'Vraag', answer: 'Antwoord' }] }),
    [{ question: 'Vraag', answer: 'Antwoord', extra: '' }]
  );
});
