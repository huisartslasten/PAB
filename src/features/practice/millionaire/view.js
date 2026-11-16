export function createMillionaireView({ documentRef = document } = {}) {
  function render(state, handlers = {}) {
    const { onAnswer = () => {}, onFiftyFifty = () => {}, onAskSomeone = () => {}, onAskAudience = () => {}, onRestart = () => {}, onBack = () => {} } = handlers;
    const root = documentRef.createElement('main');
    root.className = 'millionaire-shell';

    const head = documentRef.createElement('div');
    head.className = 'millionaire-head';
    head.innerHTML = `<div><div class="millionaire-kicker">🏆 CHALLENGE</div><h1>Millionaire</h1><p>Ga jij voor 1.000.000 botjes? 🦴</p></div><div class="millionaire-prize">${state.prize.toLocaleString('nl-NL')} 🦴</div>`;
    root.appendChild(head);

    if (state.finished) {
      const result = documentRef.createElement('section');
      result.className = 'millionaire-result';
      result.innerHTML = `<div class="millionaire-result-icon">${state.prize >= 1000000 ? '🎉' : '🦴'}</div><h2>${state.prize >= 1000000 ? 'MILJOEN BOTJES!' : 'De challenge is voorbij'}</h2><p>${state.message || `Je eindigt met ${state.prize.toLocaleString('nl-NL')} botjes.`}</p>`;
      const actions = documentRef.createElement('div'); actions.className = 'millionaire-actions';
      const restart = documentRef.createElement('button'); restart.className = 'success'; restart.textContent = 'Opnieuw'; restart.addEventListener('click', onRestart);
      const back = documentRef.createElement('button'); back.className = 'secondary'; back.textContent = 'Terug naar Challenges'; back.addEventListener('click', onBack);
      actions.append(restart, back); result.appendChild(actions); root.appendChild(result); return root;
    }

    const lifelines = documentRef.createElement('div'); lifelines.className = 'millionaire-lifelines';
    [['fiftyFifty','50/50',onFiftyFifty],['askSomeone','📞 Vraag iemand',onAskSomeone],['askAudience','📊 Vraag het publiek',onAskAudience]].forEach(([key,label,handler]) => {
      const button = documentRef.createElement('button'); button.className = 'secondary'; button.textContent = label; button.disabled = !state.lifelines[key]; button.addEventListener('click', handler); lifelines.appendChild(button);
    });
    root.appendChild(lifelines);

    const progress = documentRef.createElement('div'); progress.className = 'millionaire-progress'; progress.textContent = `Vraag ${Math.min(state.questionNumber + 1, state.totalQuestions)} van ${state.totalQuestions} · Volgende: ${state.nextPrize.toLocaleString('nl-NL')} 🦴`; root.appendChild(progress);

    if (state.message) { const message = documentRef.createElement('div'); message.className = 'millionaire-message'; message.textContent = state.message; root.appendChild(message); }

    if (!state.current) {
      const loading = documentRef.createElement('div'); loading.className = 'millionaire-question-card'; loading.textContent = 'Vraag laden…'; root.appendChild(loading); return root;
    }

    const question = documentRef.createElement('section'); question.className = 'millionaire-question-card';
    const source = documentRef.createElement('div'); source.className = 'millionaire-source'; source.textContent = state.current.subject || state.current.title || 'Vrijgegeven leerstof'; question.appendChild(source);
    const text = documentRef.createElement('h2'); text.textContent = state.current.question; question.appendChild(text);
    const answers = documentRef.createElement('div'); answers.className = 'millionaire-answers';
    state.options.forEach(option => {
      const button = documentRef.createElement('button'); button.className = 'millionaire-answer'; button.textContent = option; button.addEventListener('click', () => onAnswer(option)); answers.appendChild(button);
    });
    question.appendChild(answers); root.appendChild(question);
    return root;
  }

  return Object.freeze({ render });
}
