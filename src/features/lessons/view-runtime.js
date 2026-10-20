import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { getLessonExplanation, getLessonViewItems } from './view-model.js';
import { applyViewContext, buildViewUrl } from '../../core/view-context.js';
import { escapeHtml } from '../../core/html.js';

export function createLessonViewRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Lesson view runtime requires an app.');
  if (!templateMount) throw new TypeError('Lesson view runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Lesson view runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  content.className = 'lesson-view';

  const goChoice = () => {
    const target = buildViewUrl('lesson-choice.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  function renderLesson(lesson) {
    const view = documentRef.createElement('div');
    view.className = 'lesson-view';
    const explanation = getLessonExplanation(lesson);
    if (explanation) {
      const explanationCard = documentRef.createElement('div');
      explanationCard.className = 'lesson-explanation';
      explanationCard.innerHTML = `<div class="lesson-explanation-title">📖 Uitleg</div>${escapeHtml(explanation)}`;
      view.appendChild(explanationCard);
    }
    const items = getLessonViewItems(lesson);
    if (!items.length) {
      const empty = documentRef.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Deze les heeft nog geen items.';
      view.appendChild(empty);
    } else {
      items.forEach((item, index) => {
        const card = documentRef.createElement('article');
        card.className = 'lesson-item';
        card.innerHTML = `<div class="lesson-question">${index + 1}. ${escapeHtml(item.question)}</div><div class="lesson-answer">${escapeHtml(item.answer)}</div>${item.extra ? `<div class="lesson-extra-info"><div class="lesson-extra-info-title">💡 Extra informatie</div>${escapeHtml(item.extra)}</div>` : ''}`;
        view.appendChild(card);
      });
    }
    content.replaceChildren(view);
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Leskeuze',
      backAction: goChoice,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Les bekijken',
      icon: '👀',
      subtitle: 'Bekijk de inhoud van deze les.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });
    if (!lessonId || !student) {
      const state = documentRef.createElement('div');
      state.className = 'empty';
      state.textContent = 'Geen leerling of les geselecteerd.';
      content.replaceChildren(state);
      return;
    }
    try {
      await app.initializeSession();
      if (context?.isManagement) applyViewContext(context, { canManage: app.auth.isParent });
      else applyViewContext(context);
      const records = await app.loadLessons();
      const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
      if (!lesson) throw new Error('Deze les kon niet worden gevonden.');
      renderLesson(lesson);
    } catch (error) {
      console.error('Lesson view load error:', error);
      const state = documentRef.createElement('div');
      state.className = 'empty';
      state.innerHTML = `<strong>De les kon niet worden geladen.</strong><p>${escapeHtml(error?.message || 'Onbekende fout.')}</p>`;
      content.replaceChildren(state);
    }
  }

  return Object.freeze({ mount, content });
}
