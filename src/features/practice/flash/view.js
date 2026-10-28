import { createPacoDropdown } from '../../../components/design-system.js';

export function createFlashView({ documentRef = globalThis.document, escapeHtml } = {}) {
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
    node.innerHTML = `<div class="progress-label"><span>Vraag ${current} van ${state.total}</span><span>${completed} gedaan</span></div><div class="progress"><div class="progress-bar"><span style="width:${pct}%"></span></div></div>`;
  }

  function renderQuestion(state, onAnswer, highScore, { timingMode = 'manual', onTimingModeChange, remainingSeconds = null } = {}) {
    const content = documentRef.getElementById('flashContent');
    if (!content || !state.item) return;
    renderStats(state, highScore);
    renderProgress(state);

    const controls = documentRef.createElement('div');
    controls.className = 'flash-controls';
    const timingControl = documentRef.createElement('div');
    timingControl.className = 'flash-timing-control';
    const label = documentRef.createElement('span');
    label.className = 'flash-timing-label';
    label.textContent = 'Tijd per vraag:';
    const dropdown = createPacoDropdown({
      options: [
        { value: 'manual', label: 'GEEN TIJDSLIMIET' },
        { value: '3', label: '3 seconden' },
        { value: '5', label: '5 seconden' }
      ],
      value: timingMode,
      onChange: nextValue => onTimingModeChange?.(nextValue),
      className: 'flash-timing-dropdown'
    });
    timingControl.appendChild(label);
    timingControl.appendChild(dropdown.element);
    controls.appendChild(timingControl);

    const timer = documentRef.createElement('div');
    timer.className = 'flash-timer';
    timer.setAttribute('aria-live', 'polite');
    timer.textContent = timingMode === 'manual' ? 'Kies rustig je antwoord.' : `${remainingSeconds ?? Number(timingMode)} seconden`;
    controls.appendChild(timer);

    content.innerHTML = '';
    content.appendChild(controls);

    const question = documentRef.createElement('div');
    question.className = 'prompt flash-question';
    question.innerHTML = escapeHtml(state.item.question);
    content.appendChild(question);

    const options = documentRef.createElement('div');
    options.className = 'flash-options';
    options.setAttribute('role', 'group');
    options.setAttribute('aria-label', 'Antwoordopties');
    options.innerHTML = state.item.options.map((option, index) => `<button type="button" class="big secondary flash-option" data-flash-answer="${index}">${escapeHtml(option)}</button>`).join('');
    content.appendChild(options);
    options.querySelectorAll('[data-flash-answer]').forEach(button => {
      button.addEventListener('click', () => {
        options.querySelectorAll('[data-flash-answer]').forEach(option => { option.disabled = true; });
        onAnswer(state.item.options[Number(button.dataset.flashAnswer)]);
      });
    });
  }

  function renderResult(state, highScore, onContinue) {
    const content = documentRef.getElementById('flashContent');
    if (!content || !state.lastResult) return;
    renderStats(state, highScore);
    renderProgress(state);
    const result = state.lastResult;
    const correct = result.correct;
    const title = correct ? '✓ GOED!' : '✕ FOUT';
    const explanation = correct ? 'Goed antwoord!' : `Het juiste antwoord is: ${escapeHtml(result.expectedAnswer)}`;
    const resultClass = correct ? 'practice-correct-answer' : 'practice-answer-review';
    const titleClass = correct ? 'practice-correct-answer-title' : 'practice-answer-review-title';
    const textClass = correct ? 'practice-correct-answer-text' : 'practice-answer-review-text';
    content.innerHTML = `<section class="${resultClass}" aria-live="polite"><div class="${titleClass}">${title}</div><div class="${textClass}">${explanation}</div><div class="flash-result-score">Score: <strong>${state.score}</strong> / ${state.maxScore}</div></section><button type="button" class="big success flash-next" data-flash-next>Volgende →</button>`;
    content.querySelector('[data-flash-next]')?.addEventListener('click', onContinue);
  }

  function renderFinished(state, highScore, onRestart, onBack) {
    const content = documentRef.getElementById('flashContent');
    if (!content) return;
    const finalHighScore = Math.max(Number(highScore) || 0, state.score);
    renderStats(state, finalHighScore);
    renderProgress(state);
    const perfect = state.maxScore > 0 && state.score === state.maxScore;
    content.innerHTML = `<section class="flash-finished"><div class="flash-finished-title">${perfect ? '🏆 Perfect!' : '🎯 Ronde klaar!'}</div><div class="flash-final-score">${state.score} / ${state.maxScore}</div><div class="flash-finished-stats"><div><span>Score</span><strong>${state.score}</strong></div><div><span>Maximum</span><strong>${state.maxScore}</strong></div><div><span>High score</span><strong>${finalHighScore}</strong></div></div><div class="flash-finished-actions"><button type="button" class="big success" data-flash-restart>Nog een keer</button><button type="button" class="big secondary" data-flash-back>← Spelletjes</button></div></section>`;
    content.querySelector('[data-flash-restart]')?.addEventListener('click', onRestart);
    content.querySelector('[data-flash-back]')?.addEventListener('click', onBack);
  }

  return Object.freeze({ renderStats, renderProgress, renderQuestion, renderResult, renderFinished });
}
