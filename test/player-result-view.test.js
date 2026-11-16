import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayerResultView } from '../src/features/lessons/player-result-view.js';

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}[char]));

test('V4.78 result view reproduces correct and incorrect answer rendering', () => {
  const view = createPlayerResultView({
    result: {
      title: '📝 Toets klaar!',
      score: 6.7,
      correct: 1,
      total: 2,
      answers: [
        { question: 'Eén', value: 'Eén', expected: 'Eén', correct: true },
        { question: 'Twee', value: 'Fout', expected: 'Goed antwoord', correct: false }
      ]
    },
    escapeHtml
  });

  assert.equal(view.title, '📝 Toets klaar!');
  assert.equal(view.scoreText, '6.7');
  assert.equal(view.detailsHtml,
    '<p><strong>1 van 2</strong> goed.</p>' +
    '<div class="result-item correct"><strong>1. Eén</strong><br>Jouw antwoord: Eén<br>✓ Goed</div>' +
    '<div class="result-item incorrect"><strong>2. Twee</strong><br>Jouw antwoord: Fout<br>✗ Goed antwoord: Goed antwoord</div>'
  );
});

test('V4.78 result view uses an em dash for an empty learner answer', () => {
  const view = createPlayerResultView({
    result: {
      title: '📝 Toets klaar!',
      score: 0,
      correct: 0,
      total: 1,
      answers: [{ question: 'Vraag', value: '', expected: 'Antwoord', correct: false }]
    },
    escapeHtml
  });

  assert.match(view.detailsHtml, /Jouw antwoord: —<br>✗ Goed antwoord: Antwoord/);
});

test('V4.78 result view escapes question and expected-answer HTML', () => {
  const view = createPlayerResultView({
    result: {
      title: '📝 Toets klaar!',
      score: 0,
      correct: 0,
      total: 1,
      answers: [{
        question: '<script>alert(1)</script>',
        value: '<mijn antwoord>',
        expected: '"goed" & correct',
        correct: false
      }]
    },
    escapeHtml
  });

  assert.match(view.detailsHtml, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(view.detailsHtml, /&lt;mijn antwoord&gt;/);
  assert.match(view.detailsHtml, /&quot;goed&quot; &amp; correct/);
});
