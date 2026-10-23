import { createPacoDropdown } from '../../../components/page-template.js';
import { mountPracticeGameHelp } from '../practice-game-help.js';

function el(documentRef, tag, className = '') {
  const node = documentRef.createElement(tag);
  if (className) node.className = className;
  return node;
}

export function createWordChaseView({ documentRef = document } = {}) {
  function renderStats(root, state, highScore) {
    root.querySelector('#wcDifficulty').textContent = state.difficulty === 'rookie' ? 'ROOKIE' : 'GOAT';
    root.querySelector('#wcTurns').textContent = String(state.turns);
    root.querySelector('#wcRecord').textContent = highScore == null ? '—' : String(highScore);
    root.querySelector('#wcProgress').textContent = `${state.completedCount} van ${state.totalCount}`;
  }

  function renderTarget(root, state) {
    const panel = root.querySelector('.wc-target-panel');
    if (!panel.querySelector('.practice-game-help')) {
      mountPracticeGameHelp(panel, {
        documentRef,
        title: 'Zo speel je Word Chase',
        paragraphs: [
          'Beantwoord eerst de lesvraag goed. Daarna kun je het geheime woord van vijf letters raden.',
          'ROOKIE geeft twee letters van het geheime woord prijs. GOAT geeft één letter prijs.',
          'Groen = juiste letter op de juiste plek. Geel = juiste letter, maar op de verkeerde plek.'
        ]
      });
    }

    const node = root.querySelector('#wcTarget');
    node.replaceChildren();
    if (!state.target) return;
    const revealed = new Set(state.revealedIndices);
    [...state.target].forEach((letter, index) => {
      const tile = el(documentRef, 'span', `wc-tile ${revealed.has(index) ? 'is-revealed' : 'is-hidden'}`);
      tile.textContent = revealed.has(index) ? letter.toUpperCase() : '';
      node.appendChild(tile);
    });
  }

  function renderQuestion(root, state, onExerciseSubmit, onWordSubmit, errorMessage = '', { isDictation = false, onSpeak = null } = {}) {
    const node = root.querySelector('#wcQuestionArea');
    node.replaceChildren();
    if (!state.current) return;

    if (state.phase === 'question') {
      if (isDictation) {
        const hint = el(documentRef, 'div', 'wc-word-hint');
        hint.textContent = 'Dictee: luister goed en typ het antwoord.';
        node.appendChild(hint);
        const listen = el(documentRef, 'button', 'secondary');
        listen.type = 'button';
        listen.textContent = '🔊 Luister';
        listen.addEventListener('click', () => onSpeak?.());
        node.appendChild(listen);
      } else {
        const question = el(documentRef, 'div', 'wc-question');
        question.textContent = state.current.question;
        node.appendChild(question);
      }

      const form = el(documentRef, 'form', 'wc-answer-form');
      const input = el(documentRef, 'input', 'wc-answer-input');
      input.type = 'text';
      input.autocomplete = 'off';
      input.placeholder = 'Typ je antwoord…';
      input.setAttribute('aria-label', isDictation ? 'Typ het gedicteerde antwoord' : 'Antwoord op de oefenvraag');
      const button = el(documentRef, 'button', 'success');
      button.type = 'submit';
      button.textContent = 'Controleer →';
      form.append(input, button);
      form.addEventListener('submit', event => {
        event.preventDefault();
        onExerciseSubmit(input.value);
      });
      node.appendChild(form);
    } else if (state.phase === 'word') {
      const question = el(documentRef, 'div', 'wc-question');
      question.textContent = state.current.question;
      node.appendChild(question);
      const hint = el(documentRef, 'div', 'wc-word-hint');
      hint.textContent = 'Goed! Typ nu een geldig Nederlands woord van 5 letters.';
      node.appendChild(hint);
      const form = el(documentRef, 'form', 'wc-word-form');
      const input = el(documentRef, 'input', 'wc-word-input');
      input.type = 'text';
      input.maxLength = 5;
      input.autocomplete = 'off';
      input.placeholder = '5 letters…';
      input.setAttribute('aria-label', 'Raad een woord van vijf letters');
      const button = el(documentRef, 'button', 'success');
      button.type = 'submit';
      button.textContent = 'Raad →';
      form.append(input, button);
      form.addEventListener('submit', event => {
        event.preventDefault();
        onWordSubmit(input.value);
      });
      node.appendChild(form);
    }

    if (errorMessage) {
      const error = el(documentRef, 'div', 'wc-error');
      error.textContent = errorMessage;
      node.appendChild(error);
    }
  }

  function renderFeedback(root, state, onContinue) {
    const node = root.querySelector('#wcFeedback');
    node.replaceChildren();
    if (!state.feedback) return;

    let title = 'Nog niet goed';
    if (state.feedback.type === 'exercise' && state.feedback.correct) title = 'Goed gedaan!';
    if (state.feedback.type === 'word' && state.feedback.correct) title = 'Woord gevonden! 🎉';
    if (state.feedback.invalid) title = 'Dat woord staat niet in het woordenboek.';

    const panel = el(documentRef, 'div', `wc-feedback ${state.feedback.correct ? 'is-correct' : 'is-wrong'}`);
    const strong = el(documentRef, 'strong');
    strong.textContent = title;
    panel.appendChild(strong);

    if (state.feedback.studentAnswer) {
      const line = el(documentRef, 'div');
      line.textContent = `Jouw antwoord: ${state.feedback.studentAnswer}`;
      panel.appendChild(line);
    }
    if (state.feedback.correctAnswer) {
      const line = el(documentRef, 'div');
      line.textContent = `Goed antwoord: ${state.feedback.correctAnswer}`;
      panel.appendChild(line);
    }
    if (state.feedback.type === 'word' && state.feedback.evaluation && state.feedback.guess) {
      const line = el(documentRef, 'div', 'wc-evaluation');
      [...state.feedback.guess].forEach((letter, index) => {
        const tile = el(documentRef, 'span', `wc-evaluation-tile ${state.feedback.evaluation[index]}`);
        tile.textContent = letter.toUpperCase();
        line.appendChild(tile);
      });
      panel.appendChild(line);
    }
    if (state.feedback.type === 'word' && !state.feedback.correct && !state.feedback.invalid) {
      const line = el(documentRef, 'div');
      line.textContent = 'Groen = juiste plek. Geel = juiste letter, verkeerde plek.';
      panel.appendChild(line);
    }
    if (state.feedback.message) {
      const line = el(documentRef, 'div');
      line.textContent = state.feedback.message;
      panel.appendChild(line);
    }

    const button = el(documentRef, 'button', 'secondary');
    button.type = 'button';
    button.textContent = 'Verder →';
    button.addEventListener('click', onContinue);
    panel.appendChild(button);
    node.appendChild(panel);
    button.focus({ preventScroll: true });
  }

  function renderFinished(root, state, onRestart, onGames) {
    const node = root.querySelector('#wcQuestionArea');
    node.replaceChildren();
    const panel = el(documentRef, 'div', 'wc-finished');
    const title = el(documentRef, 'strong');
    title.textContent = 'Les uitgespeeld! 🏆';
    const text = el(documentRef, 'span');
    text.textContent = `Alle oefenvragen zijn goed beantwoord in ${state.turns} beurten.`;
    const actions = el(documentRef, 'div', 'wc-actions');
    const restart = el(documentRef, 'button', 'success');
    restart.type = 'button';
    restart.textContent = 'Nog een keer →';
    restart.addEventListener('click', onRestart);
    const games = el(documentRef, 'button', 'secondary');
    games.type = 'button';
    games.textContent = 'Terug naar spelletjes';
    games.addEventListener('click', onGames);
    actions.append(restart, games);
    panel.append(title, text, actions);
    node.appendChild(panel);
  }

  function renderDifficulty(root, difficulty, onChange) {
    const mount = root.querySelector('#wcDifficultySelect');
    if (!mount) return;
    mount.replaceChildren();
    const dropdown = createPacoDropdown({
      options: [
        { value: 'rookie', label: 'ROOKIE — 2 letters' },
        { value: 'goat', label: 'GOAT — 1 letter' }
      ],
      value: difficulty,
      onChange,
      className: 'wc-dropdown'
    });
    mount.appendChild(dropdown.element);
  }

  return Object.freeze({ renderStats, renderTarget, renderQuestion, renderFeedback, renderFinished, renderDifficulty });
}
