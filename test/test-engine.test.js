import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestSession } from '../src/features/lessons/test-engine.js';

const exactGrade = async (expected, given) => ({
  correct: String(expected).trim().toLowerCase() === String(given).trim().toLowerCase()
});

test('test engine matches V4.78 word grading boundary', async () => {
  const session = createTestSession([{ question: 'Woord', answer: 'Appel' }], {
    type: 'words',
    gradeAnswer: exactGrade,
    startedAt: '2026-10-07T00:00:00.000Z'
  });
  assert.equal((await session.submit(' appel ')).correct, true);
  assert.equal((await session.submit('wrong')), null);
  assert.equal(session.result().correct, 1);
  assert.equal(session.type, 'words');
  assert.equal(session.kind, 'test');
});

test('test engine requires an injected AI grader for V4.78 word tests', async () => {
  const session = createTestSession([{ answer: 'appel' }], { type: 'words' });
  await assert.rejects(() => session.submit('appel'), /AI answer grader is required/);
});

test('test engine matches V4.78 dictation grading', async () => {
  const session = createTestSession([{ answer: 'paard' }], { type: 'dictation' });
  assert.equal((await session.submit(' PAARD ')).correct, true);
  assert.equal(session.finished, true);
});

test('test engine matches V4.78 math grading', async () => {
  const session = createTestSession([{ answer: '12' }], { type: 'math' });
  assert.equal((await session.submit('12')).correct, true);
  assert.equal(session.result().score, 100);
});

test('test engine matches V4.78 spelling grading', async () => {
  const session = createTestSession([{ answer: 'gelopen || gelopen' }], { type: 'spelling' });
  assert.equal((await session.submit('gelopen || gelopen')).correct, true);
  assert.equal(session.result().correct, 1);
});

test('test engine keeps two-part spelling answers strict', async () => {
  const session = createTestSession([{ answer: 'gelopen || gelopen' }], { type: 'spelling' });
  assert.equal((await session.submit('gelopen || gelopenx')).correct, false);
});

test('custom lessons can use deterministic grading when V4.78 AI checking is disabled', async () => {
  const session = createTestSession([{ answer: 'appel' }], {
    type: 'custom',
    aiCheckAnswers: false
  });
  assert.equal((await session.submit(' APPel ')).correct, true);
});
