// Pure view-model builder for the V4.78 finishTest() result screen.
// The legacy renderer is intentionally reproduced without DOM access.

export function createPlayerResultView({ result = null, escapeHtml } = {}) {
  if (!result || typeof result !== 'object') {
    throw new Error('A player result is required.');
  }
  if (typeof escapeHtml !== 'function') {
    throw new Error('An escapeHtml function is required.');
  }

  const answers = Array.isArray(result.answers) ? result.answers : [];
  const correct = Number(result.correct) || 0;
  const total = Number(result.total) || 0;

  const detailsHtml = '<p><strong>' + correct + ' van ' + total + '</strong> goed.</p>' +
    answers.map((answer, index) =>
      '<div class="result-item ' + (answer.correct ? 'correct' : 'incorrect') + '"><strong>' +
      (index + 1) + '. ' + escapeHtml(answer.question) +
      '</strong><br>Jouw antwoord: ' + escapeHtml(answer.value || '—') +
      '<br>' + (answer.correct
        ? '✓ Goed'
        : '✗ Goed antwoord: ' + escapeHtml(answer.expected)) +
      '</div>'
    ).join('');

  return Object.freeze({
    title: result.title,
    scoreText: Number(result.score || 0).toFixed(1),
    detailsHtml
  });
}
