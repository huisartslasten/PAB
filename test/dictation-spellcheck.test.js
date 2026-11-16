import test from 'node:test';
import assert from 'node:assert/strict';
import {
  runDictationSpellcheck,
  buildDictationSpellcheckEntries,
  buildDictationWarning,
  DICTATION_SPELLCHECK_UNAVAILABLE_MESSAGE
} from '../src/features/lessons/dictation-spellcheck.js';

test('builds V4.78 row-numbered entries and ignores empty words', () => {
  assert.deepEqual(buildDictationSpellcheckEntries([
    { word: 'computer' },
    { word: '  ' },
    { word: 'geschiedenis' }
  ]), [
    { row: 1, word: 'computer' },
    { row: 3, word: 'geschiedenis' }
  ]);
});

test('passes entries and subject to the injected checker', async () => {
  const calls = [];
  const check = async payload => {
    calls.push(payload);
    return { issues: [] };
  };

  assert.deepEqual(await runDictationSpellcheck({
    check,
    entries: [{ row: 1, word: 'computer' }],
    subject: 'Nederlands'
  }), { issues: [] });

  assert.deepEqual(calls, [{
    entries: [{ row: 1, word: 'computer' }],
    subject: 'Nederlands'
  }]);
});

test('returns spelling issues without deciding whether saving is allowed', async () => {
  assert.deepEqual(await runDictationSpellcheck({
    check: async () => ({
      issues: [{ row: 2, word: 'appel', reason: 'Mogelijk fout', suggestion: 'appèl' }]
    }),
    entries: [{ row: 2, word: 'appel' }],
    subject: 'Nederlands'
  }), {
    issues: [{ row: 2, word: 'appel', reason: 'Mogelijk fout', suggestion: 'appèl' }]
  });
});

test('propagates checker failure so the save orchestration can catch it as non-blocking', async () => {
  const failure = new Error('functie niet beschikbaar');

  await assert.rejects(
    runDictationSpellcheck({
      check: async () => { throw failure; },
      entries: [{ row: 1, word: 'computer' }],
      subject: 'Nederlands'
    }),
    failure
  );
});

test('builds the V4.78 warning content', () => {
  assert.equal(buildDictationWarning({
    issues: [{ row: 2, word: 'appel', reason: 'Mogelijk fout', suggestion: 'appèl' }]
  }), [
    'AI-waarschuwing — mogelijke spellingproblemen:',
    '',
    'Rij 2 — appel: Mogelijk fout — Bedoel je: appèl?',
    '',
    'De woorden zijn niet aangepast. De ouder blijft verantwoordelijk en kan deze waarschuwing negeren.'
  ].join('\n'));
});

test('empty issues produce no warning', () => {
  assert.equal(buildDictationWarning({ issues: [] }), '');
});

test('preserves the V4.78 unavailable-check message', () => {
  assert.equal(
    DICTATION_SPELLCHECK_UNAVAILABLE_MESSAGE,
    'AI-spellingscontrole niet beschikbaar. De les wordt toch opgeslagen; de ouder blijft verantwoordelijk.'
  );
});
