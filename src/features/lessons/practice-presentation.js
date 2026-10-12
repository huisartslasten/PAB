import { createPracticeRuntimeEntry } from './practice-runtime-entry.js';

function typeTitle(type) {
  if (type === 'dictation') return '✏️ Dictee oefenen';
  if (type === 'custom') return '🛠️ Eigen les oefenen';
  if (type === 'questions') return '❓ Vragen';
  return '🎯 Woordtrainer oefenen';
}

function itemExtraInfo(item, escapeHtml) {
  const extra = Array.isArray(item?.answer_parts)
    ? item.answer_parts
      .filter(part => part && part.role === 'extra' && String(part.text ?? '').trim())
      .map(part => String(part.text))
      .join('\n')
    : '';
  return extra
    ? `<div class="lesson-extra-info"><div class="lesson-extra-info-title">💡 Extra informatie</div>${escapeHtml(extra)}</div>`
    : '';
}

function hintHtml(item, escapeHtml) {
  const hint = String(item?.hint ?? '').trim();
  if (!hint) return '';
  return `<div><button type="button" class="practice-hint-button" onclick="showPracticeHint()">💡 Hint</button><div id="practiceHintBox" class="practice-hint-box hidden"><strong>Hint</strong>${escapeHtml(hint)}</div></div>`;
}

