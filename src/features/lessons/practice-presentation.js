import { createPracticeRuntimeEntry } from './practice-runtime-entry.js';

function typeTitle(type) {
  if (type === 'dictation') return '✏️ Dictee oefenen';
  if (type === 'custom') return '🛠️ Eigen les oefenen';
  if (type === 'questions') return '❓ Vragen oefenen';
  if (type === 'spelling') return '🔤 Spelling oefenen';
  if (type === 'math') return '🔢 Rekenen oefenen';
  return '🎯 Woordtrainer oefenen';
}

function hintHtml(item, escapeHtml) {
  const hint = String(item?.hint ?? '').trim();
  if (!hint) return '';
  return `<div class="practice-hint"><button type="button" class="practice-hint-button" data-practice-action="hint">💡 Hint</button><div class="practice-hint-box hidden" data-practice-hint-box><strong>Hint</strong><div>${escapeHtml(hint)}</div></div></div>`;
}

function correctAnswerHtml(item, type, escapeHtml) {
  const answer = String(item?.answer ?? '').trim();
  if (!answer) return '';
  if (type === 'spelling' && answer.includes(' || ')) {
    const [perfect, adjective] = answer.split(' || ');
    return `<div class="practice-correct-answer"><div class="practice-correct-answer-title">Juiste antwoord</div><div><strong>Voltooid deelwoord:</strong> ${escapeHtml(perfect)}</div><div><strong>Bijvoeglijk gebruikt:</strong> ${escapeHtml(adjective)}</div></div>`;
  }
  return `<div class="practice-correct-answer"><div class="practice-correct-answer-title">Juiste antwoord</div><div class="practice-correct-answer-text">${escapeHtml(answer)}</div></div>`;
}

