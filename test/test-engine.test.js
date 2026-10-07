import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestSession } from '../src/features/lessons/test-engine.js';

test('test engine matches V4.78 word grading', () => {
  const session = createTestSession([{ question: 'Woord', answer: 'Appel' }], { type: 'words', startedAt: '2026-10-07T00:00:00.000Z' });
  assert.equal(session.submit(' appel ').correct, true);
  assert.equal(session.submit('wrong'), null);
  assert.equal(session.result().correct, 1);
  assert.equal(session.type, 'words');
  assert.equal(session.kind, 'test');
});

test('test engine matches V4.78 dictation grading', () => {
  const session = createTestSession([{ answer: 'paard' }], { type: 'dictation' });
  assert.equal(session.submit(' PAARD ').correct, true);
  assert.equal(session.finished, true);
});

test('test engine matches V4.78 math grading', () => {
  const session = createTestSession([{ answer: '12' }], { type: 'math' });
  assert.equal(session.submit('12').correct, true);
  assert.equal(session.result().score, 100);
});

test('test engine matches V4.78 spelling grading', () => {
  const session = createTestSession([{ answer: 'gelopen || gelopen' }], { type: 'spelling' });
  assert.equal(session.submit('gelopen || gelopen').correct, true);
  assert.equal(session.result().correct, 1);
});

test('test engine keeps two-part spelling answers strict', () => {
  const session = createTestSession([{ answer: 'gelopen || gelopen' }], { type: 'spelling' });
  assert.equal(session.submit('gelopen || gelopenx').correct, false);
});
