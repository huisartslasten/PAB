import test from 'node:test';
import assert from 'node:assert/strict';
import { finishPlayerTest } from '../src/features/lessons/player-finish-flow.js';

test('finish flow saves history, renders result and clears activity', async () => {
  const calls = [];
  let rendered = null;
  let active = { id: 1 };

  const result = await finishPlayerTest({
    attempt: {
      lessonId: 7,
      title: 'Themawoorden',
      type: 'words',
      startedAt: '2026-10-06T01:00:00.000Z',
      finishedAt: '2026-10-06T01:02:00.000Z',
      answers: [
        { item: { id: 1, question: 'kat', answer: 'kat' }, value: 'kat', correct: true },
        { item: { id: 2, question: 'hond', answer: 'hond' }, value: 'paard', correct: false }
      ]
    },
    saveTestAttempt: async () => calls.push('save'),
    renderResult: async payload => { calls.push('render'); rendered = payload; },
    clearActivity: () => { calls.push('clear'); active = null; }
  });

  assert.deepEqual(calls, ['save', 'render', 'clear']);
  assert.equal(result.result.score, 5);
  assert.equal(rendered.result.title, '📝 Toets klaar!');
  assert.equal(active, null);
});

test('finish flow propagates history persistence failure and does not render or clear', async () => {
  const calls = [];
  const historyError = new Error('history failed');

  await assert.rejects(
    () => finishPlayerTest({
      attempt: {
        lessonId: 3,
        title: 'Dictee',
        type: 'dictation',
        answers: [{ item: { question: 'fiets', answer: 'fiets' }, value: 'fiets', correct: true }]
      },
      saveTestAttempt: async () => { calls.push('save'); throw historyError; },
      renderResult: async () => calls.push('render'),
      clearActivity: () => calls.push('clear')
    }),
    error => error === historyError
  );

  assert.deepEqual(calls, ['save']);
});

test('finish flow requires an attempt, save function and renderer', async () => {
  await assert.rejects(() => finishPlayerTest(), /test attempt is required/);
  await assert.rejects(() => finishPlayerTest({ attempt: {} }), /test-history save function is required/);
  await assert.rejects(() => finishPlayerTest({ attempt: {}, saveTestAttempt: async () => {} }), /result renderer is required/);
});
