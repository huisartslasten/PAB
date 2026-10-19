import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { getActivePracticeModes, getPracticeModes } from './practice-domain.js';
import { createLessonContextField } from '../lessons/lesson-context-view.js';
import { buildViewUrl } from '../../core/view-context.js';

const TARGETS = Object.freeze({ flashcards: 'flashcards-template.html', 'practice-test': 'oefentoets.html', games: 'games.html' });
const META = Object.freeze({ flashcards: ['🃏', 'Oefen met vraag en antwoord en draai de kaart om als je klaar bent.'], 'practice-test': ['📝', 'Maak een oefentoets met alle vragen van deze les.'], games: ['🎮', 'Speel leerzame spelletjes met deze les.'] });

export function createPracticeMenuRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Practice menu runtime requires an app.');
  if (!templateMount) throw new TypeError('Practice menu runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Practice menu runtime requires a navigation owner.');
  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const goChoice = () => { const target = buildViewUrl('lesson-choice.html', { student, mode: context?.mode }); if (lessonId) target.searchParams.set('lesson_id', lessonId); return navigate(target); };
  const openMode = mode => { const target = buildViewUrl(TARGETS[mode.id], { student, mode: context?.mode }); if (lessonId) target.searchParams.set('lesson_id', lessonId); return navigate(target); };
  function render(lesson) {
    content.replaceChildren();
    if (!lessonId || !lesson) { const state = documentRef.createElement('div'); state.className = 'practice-state'; state.textContent = lessonId ? 'Deze les kon niet worden gevonden.' : 'Geen les geselecteerd.'; content.appendChild(state); return; }
    const field = createLessonContextField(lesson, { documentRef }); const grid = documentRef.createElement('div'); grid.className = 'practice-mode-grid';
    getPracticeModes().forEach(mode => { const active = mode.status === 'active'; const card = documentRef.createElement('button'); card.type = 'button'; card.className = `practice-mode-card${active ? ' active' : ''}`; card.disabled = !active; const [icon, description] = META[mode.id] || ['📘', '']; card.innerHTML = `<div><div class="practice-mode-icon">${icon}</div><h2>${mode.label}</h2><p>${description}</p></div><div class="practice-mode-action">${active ? 'Openen →' : 'Binnenkort beschikbaar'}</div>`; if (active && getActivePracticeModes().some(candidate => candidate.id === mode.id)) card.addEventListener('click', () => openMode(mode)); grid.appendChild(card); });
    field.appendChild(grid); content.appendChild(field);
  }
  async function mount() {
    mountPacoPageTemplate({ mount: templateMount, backLabel: '← Leskeuze', backAction: goChoice, greeting: `Hoi ${student}! 🐶`, title: 'Oefenen', icon: '✏️', subtitle: 'Kies hoe je deze les wilt oefenen.', navigation: createPacoNavigation({ app, active: 'practice', student, viewMode: context?.mode, navigate }), content });
    if (!lessonId || !student) { render(null); return; }
    try { const records = await app.loadLessons(); render(app.mapLessons(records).find(item => String(item.id) === String(lessonId)) || null); } catch (error) { console.error('Practice menu load error:', error); render(null); }
  }
  return Object.freeze({ mount, content });
}
