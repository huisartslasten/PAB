import {
  runDictationSpellcheck,
  buildDictationSpellcheckEntries,
  buildDictationWarning,
  DICTATION_SPELLCHECK_UNAVAILABLE_MESSAGE
} from '../src/features/lessons/dictation-spellcheck.js';

describe('dictation spellcheck boundary', () => {
  test('builds V4.78 row-numbered entries and ignores empty words', () => {
    expect(buildDictationSpellcheckEntries([
      { word: 'computer' },
      { word: '  ' },
      { word: 'geschiedenis' }
    ])).toEqual([
      { row: 1, word: 'computer' },
      { row: 3, word: 'geschiedenis' }
    ]);
  });

  test('passes entries and subject to the injected checker', async () => {
    const check = jest.fn().mockResolvedValue({ issues: [] });

    await expect(runDictationSpellcheck({
      check,
      entries: [{ row: 1, word: 'computer' }],
      subject: 'Nederlands'
    })).resolves.toEqual({ issues: [] });

    expect(check).toHaveBeenCalledWith({
      entries: [{ row: 1, word: 'computer' }],
      subject: 'Nederlands'
    });
  });

  test('returns spelling issues without deciding whether saving is allowed', async () => {
    await expect(runDictationSpellcheck({
      check: async () => ({ issues: [{ row: 2, word: 'appel', reason: 'Mogelijk fout', suggestion: 'appèl' }] }),
      entries: [{ row: 2, word: 'appel' }],
      subject: 'Nederlands'
    })).resolves.toEqual({
      issues: [{ row: 2, word: 'appel', reason: 'Mogelijk fout', suggestion: 'appèl' }]
    });
  });

  test('builds the V4.78 warning content', () => {
    expect(buildDictationWarning({
      issues: [{ row: 2, word: 'appel', reason: 'Mogelijk fout', suggestion: 'appèl' }]
    })).toContain('Rij 2 — appel: Mogelijk fout — Bedoel je: appèl?');
  });

  test('empty issues produce no warning', () => {
    expect(buildDictationWarning({ issues: [] })).toBe('');
  });

  test('preserves the V4.78 unavailable-check message', () => {
    expect(DICTATION_SPELLCHECK_UNAVAILABLE_MESSAGE).toBe(
      'AI-spellingscontrole niet beschikbaar. De les wordt toch opgeslagen; de ouder blijft verantwoordelijk.'
    );
  });
});
