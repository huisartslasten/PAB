export function createMemoryView({ documentRef = document, escapeHtml = value => String(value) } = {}) {
  function render({ state, timingMode = 'manual', onTimingModeChange, onResolveTurn, onCardSelect, onFinished }) {
    const shell = documentRef.createElement('main');
    shell.className = 'memory-shell';

    const header = documentRef.createElement('div');
    header.className = 'memory-header';
    header.innerHTML = `<div><h1>🧠 MEMORY</h1><p>Vind de vraag en het bijbehorende antwoord.</p></div><div class="memory-turns">Beurten: <strong>${state.turnCount}</strong></div>`;
    shell.appendChild(header);

    const controls = documentRef.createElement('div');
    controls.className = 'memory-controls';
    const label = documentRef.createElement('label');
    label.className = 'memory-timing-label';
    label.textContent = 'Kaartjes laten zien:';
    const select = documentRef.createElement('select');
    select.className = 'memory-timing-select';
    select.setAttribute('aria-label', 'Tijd dat de kaartjes zichtbaar blijven');
    [
      ['manual', 'Klaar met lezen'],
      ['3', '3 seconden'],
      ['5', '5 seconden']
    ].forEach(([value, text]) => {
      const option = documentRef.createElement('option');
      option.value = value;
      option.textContent = text;
      option.selected = value === timingMode;
      select.appendChild(option);
    });
    select.addEventListener('change', () => onTimingModeChange(select.value));
    label.appendChild(select);
    controls.appendChild(label);
    shell.appendChild(controls);

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
      status.textContent = timingMode === 'manual' ? 'Lees rustig de twee kaartjes.' : 'Even kijken…';
      shell.appendChild(status);

      if (timingMode === 'manual') {
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'memory-primary-button memory-resolve-button';
        button.textContent = 'Klaar, volgende';
        button.addEventListener('click', onResolveTurn);
        shell.appendChild(button);
      }
    }

    return shell;
  }

  return Object.freeze({ render });
}
