export function createPlayerTestView({
  documentRef = globalThis.document,
  escapeHtml,
  speakTest = null,
  submitTest = null
} = {}) {
  if (!documentRef) throw new Error('A document is required.');
  if (typeof escapeHtml !== 'function') throw new Error('An escapeHtml function is required.');

  function renderProgress({ index = 0, total = 0 } = {}) {
    const progress = documentRef.getElementById('testProgress');
    if (!progress) throw new Error('The V4.78 test progress element is missing.');
    const pct = total ? index / total * 100 : 0;
    progress.innerHTML = `<div class="progress-label"><span>Vraag ${Math.min(index + 1, total)} van ${total}</span><span>${index} gemaakt</span></div><div class="progress"><div class="progress-bar"><span style="width:${pct}%"></span></div></div>`;
  }

  function focusAnswer() {
    documentRef.getElementById('testAnswer')?.focus?.();
  }

  function renderMultipleChoice(content, item) {
    const options = Array.isArray(item.answer_options) ? item.answer_options : [];
    content.innerHTML = `<div class="test-instructions">Kies het juiste antwoord.</div><div class="prompt">${escapeHtml(item.question)}</div><div class="test-multiple-choice">${options.map((option, index) => `<button type="button" class="secondary test-choice-option" data-test-option="${index}">${escapeHtml(option)}</button>`).join('')}</div>`;
    content.querySelectorAll('[data-test-option]').forEach(button => {
      button.addEventListener('click', () => {
        content.querySelectorAll('[data-test-option]').forEach(option => { option.disabled = true; });
        content.dataset.selectedAnswer = options[Number(button.dataset.testOption)] ?? '';
        submitTest?.();
      });
    });
  }

  function render({ item = null, index = 0, total = 0, type = 'words' } = {}) {
    if (!item) return;
    renderProgress({ index, total });
    const content = documentRef.getElementById('testContent');
    if (!content) throw new Error('The V4.78 test content element is missing.');

    if (item.response_type === 'multiple_choice') {
      renderMultipleChoice(content, item);
      return;
    }

    if (type === 'spelling') {
      content.innerHTML = '<div class="test-instructions">Vul het voltooid deelwoord en het bijvoeglijk gebruikt voltooid deelwoord in.</div><div class="prompt">' + escapeHtml(item.question) + '</div><div class="field"><label>Voltooid deelwoord</label><input id="testPerfect" class="answer-input" placeholder="bijvoorbeeld opgevoed"></div><div class="field"><label>Bijvoeglijk gebruikt voltooid deelwoord</label><input id="testAdjective" class="answer-input" placeholder="bijvoorbeeld opgevoede"></div><div style="height:18px"></div><button class="success" data-practice-action="submit" onclick="submitTest()">Volgende →</button>';
      return;
    }

    if (type === 'math') {
      const fraction = item.response_type === 'fraction';
      content.innerHTML = `<div class="test-instructions">Los de som op. Je krijgt pas aan het einde de uitslag.</div><div class="prompt">${escapeHtml(item.question)}</div><input id="testAnswer" class="answer-input" type="text" inputmode="${fraction ? 'text' : 'numeric'}" autofocus autocomplete="off" placeholder="${fraction ? 'Bijvoorbeeld 3/4' : 'Typ je antwoord'}"><div style="height:18px"></div><button class="success" data-practice-action="submit" onclick="submitTest()">Volgende →</button>`;
      focusAnswer();
      return;
    }

    if (type === 'dictation') {
      content.innerHTML = `<div class="test-instructions">Luister naar het woord en typ precies wat je hoort. Je krijgt pas aan het einde de uitslag.</div><div id="testVoiceStatus" class="small" style="min-height:20px;margin-top:4px"></div><div style="margin:25px"><button class="speaker big" onclick="speakTest()">🔊 Luister</button></div><input id="testAnswer" class="answer-input" autofocus autocomplete="off" placeholder="Vul hier het woord in"><div style="height:18px"></div><button class="success" data-practice-action="submit" onclick="submitTest()">Volgende →</button>`;
      if (typeof speakTest === 'function') setTimeout(() => speakTest(), 350);
      focusAnswer();
      return;
    }

    content.innerHTML = `<div class="test-instructions">Typ hier het woord. Je krijgt pas aan het einde de uitslag.</div><div class="prompt">${escapeHtml(item.question)}</div><input id="testAnswer" class="answer-input" autofocus autocomplete="off" placeholder="Vul hier het antwoord in"><div style="height:18px"></div><button class="success" data-practice-action="submit" onclick="submitTest()">Volgende →</button>`;
    focusAnswer();
  }

  return Object.freeze({ render, renderProgress });
}
