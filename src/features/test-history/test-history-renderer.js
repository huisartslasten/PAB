export function createTestHistoryRenderer({
  getLessons,
  escapeHtml,
  documentRef = globalThis.document
} = {}) {
  if (typeof getLessons !== 'function') {
    throw new Error('A test-history lesson lookup function is required.');
  }
  if (typeof escapeHtml !== 'function') {
    throw new Error('A test-history escapeHtml function is required.');
  }
  if (!documentRef || typeof documentRef.getElementById !== 'function') {
    throw new Error('A test-history document is required.');
  }

  return function renderTestHistoryAttempts(attempts = [], studentFilter = '') {
    const el = documentRef.getElementById('testHistoryContent');
    if (!el) return;

    if (!attempts.length) {
      el.innerHTML = '<div class="card empty">' +
        (studentFilter
          ? 'Nog geen gemaakte toetsen voor ' + escapeHtml(studentFilter) + '.'
          : 'Nog geen gemaakte toetsen opgeslagen.') +
        '</div>';
      return;
    }

    const lessonMap = new Map((getLessons() || []).map(lesson => [Number(lesson.id), lesson]));

    el.innerHTML = attempts.map(attempt => {
      const lesson = lessonMap.get(Number(attempt.lesson_id));
      const pct = attempt.total_questions
        ? Math.round(attempt.score / attempt.total_questions * 100)
        : 0;
      const errors = Math.max(
        0,
        (attempt.total_questions || 0) - (attempt.score || 0)
      );
      const date = attempt.completed_at
        ? new Intl.DateTimeFormat('nl-NL', {
            dateStyle: 'medium',
            timeStyle: 'short'
          }).format(new Date(attempt.completed_at))
        : 'Onbekende datum';
      const answers = [...(attempt.test_attempt_answers || [])]
        .sort((a, b) => a.question_order - b.question_order);

      return '<details class="test-history-item"><summary><div class="test-history-main"><div><strong>' +
        escapeHtml(lesson?.subject || 'Toets') + ' — ' +
        escapeHtml(lesson?.title || ('Les ' + attempt.lesson_id)) +
        '</strong><div class="small">' + escapeHtml(attempt.student) + ' · ' + date +
        '</div></div><div class="test-history-summary"><span>' +
        attempt.total_questions + ' vragen</span><span>' + attempt.score +
        ' goed</span><span class="' + (errors ? 'history-errors' : 'history-ok') + '">' +
        errors + ' fouten</span></div></div></summary><div class="test-history-details"><div class="test-history-score">' +
        attempt.score + '/' + attempt.total_questions + ' goed (' + pct + '%)</div>' +
        answers.map(answer => '<div class="result-item ' +
          (answer.is_correct ? 'correct' : 'incorrect') + '"><strong>' +
          answer.question_order + '. ' + escapeHtml(answer.question) +
          '</strong><br>Antwoord van leerling: ' +
          escapeHtml(answer.given_answer || '—') + '<br>' +
          (answer.is_correct
            ? '✓ Goed'
            : '✗ Verwacht: ' + escapeHtml(answer.expected_answer || '—')) +
          '</div>').join('') +
        '</div></details>';
    }).join('');
  };
}
