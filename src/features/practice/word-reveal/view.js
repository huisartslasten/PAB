function createElement(documentRef, tag, className = '') {
  const node = documentRef.createElement(tag);
  if (className) node.className = className;
  return node;
}

function escapeText(value) {
  return String(value ?? '');
}

export function createWordRevealView({ documentRef = document } = {}) {
  function renderStats(root, state, highScore) {
    root.querySelector('#wrTurns').textContent = String(state.turns);
    root.querySelector('#wrRecord').textContent = highScore == null ? '—' : String(highScore);
    root.querySelector('#wrProgress').textContent = `${state.completedCount} van ${state.totalCount}`;
  }

  function renderTarget(root, state, onReveal = null) {
    const targetNode = root.querySelector('#wrTarget');
    targetNode.replaceChildren();
    if (!state.target) return;

    const revealSet = new Set(state.revealedIndices || state.target.revealableIndices.slice(0, state.revealedCount));
    let characterOffset = 0;

    [...state.target.text.matchAll(/\S+|\s+/gu)].forEach(match => {
      const token = match[0];
      const characters = [...token];
      const startIndex = characterOffset;
      characterOffset += characters.length;

      if (/^\s+$/u.test(token)) {
        const space = createElement(documentRef, 'span', 'wr-target-space');
        space.textContent = characters.map(() => '\u00a0').join('');
        targetNode.appendChild(space);
        return;
      }

      const word = createElement(documentRef, 'span', 'wr-target-word');
      characters.forEach((character, offset) => {
        const index = startIndex + offset;
        if (!state.target.revealableIndices.includes(index)) {
          const punctuation = createElement(documentRef, 'span', 'wr-target-punctuation');
          punctuation.textContent = escapeText(character);
          word.appendChild(punctuation);
          return;
        }

        const isRevealed = revealSet.has(index);
        const card = createElement(documentRef, 'span', `wr-letter-card${isRevealed ? ' is-revealed' : ''}${onReveal && !isRevealed ? ' is-selectable' : ''}`);
        card.setAttribute('aria-hidden', isRevealed ? 'true' : 'false');
        const front = createElement(documentRef, 'span', 'wr-letter-front');
        front.setAttribute('aria-hidden', 'true');
        const back = createElement(documentRef, 'span', 'wr-letter-back');
        back.textContent = character;
        card.append(front, back);

        if (onReveal && !isRevealed) {
          card.setAttribute('role', 'button');
          card.setAttribute('tabindex', '0');
          card.setAttribute('aria-label', 'Onthul deze letter');
          const reveal = () => onReveal(index);
          card.addEventListener('click', reveal);
          card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              reveal();
            }
          });
        }

        word.appendChild(card);
      });
      targetNode.appendChild(word);
    });
  }

  function renderQuestion(root, state, onSubmit, onGuess, errorMessage = '') {
    const content = root.querySelector('#wrQuestionArea');
    content.replaceChildren();
    if (!state.current) return;

    const question = createElement(documentRef, 'div', 'wr-question');
    question.textContent = state.current.question;
    content.appendChild(question);

    const form = createElement(documentRef, 'form', 'wr-answer-form');
    const input = createElement(documentRef, 'input', 'wr-answer-input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = 'Typ je antwoord…';
    input.setAttribute('aria-label', 'Antwoord op de vraag');
    const submit = createElement(documentRef, 'button', 'success wr-primary-button');
    submit.type = 'submit';
    submit.textContent = 'Controleer →';
    form.append(input, submit);
    form.addEventListener('submit', event => {
      event.preventDefault();
      onSubmit(input.value);
    });
    content.appendChild(form);

    const guessForm = createElement(documentRef, 'form', 'wr-guess-form');
    const guessInput = createElement(documentRef, 'input', 'wr-guess-input');
    guessInput.type = 'text';
    guessInput.autocomplete = 'off';
    guessInput.placeholder = 'Weet je het al? Raad het woord of de zin…';
    guessInput.setAttribute('aria-label', 'Raad de oplossing');
    const guessButton = createElement(documentRef, 'button', 'secondary wr-secondary-button');
    guessButton.type = 'submit';
    guessButton.textContent = 'Raad de oplossing';
    guessForm.append(guessInput, guessButton);
    guessForm.addEventListener('submit', event => {
      event.preventDefault();
      onGuess(guessInput.value);
    });
    content.appendChild(guessForm);

    if (errorMessage) {
      const error = createElement(documentRef, 'div', 'wr-inline-error');
      error.textContent = errorMessage;
      content.appendChild(error);
    }
  }

  function renderFeedback(root, state, onContinue) {
    const feedbackNode = root.querySelector('#wrFeedback');
    feedbackNode.replaceChildren();
    if (!state.feedback) return;

    const titleText = state.feedback.correct
      ? (state.feedback.guess ? 'Goed geraden!' : state.phase === 'reveal-choice' ? 'Goed gedaan! Kies een letter.' : 'Goed gedaan!')
      : state.feedback.guess ? 'Nog niet goed. Probeer verder.' : 'Nog niet goed';
    const feedback = createElement(documentRef, 'div', `wr-feedback ${state.feedback.correct ? 'is-correct' : 'is-wrong'}`);
    const title = createElement(documentRef, 'strong', 'wr-feedback-title');
    title.textContent = titleText;
    feedback.appendChild(title);

    if (state.feedback.studentAnswer) {
      const answer = createElement(documentRef, 'div', 'wr-feedback-line');
      answer.textContent = `Jouw antwoord: ${state.feedback.studentAnswer}`;
      feedback.appendChild(answer);
    }
    if (state.feedback.correctAnswer && !state.feedback.guess) {
      const correct = createElement(documentRef, 'div', 'wr-feedback-line');
      correct.textContent = `Goed antwoord: ${state.feedback.correctAnswer}`;
      feedback.appendChild(correct);
    }
    if (state.feedback.message) {
      const message = createElement(documentRef, 'div', 'wr-feedback-line');
      message.textContent = state.feedback.message;
      feedback.appendChild(message);
    }

    if (state.phase === 'question') {
      const button = createElement(documentRef, 'button', 'secondary wr-feedback-button');
      button.type = 'button';
      button.textContent = 'OK, verder →';
      button.addEventListener('click', onContinue);
      feedback.appendChild(button);
    }
    feedbackNode.appendChild(feedback);
  }

  function renderRoundComplete(root, state, onNextRound) {
    const node = root.querySelector('#wrQuestionArea');
    node.replaceChildren();
    const panel = createElement(documentRef, 'div', 'wr-round-complete');
    const title = createElement(documentRef, 'strong');
    title.textContent = 'Doel gevonden! 🎉';
    const text = createElement(documentRef, 'span');
    text.textContent = 'We maken een nieuw doel met de vragen die nog openstaan.';
    panel.append(title, text);
    if (state.target?.type === 'saying' && state.target.meaning) {
      const meaning = createElement(documentRef, 'span', 'wr-meaning');
      meaning.textContent = `Betekenis: ${state.target.meaning}`;
      panel.appendChild(meaning);
    }
    const button = createElement(documentRef, 'button', 'success wr-primary-button');
    button.type = 'button';
    button.textContent = 'Volgende ronde →';
    button.addEventListener('click', onNextRound);
    panel.appendChild(button);
    node.appendChild(panel);
  }

  function renderFinished(root, state, onRestart, onGames) {
    const node = root.querySelector('#wrQuestionArea');
    node.replaceChildren();
    const panel = createElement(documentRef, 'div', 'wr-finished');
    const title = createElement(documentRef, 'strong');
    title.textContent = 'Alle vragen goed! 🏆';
    const text = createElement(documentRef, 'span');
    text.textContent = `Je hebt de lesvragen allemaal goed beantwoord in ${state.turns} beurten.`;
    panel.append(title, text);
    if (state.target?.type === 'saying' && state.target.meaning) {
      const meaning = createElement(documentRef, 'span', 'wr-meaning');
      meaning.textContent = `Betekenis: ${state.target.meaning}`;
      panel.appendChild(meaning);
    }
    const actions = createElement(documentRef, 'div', 'wr-actions');
    const restart = createElement(documentRef, 'button', 'success wr-primary-button');
    restart.type = 'button';
    restart.textContent = 'Nog een keer →';
    restart.addEventListener('click', onRestart);
    const games = createElement(documentRef, 'button', 'secondary wr-secondary-button');
    games.type = 'button';
    games.textContent = 'Terug naar spelletjes';
    games.addEventListener('click', onGames);
    actions.append(restart, games);
    panel.appendChild(actions);
    node.appendChild(panel);
  }

  function renderLoading(root, message = 'Paco bedenkt een mooi doel…') {
    const node = root.querySelector('#wrQuestionArea');
    node.replaceChildren();
    const loading = createElement(documentRef, 'div', 'wr-loading');
    loading.textContent = message;
    node.appendChild(loading);
  }

  return Object.freeze({ renderStats, renderTarget, renderQuestion, renderFeedback, renderRoundComplete, renderFinished, renderLoading });
}
