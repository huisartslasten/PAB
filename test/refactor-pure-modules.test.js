import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeKey, normalizeText, escapeHtml } from '../src/utils/text.js';
import { dateKey, parseDateKey, daysUntil } from '../src/utils/dates.js';
import { normalizeAgendaText, agendaSubjectKey, findAgendaLessonMatch, daysUntilAgendaDate } from '../src/features/agenda/agenda-domain.js';
import { evaluateWordAnswer } from '../src/features/wordtrainer/evaluator.js';
import { photoFileIsSupported } from '../src/features/photo-lessons/photo-session.js';

test('text utilities normalize consistently', () => {
  assert.equal(normalizeText('  maatschappij   leer  '), 'maatschappij leer');
  assert.equal(normalizeKey('Maatschappij-Léer'), 'maatschappij-leer');
  assert.equal(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('date utilities handle date keys and day differences', () => {
  const date = new Date(2026, 9, 5);
  assert.equal(dateKey(date), '2026-10-05');
  assert.equal(parseDateKey('2026-10-05').getFullYear(), 2026);
  assert.equal(daysUntil('2026-10-08', date), 3);
});

test('agenda domain normalizes text and matches subjects', () => {
  assert.equal(normalizeAgendaText('  maatschappij   leer\n\n\n toets  '), 'maatschappij leer\n\ntoets');
  assert.equal(agendaSubjectKey('Maatschappij leer'), 'maatschappij leer');
  const lessons = [{ id: 1, subject: 'Maatschappij leer' }];
  assert.equal(findAgendaLessonMatch(lessons, 'maatschappij leer')?.id, 1);
  assert.equal(daysUntilAgendaDate('2026-10-08', new Date(2026, 9, 5)), 3);
});

test('word trainer evaluation is deterministic and preserves the entered answer', () => {
  assert.deepEqual(evaluateWordAnswer('  Paard  ', 'paard'), {
    correct: true,
    answer: '  Paard  ',
    expected: 'paard',
    feedback: 'Goed!'
  });
  assert.equal(evaluateWordAnswer('paart', 'paard').correct, false);
});

test('photo lesson accepts supported image formats only', () => {
  assert.equal(photoFileIsSupported({ type: 'image/jpeg' }), true);
  assert.equal(photoFileIsSupported({ type: 'image/png' }), true);
  assert.equal(photoFileIsSupported({ type: 'application/pdf' }), false);
  assert.equal(photoFileIsSupported(null), false);
});
