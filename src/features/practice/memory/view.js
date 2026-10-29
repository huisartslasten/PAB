import { createPacoDropdown } from '../../../components/design-system.js';

const MEMORY_CARD_BACK_IMAGE = new URL('./paco memory.png', import.meta.url).href;

export function createMemoryView({ documentRef = document, escapeHtml = value => String(value) } = {}) {
  function render({
    root,
    state,
    bestScore = null,
    timingMode = 'manual',
    onTimingModeChange,
    onResolveTurn,
    onCardSelect,
    onFinished,
    onNextRound
  }) {
    const scope = root || documentRef;
    const grid = scope.querySelector('[data-memory-grid]');
    if (grid) {
      grid.replaceChildren();
      state.cards.forEach(card => {
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'memory-card';
        const visible = state.matchedCardIds.has(card.id) || state.firstCardId === card.id || state.secondCardId === card.id;
        button.disabled = state.phase !== 'playing' || state.matchedCardIds.has(card.id);
        if (state.matchedCardIds.has(card.id)) button.classList.add('matched');
        if (visible) button.classList.add('revealed');
        if (visible) {
          button.innerHTML = `<span class="memory-card-type">${card.type === 'question' ? 'Vraag' : 'Antwoord'}</span><span>${escapeHtml(card.value ?? '')}</span>`;
        } else {
          const image = documentRef.createElement('img');
          image.className = 'memory-card-back-image';
          image.src = MEMORY_CARD_BACK_IMAGE;
          image.alt = 'Paco';
          button.appendChild(image);
        }
        if (state.phase === 'playing' && !state.matchedCardIds.has(card.id)) button.addEventListener('click', () => onCardSelect(card.id));
        grid.appendChild(button);
      });
    }

    const resolveButton = scope.querySelector('[data-memory-resolve]');
    if (resolveButton) {
      resolveButton.hidden = !(state.phase === 'checking' && timingMode === 'manual');
      resolveButton.onclick = onResolveTurn;
    }

    const status = scope.querySelector('[data-memory-status]');
    if (status) {
      status.hidden = state.phase !== 'checking';
      status.textContent = timingMode === 'manual' ? 'Lees rustig de twee kaartjes.' : 'Even kijken…';
    }

    const round = scope.querySelector('[data-stat="round"] strong');
    const turns = scope.querySelector('[data-stat="turns"] strong');
    const minimum = scope.querySelector('[data-stat="minimum"] strong');
    const record = scope.querySelector('[data-stat="record"] strong');
    if (round) round.textContent = `${state.roundNumber}/${state.totalRounds}`;
    if (turns) turns.textContent = String(state.turnCount);
    if (minimum) minimum.textContent = String(state.minimumTurns);
    if (record) record.textContent = bestScore == null ? '—' : String(bestScore);

    const finished = scope.querySelector('[data-memory-finished]');
    if (finished) {
      finished.hidden = state.phase !== 'finished';
      if (state.phase === 'finished') {
        finished.querySelector('[data-memory-finished-text]').textContent = `Je hebt alle ${state.totalPairs} paren gevonden in ${state.turnCount} beurten.`;
        finished.querySelector('[data-memory-finished-button]').onclick = onFinished;
      }
    }

    const roundFinished = scope.querySelector('[data-memory-round-finished]');
    if (roundFinished) {
      roundFinished.hidden = state.phase !== 'round-finished';
      if (state.phase === 'round-finished') {
        roundFinished.querySelector('[data-memory-round-finished-text]').textContent = `${state.roundPairs} paren gevonden. Klaar voor ronde ${state.roundNumber + 1}?`;
        roundFinished.querySelector('[data-memory-next-button]').textContent = `Volgende ronde (${state.roundNumber + 1}/${state.totalRounds})`;
        roundFinished.querySelector('[data-memory-next-button]').onclick = onNextRound;
      }
    }

    scope.querySelector('[data-memory-timing-dropdown]')?.setValue?.(timingMode);
  }

  function createTimingControl({ timingMode = 'manual', onTimingModeChange }) {
    const control = documentRef.createElement('div');
    control.className = 'memory-timing-control';
    const label = documentRef.createElement('span');
    label.className = 'memory-timing-label';
    label.textContent = 'Kaartjes laten zien:';
    const dropdown = createPacoDropdown({
      options: [
        { value: 'manual', label: 'GEEN TIJDSLIMIET' },
        { value: '3', label: '3 seconden' },
        { value: '5', label: '5 seconden' }
      ],
      value: timingMode,
      onChange: onTimingModeChange,
      className: 'memory-timing-dropdown'
    });
    dropdown.element.dataset.memoryTimingDropdown = 'true';
    dropdown.element.setValue = dropdown.setValue;
    control.append(label, dropdown.element);
    return control;
  }

  return Object.freeze({ render, createTimingControl });
}