function extraHtml(item, escapeHtml) {
  const extra = Array.isArray(item?.answer_parts)
    ? item.answer_parts.filter(part => part?.role === 'extra' && String(part.text ?? '').trim()).map(part => String(part.text)).join('\n')
    : '';
  return extra ? `<div class="lesson-extra-info"><div class="lesson-extra-info-title">💡 Extra informatie</div>${escapeHtml(extra)}</div>` : '';
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
  aiCheckAnswers = true,
  pageElement = null,
  titleElement = null,
  progressElement = null,
  contentElement = null
} = {}) {
  if (typeof getLesson !== 'function') throw new Error('A practice lesson provider is required.');
  if (typeof getStudent !== 'function') throw new Error('A practice student provider is required.');
  if (typeof escapeHtml !== 'function') throw new Error('A practice HTML escaping function is required.');
  if (typeof hideAll !== 'function') throw new Error('A practice page navigation function is required.');
  if (typeof showLessonChoice !== 'function') throw new Error('A lesson choice navigation function is required.');
  if (typeof shuffle !== 'function') throw new Error('A shuffle function is required.');
  if (typeof random !== 'function') throw new Error('A practice random function is required.');
  if (audioService && typeof audioService.speak !== 'function') throw new Error('A valid lesson audio service is required.');
  if (audioService && typeof audioService.stop !== 'function') throw new Error('A valid lesson audio service is required.');

  let entry = null;

  function elements() {
    return {
      page: pageElement || documentRef.getElementById('practice'),
      title: titleElement || documentRef.getElementById('practiceTitle'),
      progress: progressElement || documentRef.getElementById('practiceProgress'),
      content: contentElement || documentRef.getElementById('practiceContent')
    };
  }

  function renderProgress(snapshot) {
    const el = elements().progress;
    if (!el || !snapshot?.progress) return;
    const { mastered, total, remaining, percentage } = snapshot.progress;
    el.innerHTML = `<div class="progress-label"><span>${mastered} / ${total} beheerst</span><span>Nog ${remaining}</span></div><div class="progress"><div class="progress-bar"><span style="width:${percentage}%"></span></div></div>`;
  }

  function bindHint() {
    const content = elements().content;
    const button = content?.querySelector('[data-practice-action="hint"]');
    const box = content?.querySelector('[data-practice-hint-box]');
    button?.addEventListener('click', event => {
      event.stopPropagation();
      button.hidden = true;
      box?.classList.remove('hidden');
    });
  }

  function bindCurrentActions() {
    bindHint();
    const content = elements().content;
    content?.querySelector('[data-practice-action="reveal-question"]')?.addEventListener('click', revealQuestion);
    content?.querySelector('[data-practice-action="speak"]')?.addEventListener('click', speakDictation);
    content?.querySelector('[data-practice-form]')?.addEventListener('submit', async event => {
      event.preventDefault();
      const button = event.currentTarget.querySelector('[data-practice-action="submit"]');
      if (button) button.disabled = true;
      try { await submit(); } finally { if (button?.isConnected) button.disabled = false; }
    });
  }

  function renderCurrent(snapshot) {
    renderProgress(snapshot);
    const content = elements().content;
    if (!content || !snapshot?.current) return;
    const item = snapshot.current;
    const type = snapshot.type;

    if (type === 'questions') {
      content.innerHTML = `${hintHtml(item, escapeHtml)}<div class="prompt">${escapeHtml(item.question)}</div><textarea id="questionAnswer" class="answer-input" style="width:100%;min-height:130px;text-align:left" placeholder="Schrijf je antwoord..."></textarea><div class="row" style="justify-content:center;margin-top:15px"><button class="secondary" data-practice-action="reveal-question">Antwoord bekijken</button></div>`;
      bindCurrentActions();
      return;
    }

    if (type === 'spelling') {
      content.innerHTML = `<form data-practice-form><div class="small">Vul beide vormen in.</div>${hintHtml(item, escapeHtml)}<div class="prompt">${escapeHtml(item.question)}</div><div class="field"><label>Voltooid deelwoord</label><input id="practicePerfect" class="answer-input"></div><div class="field"><label>Bijvoeglijk gebruikt voltooid deelwoord</label><input id="practiceAdjective" class="answer-input"></div><div id="practiceFeedback" class="feedback"></div><button type="submit" class="success" data-practice-action="submit">Controleren</button></form>`;
      bindCurrentActions();
      return;
    }

    const isMath = type === 'math';
    const isDictation = type === 'dictation';
    content.innerHTML = isDictation
      ? `<form data-practice-form><div class="dictation-word">Luister goed en schrijf het woord.</div>${hintHtml(item, escapeHtml)}<div id="practiceVoiceStatus" class="small" style="min-height:20px;margin-top:4px"></div><div style="margin:22px"><button type="button" class="secondary speaker" data-practice-action="speak">🔊 Nog een keer</button></div><input id="practiceAnswer" class="answer-input" autocomplete="off"><div id="practiceFeedback" class="feedback"></div><button type="submit" class="success" data-practice-action="submit">Controleren</button></form>`
      : `<form data-practice-form><div class="small">${isMath ? 'Los de som op.' : 'Typ hier het woord.'}</div>${hintHtml(item, escapeHtml)}<div class="prompt">${escapeHtml(item.question)}</div><input id="practiceAnswer" class="answer-input" ${isMath ? 'type="number" inputmode="numeric"' : ''} autocomplete="off"><div id="practiceFeedback" class="feedback"></div><button type="submit" class="success" data-practice-action="submit">Controleren</button></form>`;
    bindCurrentActions();
    documentRef.getElementById('practiceAnswer')?.focus();
    if (isDictation) windowRef.setTimeout(() => { void speakDictation(); documentRef.getElementById('practiceAnswer')?.focus(); }, 350);
  }

  function renderCompletion(snapshot) {
    const content = elements().content;
    if (!content) return;
    const total = snapshot.progress.total;
    content.innerHTML = `<div class="result-score">🎉 Klaar!</div><p>Je hebt alle ${total} ${snapshot.type === 'dictation' ? 'dicteewoorden' : snapshot.type === 'questions' ? 'vragen bekeken' : 'onderdelen'} doorlopen.</p><button class="success" data-practice-action="back-to-lesson">Terug naar de les</button>`;
    content.querySelector('[data-practice-action="back-to-lesson"]')?.addEventListener('click', () => showLessonChoice());
    const progress = elements().progress;
    if (progress) progress.innerHTML = `<div class="progress-label"><span>🎉 ${snapshot.progress.mastered} / ${snapshot.progress.total} beheerst</span><span>Klaar!</span></div><div class="progress"><div class="progress-bar"><span style="width:100%"></span></div></div>`;
  }

  function renderFeedback(result, item, answer) {
    const content = elements().content;
    if (!content) return;
    const type = entry?.runtime?.type || '';
    const fixed = result.evaluation?.fixedRules;
    const fixedHtml = fixed?.results?.length ? `<div class="practice-rule-results"><strong>Vaste beoordelingsregels</strong><br>${fixed.results.map(rule => `${rule.ok ? '✓ ' : '✗ '}${escapeHtml(rule.text)}`).join('<br>')}</div>` : '';
    const feedback = result.correct
      ? `<div class="feedback correct">${type === 'spelling' ? '✅ Beide goed!' : '✅ Goed!'} ${escapeHtml(result.evaluation?.feedback || '')}</div>${extraHtml(item, escapeHtml)}`
      : `<div class="feedback incorrect">❌ ${result.evaluation?.feedback ? escapeHtml(result.evaluation.feedback) : 'Nog niet helemaal. Dit item komt later opnieuw terug.'}</div>${extraHtml(item, escapeHtml)}`;
    content.innerHTML = `<div class="practice-answer-review"><div class="practice-answer-review-title">Jouw antwoord:</div><div class="practice-answer-review-text">${escapeHtml(answer || '—')}</div>${fixedHtml}</div>${correctAnswerHtml(item, type, escapeHtml)}${feedback}`;
    const next = documentRef.createElement('button');
    next.className = 'success';
    next.textContent = result.done ? 'Klaar' : 'OK → Volgende vraag';
    next.addEventListener('click', () => result.done ? finish() : nextItem());
    content.appendChild(next);
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
      renderFeedback(result, item, answer);
      return result;
    } catch (error) {
      console.error('Practice answer error:', error);
      if (feedback) { feedback.textContent = '⚠️ De beoordeling kon niet worden uitgevoerd.'; feedback.className = 'feedback incorrect'; }
      input?.focus();
      return null;
    }
  }

  function revealQuestion() {
    if (!entry) return null;
    const item = entry.runtime.current;
    const content = elements().content;
    if (!item || !content) return null;
    const answer = documentRef.getElementById('questionAnswer')?.value || '';
    content.innerHTML = `${hintHtml(item, escapeHtml)}<div class="prompt">${escapeHtml(item.question)}</div><div class="question-answer"><strong>Jouw antwoord:</strong><br>${escapeHtml(answer || '—')}<hr><strong>Voorbeeldantwoord:</strong><br>${escapeHtml(item.answer)}</div><div class="self-buttons"><button class="success" data-question-result="true">✓ Goed</button><button class="danger" data-question-result="false">✗ Nog niet</button></div>`;
    bindHint();
    content.querySelectorAll('[data-question-result]').forEach(button => button.addEventListener('click', () => { void assess(button.dataset.questionResult === 'true'); }));
    return { item, answer };
  }

  async function assess(correct) {
    if (!entry) return null;
    const result = await entry.assess(correct);
    if (!result.done) {
      const content = elements().content;
      if (content) {
        content.innerHTML = `<div class="question-answer"><strong>Beoordeling opgeslagen.</strong></div><button class="success" data-practice-action="next-question">OK → Volgende vraag</button>`;
        content.querySelector('[data-practice-action="next-question"]')?.addEventListener('click', nextItem);
      }
    }
    return result;
  }

  function nextItem() {
    if (!entry) return null;
    return entry.next();
  }

  async function speakDictation() {
    if (!entry || !audioService) return null;
    const item = entry.runtime.current;
    if (!item) return null;
    return audioService.speak(item.answer, {
      language: String(getLesson()?.language || 'nl'),
      onStatus: status => {
        const element = documentRef.getElementById('practiceVoiceStatus');
        if (element) element.textContent = status;
      }
    });
  }

  function cancel() {
    speechCancel();
    audioService?.stop();
    entry = null;
  }

  async function finish() {
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