export function createPracticePresentation({
  documentRef = document,
  windowRef = window,
  getLesson,
  getStudent,
  db = null,
  masteryService = null,
  audioService = null,
  shuffle = items => [...items],
  random = Math.random,
  escapeHtml,
  hideAll,
  showLessonChoice,
  refreshPageSidebars = () => {},
  speechCancel = () => {},
  aiCheckAnswers = true
} = {}) {
  if (typeof getLesson !== 'function') throw new Error('A practice lesson provider is required.');
  if (typeof getStudent !== 'function') throw new Error('A practice student provider is required.');
  if (typeof escapeHtml !== 'function') throw new Error('A practice HTML escaping function is required.');
  if (typeof hideAll !== 'function') throw new Error('A practice page navigation function is required.');
  if (typeof showLessonChoice !== 'function') throw new Error('A lesson choice navigation function is required.');
  if (typeof shuffle !== 'function') throw new Error('A practice shuffle function is required.');
  if (typeof random !== 'function') throw new Error('A practice random function is required.');
  if (audioService && typeof audioService.speak !== 'function') throw new Error('A valid lesson audio service is required.');
  if (audioService && typeof audioService.stop !== 'function') throw new Error('A valid lesson audio service is required.');

  let entry = null;

  function elements() {
    return {
      page: documentRef.getElementById('practice'),
      title: documentRef.getElementById('practiceTitle'),
      progress: documentRef.getElementById('practiceProgress'),
      content: documentRef.getElementById('practiceContent')
    };
  }

  function renderProgress(snapshot) {
    const { progress } = snapshot;
    const el = elements().progress;
    if (!el) return;
    el.innerHTML = `<div class="progress-label"><span>${progress.mastered} / ${progress.total} beheerst</span><span>Nog ${progress.remaining}</span></div><div class="progress"><div class="progress-bar" style="width:${progress.percentage}%"></div></div>`;
  }

  function renderCurrent(snapshot) {
    renderProgress(snapshot);
    const content = elements().content;
    if (!content || !snapshot.current) return;
    const item = snapshot.current;
    const type = snapshot.type;

    if (type === 'questions') {
      content.innerHTML = `<div class="prompt">${escapeHtml(item.question)}</div><textarea id="questionAnswer" class="answer-input" style="width:100%;min-height:130px;text-align:left" placeholder="Schrijf je antwoord..."></textarea><div class="row" style="justify-content:center;margin-top:15px"><button class="big" onclick="revealQuestion()">Antwoord bekijken</button></div>`;
      return;
    }

    if (type === 'spelling') {
      content.innerHTML = `<div class="small">Vul beide vormen in.</div><div class="prompt">${escapeHtml(item.question)}</div><div class="field"><label>Voltooid deelwoord</label><input id="practicePerfect" class="answer-input" placeholder="bijvoorbeeld opgevoed"></div><div class="field"><label>Bijvoeglijk gebruikt voltooid deelwoord</label><input id="practiceAdjective" class="answer-input" placeholder="bijvoorbeeld opgevoede"></div><div id="practiceFeedback" class="feedback"></div><button class="big" onclick="checkPractice()">Controleren</button>`;
      return;
    }

    if (type === 'math') {
      content.innerHTML = `<div class="small">Los de som op.</div><div class="prompt">${escapeHtml(item.question)}</div><input id="practiceAnswer" class="answer-input" type="number" inputmode="numeric" autofocus autocomplete="off" placeholder="Typ je antwoord"><div id="practiceFeedback" class="feedback"></div><button class="big" onclick="checkPractice()">Controleren</button>`;
      documentRef.getElementById('practiceAnswer')?.focus();
      return;
    }

    if (type === 'dictation') {
      content.innerHTML = `<div class="dictation-word">Luister goed en schrijf het woord.</div>${hintHtml(item, escapeHtml)}<div id="practiceVoiceStatus" class="small" style="min-height:20px;margin-top:4px"></div><div style="margin:22px"><button class="speaker big" onclick="speakDictation()">🔊 Nog een keer</button></div><input id="practiceAnswer" class="answer-input" autofocus autocomplete="off" placeholder="Vul hier het woord in"><div id="practiceFeedback" class="feedback"></div><button class="big" onclick="checkPractice()">Controleren</button>`;
      windowRef.setTimeout(() => {
        windowRef.speakDictation?.();
        documentRef.getElementById('practiceAnswer')?.focus();
      }, 350);
      return;
    }

    content.innerHTML = `<div class="small">Typ hier het woord.</div>${hintHtml(item, escapeHtml)}<div class="prompt">${escapeHtml(item.question)}</div><input id="practiceAnswer" class="answer-input" autofocus autocomplete="off" placeholder="Vul hier een antwoord in"><div id="practiceFeedback" class="feedback"></div><button class="big" onclick="checkPractice()">Controleren</button>`;
    documentRef.getElementById('practiceAnswer')?.focus();
  }

  function renderCompletion(snapshot) {
    const { progress, type } = snapshot;
    const content = elements().content;
    if (!content) return;
    const total = progress.total;
    content.innerHTML = `<div class="result-score">🎉 Klaar!</div><p>Je hebt alle ${total} ${type === 'dictation' ? 'dicteewoorden' : type === 'questions' ? 'vragen bekeken' : 'woorden'} ${type === 'questions' ? '.' : 'goed kunnen maken.'}</p><button class="big" onclick="showLessonChoice(currentLesson)">Terug naar de les</button>`;
    const progressEl = elements().progress;
    if (progressEl) progressEl.innerHTML = `<div class="progress-label"><span>🎉 ${progress.mastered} / ${progress.total} beheerst</span><span>Klaar!</span></div><div class="progress"><div class="progress-bar" style="width:100%"></div></div>`;
  }

  function renderFeedback(result, item, answer) {
    const feedback = documentRef.getElementById('practiceFeedback');
    if (!feedback) return;
    const fixed = result.evaluation?.fixedRules;
    const fixedHtml = fixed?.results?.length
      ? `<div class="practice-rule-results"><strong>Vaste beoordelingsregels</strong><br>${fixed.results.map(rule => `${rule.ok ? '✓ ' : '✗ '}${escapeHtml(rule.text)}`).join('<br>')}</div>`
      : '';
    const review = `<div class="practice-answer-review"><div class="practice-answer-review-title">Jouw antwoord:</div><div class="practice-answer-review-text">${escapeHtml(answer || '—')}</div>${fixedHtml}</div>`;
    const extra = itemExtraInfo(item, escapeHtml);
    feedback.innerHTML = result.correct
      ? `${review}<div class="feedback correct">${item?.type === 'spelling' ? '✅ Beide goed!' : '✅ Goed!'} ${escapeHtml(result.evaluation?.feedback || '')}</div>${extra}`
      : `${review}<div class="feedback incorrect">❌ ${result.evaluation?.feedback ? escapeHtml(result.evaluation.feedback) : 'Nog niet helemaal. Dit item komt later opnieuw terug.'}</div>${extra}`;
    feedback.className = result.correct ? 'feedback correct' : 'feedback incorrect';
    documentRef.querySelectorAll('#practiceContent button, #practiceContent input, #practiceContent textarea').forEach(control => { control.disabled = true; });

    const next = documentRef.createElement('button');
    next.className = 'big';
    next.textContent = result.done ? 'Klaar' : 'OK → Volgende vraag';
    next.onclick = () => result.done ? finish() : nextItem();
    feedback.insertAdjacentElement('afterend', next);
  }

  function start(type) {
    const lesson = getLesson();
    if (!lesson) return null;
    speechCancel();
    audioService?.stop();
    hideAll();
    const { page, title } = elements();
    page?.classList.remove('hidden');
    if (title) title.textContent = typeTitle(type);
    entry = createPracticeRuntimeEntry({
      db,
      lesson: { ...lesson, type },
      student: getStudent(),
      masteryService,
      shuffle,
      random,
      aiCheckAnswers: lesson.ai_check_answers !== false && aiCheckAnswers,
      render: renderCurrent,
      prepare: () => {},
      onAnswer: () => refreshPageSidebars(),
      onFinish: renderCompletion
    });
    return entry.start();
  }

  function nextItem() {
    if (!entry) return null;
    return entry.next();
  }

  async function submit() {
    if (!entry) return null;
    const snapshot = entry.runtime.snapshot();
    const item = snapshot.current;
    const type = snapshot.type;
    const input = type === 'spelling' ? documentRef.getElementById('practicePerfect') : documentRef.getElementById('practiceAnswer');
    const answer = type === 'spelling'
      ? `${documentRef.getElementById('practicePerfect')?.value.trim() || ''} || ${documentRef.getElementById('practiceAdjective')?.value.trim() || ''}`
      : input?.value.trim() || '';
    const feedback = documentRef.getElementById('practiceFeedback');
    if (!answer.replaceAll(' || ', '').trim()) {
      if (feedback) { feedback.textContent = type === 'spelling' ? 'Vul eerst de antwoorden in.' : 'Typ eerst een antwoord.'; feedback.className = 'feedback incorrect'; }
      input?.focus();
      return null;
    }
    try {
      const result = await entry.submit(answer);
      if (!result.done) renderFeedback(result, item, answer);
      return result;
    } catch (error) {
      console.error('Practice answer error:', error);
      if (feedback) { feedback.textContent = '⚠️ De beoordeling kon niet worden uitgevoerd.'; feedback.className = 'feedback incorrect'; }
      documentRef.querySelectorAll('#practiceContent button, #practiceContent input, #practiceContent textarea').forEach(control => { control.disabled = false; });
      input?.focus();
      return null;
    }
  }

  function revealQuestion() {
    if (!entry) return null;
    const item = entry.runtime.current;
    if (!item) return null;
    const answer = documentRef.getElementById('questionAnswer')?.value || '';
    const content = elements().content;
    if (!content) return null;
    content.innerHTML = `<div class="prompt">${escapeHtml(item.question)}</div><div class="question-answer"><strong>Jouw antwoord:</strong><br>${escapeHtml(answer || '—')}<hr><strong>Voorbeeldantwoord:</strong><br>${escapeHtml(item.answer)}</div><div class="self-buttons"><button class="success" onclick="nextQuestion(true)">✓ Goed</button><button class="danger" onclick="nextQuestion(false)">✗ Nog niet</button></div>`;
    return { item, answer };
  }

  function assess(correct) {
    if (!entry) return null;
    const result = entry.assess(correct);
    if (result.done) return result;
    const content = elements().content;
    if (content) content.innerHTML = `<div class="question-answer"><strong>Beoordeling opgeslagen.</strong></div><button class="big" onclick="nextQuestion()">OK → Volgende vraag</button>`;
    return result;
  }

  async function speakDictation() {
    if (!entry || !audioService) return null;
    const item = entry.runtime.current;
    if (!item) return null;
    const language = String(getLesson()?.language || 'nl');
    return audioService.speak(item.question, {
      language,
      onStatus: status => {
        const statusElement = documentRef.getElementById('practiceVoiceStatus');
        if (statusElement) statusElement.textContent = status;
      }
    });
  }

  function cancel() {
    speechCancel();
    audioService?.stop();
    entry = null;
  }

  function finish() {
    if (!entry) return null;
    return entry.finish();
  }

  return Object.freeze({ start, next: nextItem, submit, revealQuestion, assess, speakDictation, finish, cancel, get entry() { return entry; } });
}

export function installPracticePresentation(options, target = window) {
  const presentation = createPracticePresentation(options);
  target.pacoGOPracticePresentation = presentation;
  return presentation;
}
