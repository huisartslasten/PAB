// Presentation boundary for Flash Question.
// Scoring and question progression remain in flash-question-runtime.js.

export function createFlashQuestionView({ documentRef = globalThis.document, escapeHtml } = {}) {
  if (!documentRef) throw new Error('A document is required.');
  if (typeof escapeHtml !== 'function') throw new Error('An escapeHtml function is required.');

  function renderStats(state, highScore) {
    const score = documentRef.getElementById('flashScore');
    const maximum = documentRef.getElementById('flashMaximum');
    const record = documentRef.getElementById('flashHighScore');
    if (score) score.textContent = String(state.score);
    if (maximum) maximum.textContent = String(state.maxScore);
    if (record) record.textContent = highScore == null ? '0' : String(highScore);
  }

  function renderProgress(state) {
    const node = documentRef.getElementById('flashProgress');
    if (!node) return;
    const completed = state.phase === 'finished' ? state.total : state.index;
    const current = state.total ? Math.min(state.index + 1, state.total) : 0;
    const pct = state.total ? completed / state.total * 100 : 0;
    node.innerHTML = `<div class="flash-progress-label"><span>Vraag ${current} van ${state.total}</span><span>${completed} gedaan</span></div><div class="flash-progress"><span style="width:${pct}%"></span></div>`;
  }

  function renderQuestion(state, onAnswer, highScore) {
    const content = documentRef.getElementById('flashContent');
    if (!content || !state.item) return;

    renderStats(state, highScore);
    renderProgress(state);

    content.innerHTML = `<div class="flash-question">${escapeHtml(state.item.question)}</div><div class="flash-options" role="group" aria-label="Antwoordopties">${state.item.options.map((option, index) => `<button type="button" class="flash-option secondary" data-flash-answer="${index}">${escapeHtml(option)}</button>`).join('')}</div>`;

    content.querySelectorAll('[data-flash-answer]').forEach(button => {
      button.addEventListener('click', () => {
        content.querySelectorAll('[data-flash-answer]').forEach(option => { option.disabled = true; });
        const option = state.item.options[Number(button.dataset.flashAnswer)];
        onAnswer(option);
      });
    });
  }

  function renderResult(state, highScore, onContinue) {
    const content = documentRef.getElementById('flashContent');
    if (!content || !state.lastResult) return;

    renderStats(state, highScore);
    renderProgress(state);
    const result = state.lastResult;
    const title = result.correct ? '✓ GOED!' : '✕ FOUT';
    const className = result.correct ? 'correct' : 'wrong';
    const explanation = result.correct
      ? 'Goed antwoord!'
      : `Het juiste antwoord is: ${escapeHtml(result.expectedAnswer)}`;

    content.innerHTML = `<section class="flash-result ${className}" aria-live="polite"><div class="flash-result-title">${title}</div><div class="flash-result-text">${explanation}</div><div class="flash-result-score">Score: <strong>${state.score}</strong> / ${state.maxScore}</div></section><button type="button" class="success flash-next" data-flash-next>Volgende →</button>`;
    content.querySelector('[data-flash-next]')?.addEventListener('click', onContinue);
  }

  function renderFinished(state, highScore, onRestart, onBack) {
    const content = documentRef.getElementById('flashContent');
    if (!content) return;

    const finalHighScore = Math.max(Number(highScore) || 0, state.score);
    renderStats(state, finalHighScore);
    renderProgress(state);
    const perfect = state.maxScore > 0 && state.score === state.maxScore;

    content.innerHTML = `<section class="flash-finished"><div class="flash-finished-title">${perfect ? '🏆 Perfect!' : '🎯 Ronde klaar!'}</div><div class="flash-final-score">${state.score} / ${state.maxScore}</div><div class="flash-finished-stats"><div><span>Score</span><strong>${state.score}</strong></div><div><span>Maximum</span><strong>${state.maxScore}</strong></div><div><span>High score</span><strong>${finalHighScore}</strong></div></div><div class="flash-finished-actions"><button type="button" class="success" data-flash-restart>Nog een keer</button><button type="button" class="secondary" data-flash-back>← Spelletjes</button></div></section>`;
    content.querySelector('[data-flash-restart]')?.addEventListener('click', onRestart);
    content.querySelector('[data-flash-back]')?.addEventListener('click', onBack);
  }

  return Object.freeze({ renderStats, renderProgress, renderQuestion, renderResult, renderFinished });
}
