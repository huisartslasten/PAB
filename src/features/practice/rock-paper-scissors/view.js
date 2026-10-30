export const ROCK_PAPER_SCISSORS_ASSETS = Object.freeze({
  rock: 'src/features/practice/rock-paper-scissors/assets/rock-paper-scissors-rock.png',
  paper: 'src/features/practice/rock-paper-scissors/assets/rock-paper-scissors-paper.png',
  scissors: 'src/features/practice/rock-paper-scissors/assets/rock-paper-scissors-scissors.png',
  back: 'src/features/practice/rock-paper-scissors/assets/rock-paper-scissors-card-back.png'
});

const LABELS = Object.freeze({ rock: 'ROCK', paper: 'PAPER', scissors: 'SCISSORS' });

export function createRockPaperScissorsView({ documentRef = globalThis.document, escapeHtml, root = documentRef } = {}) {
  if (!documentRef) throw new Error('A document is required.');
  if (typeof escapeHtml !== 'function') throw new Error('An escapeHtml function is required.');
  const scope = root || documentRef;

  function renderStats(state, highScore) {
    const score = scope.querySelector('[data-stat="score"] strong');
    const maximum = scope.querySelector('[data-stat="maximum"] strong');
    const record = scope.querySelector('[data-stat="highScore"] strong');
    if (score) score.textContent = String(state.score);
    if (maximum) maximum.textContent = String(state.maxScore);
    if (record) record.textContent = highScore == null ? '0' : String(highScore);
  }

  function renderProgress(state) {
    const node = scope.querySelector('[data-rps-progress]');
    if (!node) return;
    const current = state.total ? Math.min(state.index + 1, state.total) : 0;
    const completed = state.phase === 'finished' ? state.total : Math.max(0, state.index);
    const pct = state.total ? completed / state.total * 100 : 0;
    node.innerHTML = `<div class="rps-progress-label"><span>Vraag ${current} van ${state.total}</span><span>${completed} gedaan</span></div><div class="rps-progress"><span style="width:${pct}%"></span></div>`;
  }

  function renderQuestion(state, onAnswer, highScore) {
    const content = scope.querySelector('[data-rps-content]');
    if (!content || !state.item) return;
    renderStats(state, highScore);
    renderProgress(state);
    content.innerHTML = `<div class="rps-question-label">BEANTWOORD DE VRAAG</div><div class="rps-question">${escapeHtml(state.item.question)}</div><div class="rps-options" role="group" aria-label="Antwoordopties">${state.item.options.map((option, index) => `<button type="button" class="big secondary" data-rps-answer="${index}">${escapeHtml(option)}</button>`).join('')}</div>`;
    content.querySelectorAll('[data-rps-answer]').forEach(button => {
      button.addEventListener('click', () => {
        content.querySelectorAll('[data-rps-answer]').forEach(option => { option.disabled = true; });
        onAnswer(state.item.options[Number(button.dataset.rpsAnswer)]);
      });
    });
  }

  function renderChoice(state, onChoice, highScore) {
    const content = scope.querySelector('[data-rps-content]');
    if (!content) return;
    renderStats(state, highScore);
    renderProgress(state);
    content.innerHTML = `<div class="rps-question-label">KIES JOUW KAART</div><div class="rps-choice-intro">Je antwoord staat vast. Kies nu Rock, Paper of Scissors.</div><div class="rps-choice-grid">${['rock', 'paper', 'scissors'].map(choice => `<button type="button" class="rps-choice-card" data-rps-choice="${choice}"><img src="${ROCK_PAPER_SCISSORS_ASSETS[choice]}" alt="${LABELS[choice]}"><span>${LABELS[choice]}</span></button>`).join('')}</div>`;
    content.querySelectorAll('[data-rps-choice]').forEach(button => {
      button.addEventListener('click', () => {
        content.querySelectorAll('[data-rps-choice]').forEach(option => { option.disabled = true; });
        onChoice(button.dataset.rpsChoice);
      });
    });
  }

  function renderReveal(state, onReveal, highScore) {
    const content = scope.querySelector('[data-rps-content]');
    if (!content) return;
    renderStats(state, highScore);
    renderProgress(state);
    content.innerHTML = `<div class="rps-question-label">JOUW KEUZE</div><div class="rps-reveal-stage"><div class="rps-card"><img src="${ROCK_PAPER_SCISSORS_ASSETS[state.playerChoice]}" alt="Jouw ${LABELS[state.playerChoice]} kaart"><span>JIJ</span></div><div class="rps-versus">VS</div><button type="button" class="rps-card rps-card-back" data-rps-reveal><img src="${ROCK_PAPER_SCISSORS_ASSETS.back}" alt="Paco kaart achterzijde"><span>REVEAL</span></button></div><p class="rps-reveal-hint">Je keuze staat vast. Draai Paco's kaart om.</p>`;
    content.querySelector('[data-rps-reveal]')?.addEventListener('click', onReveal);
  }

  function renderResult(state, highScore, onContinue) {
    const content = scope.querySelector('[data-rps-content]');
    if (!content || !state.lastResult) return;
    renderStats(state, highScore);
    renderProgress(state);
    const answerTitle = state.lastResult.correct ? '✓ GOED!' : '✕ FOUT';
    const rpsTitle = state.lastResult.rpsResult === 'draw' ? 'Gelijkspel!' : state.lastResult.rpsResult === 'win' ? 'Jij wint!' : 'Paco wint!';
    const rpsText = `Jij: ${LABELS[state.playerChoice]} · Paco: ${LABELS[state.pacoChoice]}`;
    content.innerHTML = `<section class="rps-result"><div class="rps-answer-result ${state.lastResult.correct ? 'is-correct' : 'is-wrong'}"><strong>${answerTitle}</strong><span>${state.lastResult.correct ? '1 punt verdiend.' : `Het juiste antwoord is: ${escapeHtml(state.lastResult.expectedAnswer)}`}</span></div><div class="rps-duel-result"><strong>${rpsTitle}</strong><span>${rpsText}</span></div><div class="rps-score-line">Score: <strong>${state.score}</strong> / ${state.maxScore}</div></section><button type="button" class="big success" data-rps-next>Volgende vraag →</button>`;
    content.querySelector('[data-rps-next]')?.addEventListener('click', onContinue);
  }

  function renderFinished(state, highScore, onRestart, onBack) {
    const content = scope.querySelector('[data-rps-content]');
    if (!content) return;
    const finalHighScore = Math.max(Number(highScore) || 0, state.score);
    renderStats(state, finalHighScore);
    renderProgress(state);
    const perfect = state.maxScore > 0 && state.score === state.maxScore;
    content.innerHTML = `<section class="rps-finished"><div class="rps-finished-title">${perfect ? '🏆 Perfect!' : '🎯 Ronde klaar!'}</div><div class="rps-final-score">${state.score} / ${state.maxScore}</div><div class="rps-finished-stats"><div><span>Score</span><strong>${state.score}</strong></div><div><span>Maximum</span><strong>${state.maxScore}</strong></div><div><span>High score</span><strong>${finalHighScore}</strong></div></div><div class="rps-finished-actions"><button type="button" class="big success" data-rps-restart>Nog een keer</button><button type="button" class="big secondary" data-rps-back>← Spelletjes</button></div></section>`;
    content.querySelector('[data-rps-restart]')?.addEventListener('click', onRestart);
    content.querySelector('[data-rps-back]')?.addEventListener('click', onBack);
  }

  return Object.freeze({ renderStats, renderProgress, renderQuestion, renderChoice, renderReveal, renderResult, renderFinished });
}
