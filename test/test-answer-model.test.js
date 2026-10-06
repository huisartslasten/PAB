import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTestAnswer } from '../src/features/lessons/test-answer-model.js';

test('V4.78 spelling requires both forms', async () => {
  const item = { answer: 'gelopen || gelopen' };
  assert.equal((await evaluateTestAnswer({ type: 'spelling', item, value: 'gelopen || gelopen' })).correct, true);
  assert.equal((await evaluateTestAnswer({ type: 'spelling', item, value: 'gelopen || gelopenx' })).correct, false);
});

test('V4.78 math compares numeric values', async () => {
  assert.equal((await evaluateTestAnswer({ type: 'math', item: { answer: '42' }, value: '42' })).correct, true);
  assert.equal((await evaluateTestAnswer({ type: 'math', item: { answer: '42' }, value: '042' })).correct, true);
  assert.equal((await evaluateTestAnswer({ type: 'math', item: { answer: '42' }, value: '41' })).correct, false);
});

test('V4.78 dictation uses deterministic normalized comparison', async () => {
  assert.equal((await evaluateTestAnswer({ type: 'dictation', item: { answer: 'fiets' }, value: ' Fiets ' })).correct, true);
  assert.equal((await evaluateTestAnswer({ type: 'dictation', item: { answer: 'fiets' }, value: 'fietse' })).correct, false);
});

test('custom lesson can disable AI and use deterministic comparison', async () => {
  const result = await evaluateTestAnswer({
    type: 'custom',
    item: { question: 'Vraag', answer: 'Antwoord' },
    value: ' antwoord ',
    aiCheckAnswers: false
  });
  assert.equal(result.correct, true);
  assert.equal(result.feedback, '');
});

test('custom lesson delegates to the supplied AI grading function when enabled', async () => {
  const calls = [];
  const result = await evaluateTestAnswer({
    type: 'custom',
    item: { question: 'Vraag', answer: 'Antwoord' },
    value: 'Mijn antwoord',
    aiCheckAnswers: true,
    gradeCustomAnswer: async (...args) => {
      calls.push(args);
      return { correct: true, feedback: 'Betekenis klopt.' };
    }
  });
  assert.deepEqual(calls, [['Vraag', 'Antwoord', 'Mijn antwoord']]);
  assert.deepEqual(result, { correct: true, feedback: 'Betekenis klopt.' });
});

test('AI grading is required for non-custom word-style test answers', () => {
  assert.throws(
    () => evaluateTestAnswer({ type: 'words', item: { answer: 'goed' }, value: 'goed' }),
    /AI grading function is required/
  );
});
