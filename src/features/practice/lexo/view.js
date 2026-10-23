import { createPacoDropdown } from '../../../components/page-template.js';

function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

function makeButton(documentRef, label, className = '') {
  const button = documentRef.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  return button;
}

export function createLexoView({ documentRef = document } = {}) {
  function renderStats(root, state, highScore) {
    root.querySelector('#lexoDifficulty').textContent = state.difficulty.toUpperCase();
    root.querySelector('#lexoScore').textContent = String(state.score);
    root.querySelector('#lexoRecord').textContent = highScore == null ? '—' : String(highScore);
    root.querySelector('#lexoProgress').textContent = `${state.completedCount} van ${state.totalCount}`;
  }

  function renderRules(root) {
    const area = root.querySelector('#lexoRules');
    clear(area);
    const title = documentRef.createElement('strong');
    title.textContent = 'Zo speel je LEXO';
    const rules = documentRef.createElement('p');
    rules.textContent = 'Maak woorden door letters horizontaal, verticaal of diagonaal met elkaar te verbinden. Je mag een letter binnen één woord niet opnieuw gebruiken. Langere woorden leveren meer punten op.';
    area.append(title, rules);
  }

  function renderGrid(root, state) {
    const grid = root.querySelector('#lexoGrid');
    clear(grid);
    const revealed = new Set(state.anchorPath.slice(0, state.revealedCount));
    state.grid.forEach((letter, index) => {
      const tile = documentRef.createElement('div');
      tile.className = `lexo-tile${revealed.has(index) ? ' is-hint' : ''}`;
      tile.textContent = letter.toUpperCase();
      tile.setAttribute('aria-label', `Letter ${letter}`);
      grid.appendChild(tile);
    });
  }

  function renderQuestion(root, state, onAnswer, { isDictation = false, onSpeak = null } = {}) {
    const area = root.querySelector('#lexoQuestionArea');
    clear(area);
    const question = documentRef.createElement('div');
    question.className = 'lexo-question';
    if (isDictation) {
      const hint = documentRef.createElement('p');
      hint.className = 'lexo-dictation-hint';
      hint.textContent = 'Dictee: luister goed en typ het antwoord.';
      question.appendChild(hint);
      if (typeof onSpeak === 'function') {
        const speak = makeButton(documentRef, '🔊 Luister', 'secondary');
        speak.addEventListener('click', () => { void onSpeak(); });
        question.appendChild(speak);
      }
    } else {
      const text = documentRef.createElement('div');
      text.className = 'lexo-question-text';
      text.textContent = state.current?.question || '';
      question.appendChild(text);
    }
    const form = documentRef.createElement('form');
    form.className = 'lexo-answer-form';
    const input = documentRef.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.className = 'lexo-answer-input';
    input.placeholder = 'Jouw antwoord';
    input.setAttribute('aria-label', 'Antwoord op de oefenvraag');
    const button = makeButton(documentRef, 'Controleer →', 'success');
    button.type = 'submit';
    form.append(input, button);
    form.addEventListener('submit', event => {
      event.preventDefault();
      void onAnswer(input.value);
    });
    question.appendChild(form);
    area.appendChild(question);
    input.focus({ preventScroll: true });
  }

  function renderWordInput(root, state, onWord) {
    const area = root.querySelector('#lexoQuestionArea');
    clear(area);
    const prompt = documentRef.createElement('div');
    prompt.className = 'lexo-word-prompt';
    prompt.textContent = 'Goed! Kies nu één woord uit het letterveld.';
    const form = documentRef.createElement('form');
    form.className = 'lexo-word-form';
    const input = documentRef.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.className = 'lexo-word-input';
    input.placeholder = 'Typ een woord';
    input.setAttribute('aria-label', 'Woord uit het letterveld');
    const button = makeButton(documentRef, 'Woord →', 'success');
    button.type = 'submit';
    form.append(input, button);
    form.addEventListener('submit', event => {
      event.preventDefault();
      void onWord(input.value);
    });
    area.append(prompt, form);
    input.focus({ preventScroll: true });
  }

  function renderFeedback(root, state, onContinue) {
    const feedback = root.querySelector('#lexoFeedback');
    clear(feedback);
    if (!state.feedback) return;
    const box = documentRef.createElement('div');
    box.className = `lexo-feedback ${state.feedback.correct ? 'is-correct' : 'is-wrong'}`;
    let message = state.feedback.message || '';
    if (state.feedback.type === 'word' && state.feedback.correct) message = `${state.feedback.word.toUpperCase()} — +${state.feedback.points} punten`;
    if (state.feedback.type === 'word' && state.feedback.duplicate) message = state.feedback.message;
    if (state.feedback.type === 'word' && state.feedback.invalid) message = state.feedback.message;
    box.textContent = message || (state.feedback.correct ? 'Goed!' : 'Nog niet.');
    feedback.appendChild(box);
    if (state.feedback.type === 'word' && state.feedback.correct && state.phase !== 'finished') {
      const button = makeButton(documentRef, 'Verder →', 'secondary');
      button.addEventListener('click', onContinue);
      feedback.appendChild(button);
      button.focus({ preventScroll: true });
    } else if (state.feedback.type === 'exercise' && !state.feedback.correct) {
      const button = makeButton(documentRef, 'Verder →', 'secondary');
      button.addEventListener('click', onContinue);
      feedback.appendChild(button);
      button.focus({ preventScroll: true });
    }
  }

  function renderFinished(root, state, onRestart, onGames) {
    const area = root.querySelector('#lexoQuestionArea');
    clear(area);
    const title = documentRef.createElement('h2');
    title.textContent = 'LEXO klaar!';
    const text = documentRef.createElement('p');
    text.textContent = `Je vond ${state.foundWords.length} ${state.foundWords.length === 1 ? 'woord' : 'woorden'} en scoorde ${state.score} punten.`;
    const restart = makeButton(documentRef, 'Nog een keer →', 'success');
    restart.addEventListener('click', onRestart);
    const games = makeButton(documentRef, 'Terug naar spelletjes', 'secondary');
    games.addEventListener('click', onGames);
    area.append(title, text, restart, games);
  }

  function renderDifficulty(root, difficulty, onChange) {
    const mount = root.querySelector('#lexoDifficultySelect');
    clear(mount);
    const dropdown = createPacoDropdown({
      options: [
        { value: 'rookie', label: 'ROOKIE — 2 letters' },
        { value: 'goat', label: 'GOAT — 1 letter' }
      ],
      value: difficulty,
      onChange,
      className: 'lexo-dropdown'
    });
    mount.appendChild(dropdown.element);
  }

  return Object.freeze({ renderStats, renderRules, renderGrid, renderQuestion, renderWordInput, renderFeedback, renderFinished, renderDifficulty });
}
