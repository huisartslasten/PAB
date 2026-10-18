export function createMemoryView({ documentRef = document, escapeHtml = value => String(value) } = {}) {
  function render({ state, onCardSelect, onFinished, onResolve }) {
    const shell = documentRef.createElement('main');
    shell.className = 'memory-shell';

    const header = documentRef.createElement('div');
    header.className = 'memory-header';
    header.innerHTML = `<div><h1>🧠 MEMORY</h1><p>Vind de vraag en het bijbehorende antwoord.</p></div><div class="memory-turns">Beurten: <strong>${state.turnCount}</strong></div>`;
    shell.appendChild(header);

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
      button.innerHTML = visible
        ? `<span class="memory-card-type">${card.type === 'question' ? 'Vraag' : 'Antwoord'}</span><span>${escapeHtml(card.value ?? '')}</span>`
        : '<span class="memory-card-back">?</span>';
      if (state.phase === 'playing' && !state.matchedCardIds.has(card.id)) {
        button.addEventListener('click', () => onCardSelect(card.id));
      }
      grid.appendChild(button);
    });
    shell.appendChild(grid);

    if (state.phase === 'checking') {
      const status = documentRef.createElement('div');
      status.className = 'memory-status';
      status.textContent = 'Even kijken…';
      shell.appendChild(status);
      onResolve();
    }

    return shell;
  }

  return Object.freeze({ render });
}
