import { createPacoDropdown } from '../../../components/design-system.js';
import { schedulePacoTurn } from '../practice-game-template.js';

export function createDrop4View({ documentRef = globalThis.document, escapeHtml, root = null } = {}) {
  if (!documentRef) throw new Error('A document is required.');
  if (typeof escapeHtml !== 'function') throw new Error('An escapeHtml function is required.');

  const scope = root || documentRef;
  let levelDropdown = null;

  function find(selector) { return scope.querySelector(selector); }

  function renderBoard(state, onColumn) {
    const board = find('#drop4Board');
    if (!board) return;
    board.innerHTML = state.board.map((cell, index) => {
      const row = Math.floor(index / state.columns);
      const column = index % state.columns;
      const symbol = cell || '';
      return `<button type="button" class="drop4-cell${symbol ? ` is-${symbol.toLowerCase()}` : ''}" data-column="${column}" aria-label="Rij ${row + 1}, kolom ${column + 1}${symbol ? `, ${symbol === 'X' ? 'jouw steen' : 'Paco steen'}` : ', leeg'}" ${state.phase !== 'choosing' || row !== 0 || state.board[column] || !isTopEmpty(state.board, state.columns, column) ? 'disabled' : ''}><span class="drop4-disc" aria-hidden="true"></span></button>`;
    }).join('');
    board.querySelectorAll('[data-column]').forEach(button => button.addEventListener('click', () => onColumn(Number(button.dataset.column))));
  }

  function isTopEmpty(board, columns, column) { return !board[column]; }

  function renderStats(state) {
    const score = find('[data-stat="score"] strong');
    const record = find('[data-stat="record"] strong');
    const progress = find('#drop4Progress');
    if (score) score.textContent = state.score == null ? '—' : `${state.score} 🏆`;
    if (record) record.textContent = state.bestScore == null ? '— 🥇' : `${state.bestScore} 🥇`;
    if (progress) progress.textContent = `${state.uniqueAnswered} vragen`;
  }

  function renderSettings(state, levelOptions, onLevel) {
    const mount = find('#drop4Level');
    if (!mount) return;
    if (!levelDropdown) {
      levelDropdown = createPacoDropdown({ options: levelOptions.map(item => ({ value: item.id, label: item.label })), value: state.aiLevel, onChange: onLevel });
      mount.replaceChildren(levelDropdown.element);
    } else levelDropdown.setValue(state.aiLevel);
  }

  function renderQuestion(state, onSubmit, errorMessage = '') {
    const content = find('#drop4Content');
    if (!content || !state.item) return;
    const feedback = errorMessage ? `<div class="feedback error" role="alert">${escapeHtml(errorMessage)}</div>` : '';
    content.innerHTML = `${feedback}<div class="drop4-turn">Jij bent aan de beurt</div><div class="drop4-prompt">${escapeHtml(state.item.question || '')}</div><div class="field"><input id="drop4Answer" class="answer-input" autocomplete="off" placeholder="Typ je antwoord"></div><button class="success" data-drop4-submit type="button">Controleren</button>`;
    const input = content.querySelector('#drop4Answer');
    const button = content.querySelector('[data-drop4-submit]');
    input?.focus?.();
    const submit = async () => { if (button?.disabled) return; if (button) { button.disabled = true; button.textContent = 'Controleren…'; } await onSubmit(input?.value || ''); };
    button?.addEventListener('click', submit);
    input?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); void submit(); } });
  }

  function renderPacoTurn(state, onPaco) {
    const content = find('#drop4Content');
    if (!content) return () => {};
    const answerWasWrong = state.lastResult?.correct === false;
    const answerFeedback = answerWasWrong ? `<div class="drop4-answer-feedback" role="status"><strong>❌ Niet goed</strong><span>Jouw antwoord: <b>${escapeHtml(state.lastResult.givenAnswer || '')}</b></span><span>Goed antwoord: <b>${escapeHtml(state.lastResult.expectedAnswer || '')}</b></span><button class="success" data-drop4-feedback-continue type="button">OK, verder →</button></div>` : '';
    const startThinking = () => {
      content.innerHTML = `${answerFeedback ? answerFeedback.replace(/<button[\s\S]*?<\/button>/, '') : ''}<div class="drop4-turn drop4-paco-thinking" role="status" aria-live="polite"><span class="drop4-paco-face">🐶</span><span>Paco denkt na<span class="drop4-thinking-dots" aria-hidden="true"><i></i><i></i><i></i></span></span></div>`;
      return schedulePacoTurn({ windowRef: documentRef.defaultView, onTurn: onPaco });
    };
    if (!answerWasWrong) return startThinking();
    content.innerHTML = answerFeedback;
    const continueButton = content.querySelector('[data-drop4-feedback-continue]');
    continueButton?.focus?.();
    let cancelThinking = () => {};
    const continueToPaco = () => { if (continueButton?.disabled) return; if (continueButton) { continueButton.disabled = true; continueButton.textContent = 'Even nadenken…'; } cancelThinking = startThinking(); };
    continueButton?.addEventListener('click', continueToPaco);
    return () => cancelThinking();
  }

  function renderGameResult(state, onRestart, onBack) {
    const content = find('#drop4Content');
    if (!content) return;
    const result = state.lastResult?.gameResult;
    const title = result === 'X' ? '🏆 Jij wint!' : result === 'O' ? '🐶 Paco wint!' : '🤝 Gelijkspel!';
    const message = result === 'X' ? `Je had ${state.playerTurns} beurten nodig.` : result === 'O' ? 'Geen score deze ronde. Volgende keer pak je Paco!' : 'Geen score deze ronde. Niemand gaf toe!';
    content.innerHTML = `<div class="drop4-result"><div class="drop4-result-title">${title}</div><p>${message}</p><div class="drop4-final-score">${result === 'X' ? `${state.playerTurns} 🏆` : '—'}</div><div class="drop4-actions"><button class="success" data-drop4-restart type="button">Nog een keer</button><button class="secondary" data-drop4-back type="button">← Spelletjes</button></div></div>`;
    content.querySelector('[data-drop4-restart]')?.addEventListener('click', onRestart);
    content.querySelector('[data-drop4-back]')?.addEventListener('click', onBack);
  }

  return Object.freeze({ renderBoard, renderStats, renderSettings, renderQuestion, renderPacoTurn, renderGameResult });
}
