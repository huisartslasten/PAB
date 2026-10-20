// Presentation boundary for Double or Nothing.
// The visual language follows the canonical practice-page structure while adding
// game-specific bone, record, stake and feedback presentation.

export function buildStakeOptions(score) {
  const currentScore = Math.floor(Number(score));
  if (!Number.isFinite(currentScore) || currentScore <= 0) return [];

  const amounts = [];
  for (let amount = 10; amount < currentScore; amount *= 2) {
    amounts.push(amount);
    if (amount > Number.MAX_SAFE_INTEGER / 2) break;
  }

  amounts.push(currentScore);
  return [...new Set(amounts)].filter(amount => amount <= currentScore);
}

export function createDoubleOrNothingView({ documentRef = globalThis.document, escapeHtml } = {}) {
  if (!documentRef) throw new Error('A document is required.');
  if (typeof escapeHtml !== 'function') throw new Error('An escapeHtml function is required.');

  function renderStats(state) {
    const score = documentRef.getElementById('doubleScore');
    const record = documentRef.getElementById('doubleRecord');
    const goal = documentRef.getElementById('doubleGoal');
    if (score) score.textContent = `${state.score} 🦴`;
    if (record) record.textContent = `${state.bestScore} 🏆`;
    if (goal) goal.textContent = `${state.maxScore} 🎯`;
  }

  function renderProgress(state) {
    const node = documentRef.getElementById('doubleProgress');
    if (!node) return;
    const completed = Math.min(state.index, state.total);
    const pct = state.total ? completed / state.total * 100 : 0;
    node.innerHTML = `<div class="progress-label"><span>Vraag ${Math.min(state.index + 1, state.total)} van ${state.total}</span><span>${completed} gemaakt</span></div><div class="progress"><div class="progress-bar"><span style="width:${pct}%"></span></div></div>`;
  }

  function renderStakeOptions(state) {
    const box = documentRef.getElementById('doubleStake');
    if (!box) return;
    if (state.index === 0) {
      box.innerHTML = '<div class="double-free-round">Deze eerste vraag is gratis. Goed antwoord = <strong>+10 🦴</strong>.</div>';
      return;
    }

    if (state.score === 0) {
      box.innerHTML = '<div class="double-free-round">Je hebt 0 🦴. Dit is een gratis herstelvraag. Goed antwoord = <strong>+10 🦴</strong>.</div>';
      return;
    }

    const amounts = buildStakeOptions(state.score);
    const selected = state.stake == null ? '' : `<div class="double-stake-selected">Jouw inzet: <strong>${state.stake} 🦴</strong></div>`;
    box.innerHTML = `${selected}<div class="double-stake-title">Hoeveel durf je te wagen?</div><div class="double-stake-buttons">${amounts.map(amount => `<button type="button" class="double-stake-button${amount === state.stake ? ' is-selected' : ''}" data-stake="${amount}" aria-pressed="${amount === state.stake}">${amount} 🦴</button>`).join('')}</div>`;
  }

  function renderQuestion(state, onStake, onSubmit, errorMessage = '') {
    const content = documentRef.getElementById('doubleContent');
    if (!content || !state.item) return;

    const existingAnswer = documentRef.getElementById('doubleAnswer')?.value || '';

    renderStats(state);
    renderProgress(state);
    renderStakeOptions(state);

    const disabled = state.index > 0 && state.score > 0 && state.stake == null;
    const feedback = errorMessage
      ? `<div class="feedback error" role="alert">${escapeHtml(errorMessage)}</div>`
      : '';
    content.innerHTML = `${feedback}<div class="double-prompt">${escapeHtml(state.item.question || '')}</div><div class="field"><input id="doubleAnswer" class="answer-input" autocomplete="off" placeholder="Typ je antwoord"></div><button class="success" data-practice-action="submit" type="button" ${disabled ? 'disabled' : ''}>Controleren</button>`;
    const input = documentRef.getElementById('doubleAnswer');
    const button = content.querySelector('[data-practice-action="submit"]');
    if (input) input.value = existingAnswer;
    boxStakeHandlers(onStake);
    input?.focus?.();
    button?.addEventListener('click', async () => {
      if (button.disabled) return;
      button.disabled = true;
      button.textContent = 'Controleren…';
      await onSubmit(input?.value || '');
    });
    input?.addEventListener('keydown', async event => {
      if (event.key === 'Enter' && !button?.disabled) {
        event.preventDefault();
        button.disabled = true;
        button.textContent = 'Controleren…';
        await onSubmit(input.value || '');
      }
    });
  }

  function boxStakeHandlers(onStake) {
    documentRef.querySelectorAll('[data-stake]').forEach(button => {
      button.addEventListener('click', () => onStake(Number(button.dataset.stake)));
    });
  }

  function renderResult(state, onContinue) {
    renderStats(state);
    renderProgress(state);
    const content = documentRef.getElementById('doubleContent');
    if (!content || !state.lastResult) return;
    const result = state.lastResult;
    const heading = result.correct ? '🎉 Goed gedaan!' : '🐶 Oeps!';
    const delta = result.delta >= 0 ? `+${result.delta}` : `${result.delta}`;
    content.innerHTML = `<div class="double-feedback ${result.correct ? 'correct' : 'wrong'}"><div class="double-feedback-title">${heading}</div><div>${escapeHtml(result.feedback || (result.correct ? 'Goed antwoord!' : 'Kijk goed naar het juiste antwoord.'))}</div><div class="double-score-change">${delta} 🦴 &nbsp; ${result.previousScore} → ${result.score} 🦴</div></div><div class="practice-correct-answer"><div class="practice-correct-answer-title">Juiste antwoord</div><div class="practice-correct-answer-text">${escapeHtml(result.expectedAnswer)}</div></div><button class="success" data-practice-action="submit" type="button">Volgende →</button>`;
    content.querySelector('[data-practice-action="submit"]')?.addEventListener('click', onContinue);
  }

  function renderFinished(state, onRestart, onBack) {
    renderStats(state);
    renderProgress(state);
    const content = documentRef.getElementById('doubleContent');
    if (!content) return;
    const result = state.lastResult;
    const title = state.score >= state.maxScore && state.maxScore > 0 ? '🏆 Perfect!' : '🎯 Ronde klaar!';
    const review = result
      ? `<div class="double-feedback ${result.correct ? 'correct' : 'wrong'}"><div class="double-feedback-title">${result.correct ? '🎉 Goed gedaan!' : '🐶 Oeps!'}</div><div>${escapeHtml(result.feedback || (result.correct ? 'Goed antwoord!' : 'Kijk goed naar het juiste antwoord.'))}</div><div class="double-score-change">${result.delta >= 0 ? `+${result.delta}` : result.delta} 🦴 &nbsp; ${result.previousScore} → ${result.score} 🦴</div></div><div class="practice-correct-answer"><div class="practice-correct-answer-title">Juiste antwoord</div><div class="practice-correct-answer-text">${escapeHtml(result.expectedAnswer)}</div></div>`
      : '';
    content.innerHTML = `<div class="double-finished">${review}<div class="double-finished-title">${title}</div><div class="double-final-score">${state.score} 🦴</div><p>Je beste score voor deze les is <strong>${state.bestScore} 🏆</strong>.</p><div class="double-finished-actions"><button class="success" data-double-restart type="button">Nog een keer</button><button class="secondary" data-double-back type="button">← Spelletjes</button></div></div>`;
    content.querySelector('[data-double-restart]')?.addEventListener('click', onRestart);
    content.querySelector('[data-double-back]')?.addEventListener('click', onBack);
  }

  return Object.freeze({ renderStats, renderProgress, renderQuestion, renderResult, renderFinished });
}
