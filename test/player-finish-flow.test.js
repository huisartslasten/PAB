import test from 'node:test';
import assert from 'node:assert/strict';
import { finishPlayerTest } from '../src/features/lessons/player-finish-flow.js';

test('finish flow cancels speech, saves history, renders result and clears activity', async () => {
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
    cancelSpeech: () => calls.push('speech'),
    saveTestAttempt: async () => calls.push('save'),
    renderResult: async payload => { calls.push('render'); rendered = payload; },
    clearActivity: () => { calls.push('clear'); active = null; }
  });

  assert.deepEqual(calls, ['speech', 'save', 'render', 'clear']);
  assert.equal(result.result.score, 5);
  assert.equal(rendered.result.title, '📝 Toets klaar!');
  assert.equal(active, null);
  assert.equal(rendered.historyError, null);
});

test('finish flow still renders the result when history persistence fails', async () => {
  const calls = [];
  const historyError = new Error('history failed');

  const result = await finishPlayerTest({
    attempt: {
      lessonId: 3,
      title: 'Dictee',
      type: 'dictation',
      answers: [{ item: { question: 'fiets', answer: 'fiets' }, value: 'fiets', correct: true }]
    },
    saveTestAttempt: async () => { calls.push('save'); throw historyError; },
    renderResult: async payload => { calls.push('render'); assert.equal(payload.historyError, historyError); },
    clearActivity: () => calls.push('clear')
  });

  assert.deepEqual(calls, ['save', 'render', 'clear']);
  assert.equal(result.historyError, historyError);
  assert.equal(result.result.title, '✏️ Dictee klaar!');
});

test('finish flow requires an attempt, save function and renderer', async () => {
  await assert.rejects(() => finishPlayerTest(), /test attempt is required/);
  await assert.rejects(() => finishPlayerTest({ attempt: {} }), /test-history save function is required/);
  await assert.rejects(() => finishPlayerTest({ attempt: {}, saveTestAttempt: async () => {} }), /result renderer is required/);
});
