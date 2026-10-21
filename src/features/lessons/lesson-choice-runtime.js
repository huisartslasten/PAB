import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createLessonContextField } from './lesson-context-view.js';
import { getLessonChoiceCards, getLessonChoiceTarget } from './choice.js';
import { applyViewContext, buildViewUrl } from '../../core/view-context.js';

const TARGETS = Object.freeze({ practice: 'oefenen.html', test: 'test.html', view: 'lesson-view.html', questions: 'questions.html' });
const ICONS = Object.freeze({ practice: '✏️', test: '📝', view: '👀', questions: '❓', learning: '📖' });
const DESCRIPTIONS = Object.freeze({ practice: 'Ga naar de oefenpagina en kies een oefenvorm.', test: 'Maak alle vragen van de toets en bekijk daarna je resultaat.', view: 'Bekijk de uitleg, vragen en antwoorden van deze les.', questions: 'Beantwoord de vragen zelf en vergelijk daarna met het voorbeeldantwoord.', learning: 'Lees de leerstof kaart voor kaart en neem de stof rustig door.' });

export function createLessonChoiceRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Lesson choice runtime requires an app.');
  if (!templateMount) throw new TypeError('Lesson choice runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Lesson choice runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const targetFor = path => { const target = buildViewUrl(path, { student, mode: context?.mode }); target.searchParams.set('lesson_id', String(lessonId)); return target; };
  const goLessons = () => navigate(buildViewUrl('lessons.html', { student, mode: context?.mode }));

  function renderLesson(lesson, hasLearning) {
    content.replaceChildren();
    const field = createLessonContextField(lesson, { documentRef });
    const grid = documentRef.createElement('div'); grid.className = 'choice-grid';
    if (hasLearning) {
      const card = documentRef.createElement('button'); card.type = 'button'; card.className = 'choice-card learning';
      card.innerHTML = `<div><div class="choice-icon">${ICONS.learning}</div><h2>Leren</h2><p>${DESCRIPTIONS.learning}</p></div><div class="choice-action">Openen →</div>`;
      card.addEventListener('click', () => navigate(targetFor('lesson-learning.html'))); grid.appendChild(card);
    }
    getLessonChoiceCards(lesson).forEach(choice => {
      const card = documentRef.createElement('button'); card.type = 'button'; card.className = `choice-card${choice.id === 'practice' ? ' available' : ''}`;
      card.innerHTML = `<div><div class="choice-icon">${ICONS[choice.id] || '📘'}</div><h2>${choice.label}</h2><p>${DESCRIPTIONS[choice.id] || ''}</p></div><div class="choice-action">Openen →</div>`;
      card.addEventListener('click', () => { const target = getLessonChoiceTarget(lesson, choice.id); if (target && TARGETS[choice.id]) navigate(targetFor(TARGETS[choice.id])); });
      grid.appendChild(card);
    });
    field.appendChild(grid); content.appendChild(field);
  }

  async function mount() {
    mountPacoPageTemplate({ mount: templateMount, backLabel: '← Mijn lessen', backAction: goLessons, greeting: `Hoi ${student}! 🐶`, title: 'Leskeuze', icon: '📖', subtitle: context?.isManagement ? 'Beheerweergave — deze les staat op de geselecteerde leerling.' : 'Kies wat je met deze les wilt doen.', navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }), content });
    if (!lessonId || !student) { const state = documentRef.createElement('div'); state.className = 'choice-state'; state.textContent = 'Geen leerling of les geselecteerd.'; content.replaceChildren(state); return; }
    try {
      await app.initializeSession();
      if (context?.isManagement) applyViewContext(context, { canManage: app.auth.isParent }); else applyViewContext(context);
      const records = await app.loadLessons();
      const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
      if (!lesson) { const state = documentRef.createElement('div'); state.className = 'choice-state'; state.textContent = 'Deze les kon niet worden gevonden.'; content.replaceChildren(state); return; }
      const cards = await app.learningContent.listForTopic(lesson.id, { includeImages: false });
      renderLesson(lesson, cards.length > 0);
    } catch (error) {
      console.error('Lesson choice load error:', error);
      const state = documentRef.createElement('div'); state.className = 'choice-state'; state.textContent = 'De les kon niet worden geladen.'; content.replaceChildren(state);
    }
  }

  return Object.freeze({ mount, content });
}