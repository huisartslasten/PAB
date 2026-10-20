import { createPacoDropdown } from '../../components/page-template.js';

const MEMORY_CARD_BACK_IMAGE = new URL('./paco memory.png', import.meta.url).href;

export function createMemoryView({ documentRef = document, escapeHtml = value => String(value) } = {}) {
  function render({ state, bestScore = null, timingMode = 'manual', onTimingModeChange, onResolveTurn, onCardSelect, onFinished, onNextRound }) {
    const shell = documentRef.createElement('main');
    shell.className = 'memory-shell';

    const header = documentRef.createElement('div');
    header.className = 'memory-header';
    header.innerHTML = `<div><h1>🧠 MEMORY</h1><p>Vind de vraag en het bijbehorende antwoord.</p></div>`;
    shell.appendChild(header);

    const controls = documentRef.createElement('div');
    controls.className = 'memory-controls';

    const timingControl = documentRef.createElement('div');
    timingControl.className = 'memory-timing-control';
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
      onChange: nextValue => onTimingModeChange(nextValue),
      className: 'memory-timing-dropdown'
    });
    timingControl.appendChild(label);
    timingControl.appendChild(dropdown.element);
    controls.appendChild(timingControl);

    const centerControl = documentRef.createElement('div');
    centerControl.className = 'memory-center-control';
    if (state.phase === 'checking' && timingMode === 'manual') {
      const button = documentRef.createElement('button');
      button.type = 'button';
      button.className = 'memory-primary-button memory-resolve-button';
      button.textContent = 'KLAAR VOLGENDE';
      button.addEventListener('click', onResolveTurn);
      centerControl.appendChild(button);
    }
    controls.appendChild(centerControl);

    const stats = documentRef.createElement('div');
    stats.className = 'memory-stats';
    stats.innerHTML = `
      <span>Ronde: <strong>${state.roundNumber}/${state.totalRounds}</strong></span>
      <span>Beurten: <strong>${state.turnCount}</strong></span>
      <span>Minimaal: <strong>${state.minimumTurns}</strong></span>
      <span>Beste: <strong>${bestScore ?? '—'}</strong></span>
    `;
    controls.appendChild(stats);
    shell.appendChild(controls);

    if (state.phase === 'round-finished') {
      const finished = documentRef.createElement('div');
      finished.className = 'memory-finished';
      finished.innerHTML = `<div class="memory-finished-icon">👏</div><h2>Ronde ${state.roundNumber} klaar!</h2><p>${state.roundPairs} paren gevonden. Klaar voor ronde ${state.roundNumber + 1}?</p>`;
      const button = documentRef.createElement('button');
      button.type = 'button';
      button.className = 'memory-primary-button';
      button.textContent = `Volgende ronde (${state.roundNumber + 1}/${state.totalRounds})`;
      button.addEventListener('click', onNextRound);
      finished.appendChild(button);
      shell.appendChild(finished);
      return shell;
    }

    if (state.phase === 'finished') {
      const finished = documentRef.createElement('div');
      finished.className = 'memory-finished';
      finished.innerHTML = `<div class="memory-finished-icon">🎉</div><h2>Alles gevonden!</h2><p>Je hebt alle ${state.totalPairs} paren gevonden in ${state.turnCount} beurten.</p>`;
      const button = documentRef.createElement('button');
      button.type = 'button';
      button.className = 'memory-primary-button';
      button.textContent = 'Nog een keer spelen';
      button.addEventListener('click', onFinished);
      finished.appendChild(button);
      shell.appendChild(finished);
      return shell;
    }

    const grid = documentRef.createElement('div');
    grid.className = 'memory-grid';
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
      if (state.phase === 'playing' && !state.matchedCardIds.has(card.id)) {
        button.addEventListener('click', () => onCardSelect(card.id));
      }
      grid.appendChild(button);
    });
    shell.appendChild(grid);

    if (state.phase === 'checking') {
      const status = documentRef.createElement('div');
      status.className = 'memory-status';
      status.textContent = timingMode === 'manual' ? 'Lees rustig de twee kaartjes.' : 'Even kijken…';
      shell.appendChild(status);
    }

    return shell;
  }

  return Object.freeze({ render });
}
