import { createPacoDropdown } from '../../../components/page-template.js';

const TILE_ASSETS = Object.freeze({
  empty: './src/features/practice/tic-tac-toe/assets/tile-empty.webp',
  X: './src/features/practice/tic-tac-toe/assets/x-tegel.png',
  O: './src/features/practice/tic-tac-toe/assets/tile-o.webp'
});

export function createTicTacToeView({ documentRef = globalThis.document, escapeHtml } = {}) {
  if (!documentRef) throw new Error('A document is required.');
  if (typeof escapeHtml !== 'function') throw new Error('An escapeHtml function is required.');

  let modeDropdown = null;
  let levelDropdown = null;
  let previousBoard = null;
  let previousMode = null;
  let boardRenderToken = 0;

  function renderBoard(state, onCell) {
    const board = documentRef.getElementById('ticTacToeBoard');
    if (!board) return;

    const renderToken = ++boardRenderToken;
    const canFadeInfiniteRemoval = state.mode === 'infinite' && previousMode === 'infinite' && Array.isArray(previousBoard);
    const fadingIndexes = new Set();

    state.board.forEach((cell, index) => {
      if (canFadeInfiniteRemoval && !cell && previousBoard[index]?.symbol) fadingIndexes.add(index);
    });

    board.innerHTML = state.board.map((cell, index) => {
      const fadingSymbol = fadingIndexes.has(index) ? previousBoard[index].symbol : null;
      const symbol = cell?.symbol === 'X' || cell?.symbol === 'O' ? cell.symbol : fadingSymbol;
      const asset = TILE_ASSETS[symbol || 'empty'];
      const isFading = fadingIndexes.has(index);
      const label = symbol ? `${symbol === 'X' ? 'PacoGO X' : 'Paco O'}${isFading ? ' verdwijnt' : ''}` : 'Leeg vakje';
      const disabled = Boolean(cell) || isFading || state.phase !== 'choosing' || state.turn !== 'X';
      return `<button type="button" class="ttt-cell${symbol ? ` is-${symbol.toLowerCase()}` : ''}" data-cell="${index}" aria-label="Vakje ${index + 1}, ${label}" ${disabled ? 'disabled' : ''}><img class="ttt-tile-image${isFading ? ' is-fading-out' : ''}" src="${asset}" alt="" draggable="false"></button>`;
    }).join('');
    board.querySelectorAll('[data-cell]').forEach(button => {
      button.addEventListener('click', () => onCell(Number(button.dataset.cell)));
    });

    previousBoard = state.board.map(cell => cell ? { ...cell } : null);
    previousMode = state.mode;

    if (fadingIndexes.size) {
      const animationDelay = 280;
      documentRef.defaultView?.setTimeout?.(() => {
        if (renderToken !== boardRenderToken) return;
        renderBoard(state, onCell);
      }, animationDelay);
    }
  }

  function renderStats(state) {
    const score = documentRef.getElementById('tttScore');
    const record = documentRef.getElementById('tttRecord');
    const progress = documentRef.getElementById('tttProgress');
    if (score) score.textContent = `${state.wins} 🏆`;
    if (record) record.textContent = `${state.bestScore} 🥇`;
    if (progress) progress.textContent = `${Math.min(state.uniqueAnswered, state.totalQuestions)} van ${state.totalQuestions} vragen`;
  }

  function renderSettings(state, modeOptions, levelOptions, onMode, onLevel) {
    const modeMount = documentRef.getElementById('tttMode');
    const levelMount = documentRef.getElementById('tttLevel');
    if (!modeMount || !levelMount) return;

    if (!modeDropdown) {
      modeDropdown = createPacoDropdown({
        options: modeOptions.map(item => ({ value: item.id, label: item.label })),
        value: state.mode,
        onChange: value => onMode(value, levelDropdown?.getValue?.() ?? state.aiLevel)
      });
      modeMount.replaceChildren(modeDropdown.element);
    } else {
      modeDropdown.setValue(state.mode);
    }

    if (!levelDropdown) {
      levelDropdown = createPacoDropdown({
        options: levelOptions.map(item => ({ value: item.id, label: item.label })),
        value: state.aiLevel,
        onChange: value => onLevel(value, modeDropdown?.getValue?.() ?? state.mode)
      });
      levelMount.replaceChildren(levelDropdown.element);
    } else {
      levelDropdown.setValue(state.aiLevel);
    }
  }

  function renderQuestion(state, onSubmit, errorMessage = '') {
    const content = documentRef.getElementById('tttContent');
    if (!content || !state.item) return;
    const feedback = errorMessage ? `<div class="feedback error" role="alert">${escapeHtml(errorMessage)}</div>` : '';
    content.innerHTML = `${feedback}<div class="ttt-turn">Jij bent aan de beurt</div><div class="ttt-prompt">${escapeHtml(state.item.question || '')}</div><div class="field"><input id="tttAnswer" class="answer-input" autocomplete="off" placeholder="Typ je antwoord"></div><button class="success" data-ttt-submit type="button">Controleren</button>`;
    const input = documentRef.getElementById('tttAnswer');
    const button = content.querySelector('[data-ttt-submit]');
    input?.focus?.();
    const submit = async () => {
      if (button?.disabled) return;
      if (button) { button.disabled = true; button.textContent = 'Controleren…'; }
      await onSubmit(input?.value || '');
    };
    button?.addEventListener('click', submit);
    input?.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); void submit(); }
    });
  }

  function renderPacoTurn(state, onPaco) {
    const content = documentRef.getElementById('tttContent');
    if (!content) return;
    content.innerHTML = '<div class="ttt-turn">🐶 Paco denkt na…</div>';
    documentRef.defaultView?.setTimeout?.(onPaco, 250);
  }

  function renderGameResult(state, onContinue) {
    const content = documentRef.getElementById('tttContent');
    if (!content) return;
    const result = state.lastResult?.gameResult;
    const title = result === 'X' ? '🏆 Jij wint!' : result === 'O' ? '🐶 Paco wint!' : '🤝 Gelijkspel!';
    const message = result === 'X' ? 'Goed gespeeld!' : result === 'O' ? 'Volgende keer pak je Paco.' : 'Niemand gaf toe.';
    content.innerHTML = `<div class="ttt-result"><div class="ttt-result-title">${title}</div><p>${message}</p><p>Score: <strong>${state.wins} 🏆</strong></p><button class="success" data-ttt-continue type="button">Volgend potje →</button></div>`;
    content.querySelector('[data-ttt-continue]')?.addEventListener('click', onContinue);
  }

  function renderFinished(state, onRestart, onBack) {
    const content = documentRef.getElementById('tttContent');
    if (!content) return;
    const result = state.lastResult?.gameResult;
    const title = result === 'X' ? '🏆 Jij wint!' : result === 'O' ? '🐶 Paco wint!' : '🤝 Gelijkspel!';
    content.innerHTML = `<div class="ttt-result"><div class="ttt-result-title">${title}</div><p>Alle vragen zijn geoefend.</p><div class="ttt-final-score">${state.wins} 🏆</div><p>Je beste score voor deze les is <strong>${state.bestScore} 🥇</strong>.</p><div class="ttt-actions"><button class="success" data-ttt-restart type="button">Nog een keer</button><button class="secondary" data-ttt-back type="button">← Spelletjes</button></div></div>`;
    content.querySelector('[data-ttt-restart]')?.addEventListener('click', onRestart);
    content.querySelector('[data-ttt-back]')?.addEventListener('click', onBack);
  }

  return Object.freeze({ renderBoard, renderStats, renderSettings, renderQuestion, renderPacoTurn, renderGameResult, renderFinished });
}
