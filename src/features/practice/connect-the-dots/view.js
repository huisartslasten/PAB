export function createConnectTheDotsView({ documentRef = document } = {}) {
  function render(root, state, handlers = {}) {
    root.replaceChildren();

    const board = documentRef.createElement('div');
    board.className = 'ctd-board';
    board.style.setProperty('--ctd-columns', state.columns);
    board.style.setProperty('--ctd-rows', state.rows);

    const inner = documentRef.createElement('div');
    inner.className = 'ctd-board-inner';

    const horizontalStep = 100 / (state.columns - 1);
    const verticalStep = 100 / (state.rows - 1);

    const setPosition = (element, { left, top, width = 0, height = 0 }) => {
      element.style.left = `${left}%`;
      element.style.top = `${top}%`;
      if (width) element.style.width = `${width}%`;
      if (height) element.style.height = `${height}%`;
    };

    state.boxes.forEach(box => {
      const cell = documentRef.createElement('div');
      cell.className = `ctd-box${box.owner ? ` is-${box.owner.toLowerCase()}` : ''}`;
      setPosition(cell, {
        left: box.column * horizontalStep,
        top: box.row * verticalStep,
        width: horizontalStep,
        height: verticalStep
      });
      inner.appendChild(cell);
    });

    state.edges.forEach(edge => {
      const button = documentRef.createElement('button');
      button.type = 'button';
      button.className = `ctd-line ctd-line-${edge.orientation}${edge.owner ? ` is-${edge.owner.toLowerCase()}` : ''}`;
      button.disabled = Boolean(edge.owner) || state.phase !== 'choosing' || state.turn !== 'X';
      button.setAttribute('aria-label', edge.orientation === 'horizontal' ? 'Horizontale lijn' : 'Verticale lijn');
      if (!edge.owner && state.phase === 'choosing' && state.turn === 'X') {
        button.addEventListener('click', () => handlers.onEdge?.(edge.key));
      }

      if (edge.orientation === 'horizontal') {
        setPosition(button, {
          left: edge.column * horizontalStep,
          top: edge.row * verticalStep,
          width: horizontalStep
        });
      } else {
        setPosition(button, {
          left: edge.column * horizontalStep,
          top: edge.row * verticalStep,
          height: verticalStep
        });
      }
      inner.appendChild(button);
    });

    for (let row = 0; row < state.rows; row += 1) {
      for (let column = 0; column < state.columns; column += 1) {
        const dot = documentRef.createElement('span');
        dot.className = 'ctd-dot';
        setPosition(dot, {
          left: column * horizontalStep,
          top: row * verticalStep
        });
        inner.appendChild(dot);
      }
    }

    board.appendChild(inner);
    root.appendChild(board);

    const status = documentRef.createElement('div');
    status.className = 'ctd-status';
    status.setAttribute('aria-live', 'polite');
    if (state.phase === 'question') status.textContent = 'Beantwoord de vraag om jouw lijn te zetten.';
    else if (state.phase === 'paco') status.textContent = 'Paco denkt na…';
    else if (state.phase === 'finished') status.textContent = state.gameResult === 'draw' ? 'Gelijkspel!' : state.gameResult === 'X' ? 'Jij wint! 🎉' : 'Paco wint deze keer.';
    else status.textContent = 'Kies een lijn.';
    root.appendChild(status);

    return { board, status };
  }

  function renderQuestion(root, state, onSubmit, errorMessage = '') {
    root.replaceChildren();
    const question = documentRef.createElement('div');
    question.className = 'ctd-question';
    question.textContent = state.item?.question || '';
    root.appendChild(question);
    const form = documentRef.createElement('form');
    form.className = 'ctd-answer-form';
    const input = documentRef.createElement('input');
    input.type = 'text'; input.autocomplete = 'off'; input.placeholder = 'Typ je antwoord…'; input.setAttribute('aria-label', 'Antwoord op de vraag');
    const button = documentRef.createElement('button');
    button.type = 'submit'; button.className = 'success'; button.textContent = 'Controleer →';
    form.append(input, button);
    form.addEventListener('submit', event => { event.preventDefault(); onSubmit(input.value); });
    root.appendChild(form);
    if (errorMessage) { const error = documentRef.createElement('div'); error.className = 'ctd-error'; error.textContent = errorMessage; root.appendChild(error); }
  }

  function renderFeedback(root, state, onContinue) {
    root.replaceChildren();
    if (!state.lastResult) return;
    const panel = documentRef.createElement('div');
    panel.className = `ctd-feedback ${state.lastResult.correct ? 'is-correct' : 'is-wrong'}`;
    panel.innerHTML = `<strong>${state.lastResult.correct ? 'Goed gedaan!' : 'Nog niet goed.'}</strong>`;
    if (state.lastResult.expectedAnswer) { const text = documentRef.createElement('div'); text.textContent = `Goed antwoord: ${state.lastResult.expectedAnswer}`; panel.appendChild(text); }
    if (state.lastResult.feedback) { const text = documentRef.createElement('div'); text.textContent = state.lastResult.feedback; panel.appendChild(text); }
    if (state.phase !== 'finished' && state.phase !== 'paco') { const button = documentRef.createElement('button'); button.type = 'button'; button.className = 'secondary'; button.textContent = 'Verder →'; button.addEventListener('click', onContinue); panel.appendChild(button); }
    root.appendChild(panel);
  }

  return Object.freeze({ render, renderQuestion, renderFeedback });
}
