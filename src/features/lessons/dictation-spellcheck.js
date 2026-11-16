// Pure orchestration boundary for the V4.78 dictation spelling check during saveLesson().
// The legacy runtime warns about possible spelling problems but does not block saving.
// The actual Supabase function call is injected; this module performs no DOM or UI work.

export async function runDictationSpellcheck({ check, entries = [], subject = '' } = {}) {
  if (typeof check !== 'function') {
    throw new Error('A dictation spelling checker is required.');
  }

  const result = await check({
    entries: Array.isArray(entries) ? entries : [],
    subject: String(subject ?? '')
  });

  if (!result) {
    throw new Error('Geen antwoord van de spellingscontrole.');
  }

  return Object.freeze({
    issues: Array.isArray(result.issues) ? result.issues.slice() : []
  });
}

export function buildDictationSpellcheckEntries(rows = []) {
  return (Array.isArray(rows) ? rows : [])
    .map((row, index) => ({
      row: index + 1,
      word: String(row?.word ?? '').trim()
    }))
    .filter(entry => entry.word);
}

export function buildDictationWarning(result = {}) {
  const issues = Array.isArray(result.issues) ? result.issues : [];
  if (!issues.length) return '';

  const details = issues.map(issue => {
    const row = String(issue?.row ?? '');
    const word = String(issue?.word ?? '');
    const reason = String(issue?.reason ?? '');
    const suggestion = issue?.suggestion ? ` — Bedoel je: ${String(issue.suggestion)}?` : '';
    return `Rij ${row} — ${word}: ${reason}${suggestion}`;
  });

  return [
    'AI-waarschuwing — mogelijke spellingproblemen:',
    '',
    ...details,
    '',
    'De woorden zijn niet aangepast. De ouder blijft verantwoordelijk en kan deze waarschuwing negeren.'
  ].join('\n');
}

export const DICTATION_SPELLCHECK_UNAVAILABLE_MESSAGE =
  'AI-spellingscontrole niet beschikbaar. De les wordt toch opgeslagen; de ouder blijft verantwoordelijk.';
