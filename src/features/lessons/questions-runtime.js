import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createQuestionSession } from './question-session.js';
import { escapeHtml } from '../../core/html.js';
import { buildViewUrl } from '../../core/view-context.js';

export function createQuestionsRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Questions runtime requires an app.');
  if (!templateMount) throw new TypeError('Questions runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Questions runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  let session = null;
  const goChoice = () => { const target = buildViewUrl('lesson-choice.html', { student, mode: context?.mode }); if (lessonId) target.searchParams.set('lesson_id', lessonId); return navigate(target); };

  function progress() {
    const state = session.getState();
    return `<div class="progress-wrap"><div class="progress-label"><span>Vraag ${Math.min(state.index + 1, state.total)} van ${state.total}</span></div><div class="progress"><div class="progress-bar" style="width:${state.total ? state.index / state.total * 100 : 0}%"></div></div></div>`;
  }
  function renderQuestion() {
    const item = session.current();
    if (!item) { content.innerHTML = '<div class="question-card"><div class="result-score">Klaar!</div><p class="small" style="text-align:center">Je hebt alle vragen bekeken.</p><div class="actions"><button class="primary" id="doneButton">← Terug naar de les</button></div></div>'; content.querySelector('#doneButton').addEventListener('click', goChoice); return; }
    if (item.response_type === 'multiple_choice') return renderMultipleChoice(item);
    content.innerHTML = `<div class="questions-shell"><div class="question-card">${progress()}<div class="prompt">${escapeHtml(item.question)}</div><textarea id="questionAnswer" class="answer-input" placeholder="Schrijf je antwoord..."></textarea><div class="actions"><button class="primary" id="revealButton">Antwoord bekijken</button></div></div></div>`;
    content.querySelector('#revealButton').addEventListener('click', reveal);
    content.querySelector('#questionAnswer').focus();
  }
  function renderMultipleChoice(item) {
    const options = Array.isArray(item.answer_options) ? item.answer_options : [];
    content.innerHTML = `<div class="questions-shell"><div class="question-card">${progress()}<div class="prompt">${escapeHtml(item.question)}</div><div class="question-options">${options.map((option, index) => `<button type="button" class="question-option" data-choice="${index}">${escapeHtml(option)}</button>`).join('')}</div></div></div>`;
    content.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => revealMultipleChoice(item, options[Number(button.dataset.choice)] || '')));
  }
  function revealMultipleChoice(item, selected) {
    const correct = String(selected).trim().toLowerCase() === String(item.answer || '').trim().toLowerCase();
    content.querySelectorAll('[data-choice]').forEach(button => { const option = button.textContent || ''; button.disabled = true; if (option.trim().toLowerCase() === String(item.answer || '').trim().toLowerCase()) button.classList.add('correct'); else if (option.trim().toLowerCase() === String(selected).trim().toLowerCase()) button.classList.add('wrong'); });
    const result = documentRef.createElement('div'); result.className = 'example-answer'; result.innerHTML = correct ? '<strong>✓ Goed!</strong>' : `<strong>✗ Nog niet.</strong><br>Het juiste antwoord is: ${escapeHtml(item.answer || '')}`;
    const actions = documentRef.createElement('div'); actions.className = 'actions'; actions.innerHTML = '<button class="success" id="nextButton">Volgende →</button>'; content.querySelector('.question-card').append(result, actions); actions.querySelector('#nextButton').addEventListener('click', next);
  }
  function reveal() {
    const item = session.current(); const answer = content.querySelector('#questionAnswer')?.value || '';
    content.innerHTML = `<div class="questions-shell"><div class="question-card">${progress()}<div class="prompt">${escapeHtml(item.question)}</div><div class="example-answer"><strong>Jouw antwoord:</strong><br>${escapeHtml(answer || '—')}<hr><strong>Voorbeeldantwoord:</strong><br>${escapeHtml(item.answer || '')}</div><div class="actions"><button class="success" id="nextButton">✓ Goed</button><button class="danger" id="nextButtonAlt">✗ Nog niet</button></div></div></div>`;
    content.querySelector('#nextButton').addEventListener('click', next); content.querySelector('#nextButtonAlt').addEventListener('click', next);
  }
  function next() { session.next(); renderQuestion(); }

  async function mount() {
    mountPacoPageTemplate({ mount: templateMount, backLabel: '← Leskeuze', backAction: goChoice, greeting: `Hoi ${student}! 🐶`, title: 'Vragen maken', icon: '❓', subtitle: 'Beantwoord open vragen of kies een antwoord bij multiple choice.', navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }), content });
    try {
      if (!lessonId) throw new Error('Geen les geselecteerd.');
      const records = await app.loadLessons();
      const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
      if (!lesson) throw new Error('Deze les kon niet worden gevonden.');
      session = createQuestionSession(Array.isArray(lesson.lesson_items) ? lesson.lesson_items : []);
      renderQuestion();
    } catch (error) {
      console.error('Questions load error:', error);
      content.innerHTML = `<div class="question-card"><strong>De vragen konden niet worden geladen.</strong><p class="small">${escapeHtml(error?.message || 'Onbekende fout.')}</p><div class="actions"><button class="primary" id="loadBack">← Leskeuze</button></div></div>`;
      content.querySelector('#loadBack')?.addEventListener('click', goChoice);
    }
  }

  return Object.freeze({ mount, content });
}
