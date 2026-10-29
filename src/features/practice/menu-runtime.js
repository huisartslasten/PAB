import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { getContentDefinition, getLessonContentKinds, getPracticeModesForLesson } from '../lessons/learning-experience-registry.js';
import { createLessonContextField } from '../lessons/lesson-context-view.js';
import { buildViewUrl } from '../../core/view-context.js';

const TARGETS = Object.freeze({
  dictation: 'lesson-practice.html',
  flashcards: 'flashcards-template.html',
  memory: 'memory.html',
  games: 'games.html',
  'practice-test': 'oefentoets.html'
});

const CONTENT_META = Object.freeze({
  words: ['🎯', 'Oefen de losse woorden uit deze les.'],
  sentences: ['📝', 'Oefen de volledige zinnen uit deze les.'],
  questions: ['❓', 'Oefen de vragen en antwoorden uit deze les.'],
  math: ['🔢', 'Oefen de rekenopgaven uit deze les.'],
  spelling: ['✍️', 'Oefen de spellingonderdelen uit deze les.'],
  custom: ['🛠️', 'Oefen de onderdelen van deze eigen les.']
});

const MODE_META = Object.freeze({
  dictation: ['✏️', 'Luister en schrijf wat je hoort.'],
  flashcards: ['🃏', 'Oefen vraag en antwoord met kaarten.'],
  memory: ['🧠', 'Koppel de juiste vraag aan het antwoord.'],
  games: ['🎮', 'Oefen de les spelenderwijs.'],
  'practice-test': ['📝', 'Maak een oefentoets met deze lesstof.']
});

export function createPracticeMenuRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Practice menu runtime requires an app.');
  if (!templateMount) throw new TypeError('Practice menu runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Practice menu runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  let lesson = null;
  let selectedContentKind = '';

  const goChoice = () => {
    const target = buildViewUrl('lesson-choice.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  const openMode = mode => {
    const target = buildViewUrl(TARGETS[mode.id], { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    if (selectedContentKind) target.searchParams.set('content_kind', selectedContentKind);
    return navigate(target);
  };

  function createCard({ icon, title, description, actionLabel = 'Openen →', onClick }) {
    const card = documentRef.createElement('button');
    card.type = 'button';
    card.className = 'practice-mode-card active';
    card.innerHTML = `<div><div class="practice-mode-icon">${icon}</div><h2>${title}</h2><p>${description}</p></div><div class="practice-mode-action">${actionLabel}</div>`;
    card.addEventListener('click', onClick);
    return card;
  }

  function renderGrid(items) {
    const grid = documentRef.createElement('div');
    grid.className = 'practice-mode-grid';
    items.forEach(item => grid.appendChild(item));
    return grid;
  }

  function renderContentStep() {
    content.replaceChildren();
    const field = createLessonContextField(lesson, { documentRef });
    const heading = documentRef.createElement('div');
    heading.className = 'practice-selection-heading';
    heading.innerHTML = '<h2>WAT wil je oefenen?</h2><p>Kies eerst welk onderdeel van deze les je wilt oefenen.</p>';

    const cards = getLessonContentKinds(lesson).map(kind => {
      const definition = getContentDefinition(kind);
      const [icon, description] = CONTENT_META[kind] || ['📘', definition?.description || 'Oefen dit onderdeel.'];
      return createCard({
        icon,
        title: definition?.label || kind,
        description,
        onClick: () => {
          selectedContentKind = kind;
          renderPracticeStep();
        }
      });
    });

    field.append(heading, renderGrid(cards));
    content.appendChild(field);
  }

  function renderPracticeStep() {
    content.replaceChildren();
    const field = createLessonContextField(lesson, { documentRef });
    const definition = getContentDefinition(selectedContentKind);
    const heading = documentRef.createElement('div');
    heading.className = 'practice-selection-heading';
    heading.innerHTML = `<button type="button" class="practice-selection-back">← Ander onderdeel</button><h2>HOE wil je ${definition?.label?.toLowerCase() || 'dit'} oefenen?</h2><p>Kies de oefenvorm.</p>`;
    heading.querySelector('.practice-selection-back')?.addEventListener('click', renderContentStep);

    const modes = getPracticeModesForLesson({ lessonType: lesson.type, contentKind: selectedContentKind });
    const cards = modes.map(mode => {
      const [icon, description] = MODE_META[mode.id] || ['📘', mode.description];
      return createCard({ icon, title: mode.label, description, onClick: () => openMode(mode) });
    });

    field.append(heading, renderGrid(cards));
    content.appendChild(field);
  }

  function render(nextLesson) {
    lesson = nextLesson;
    selectedContentKind = '';
    content.replaceChildren();
    if (!lessonId || !lesson) {
      const state = documentRef.createElement('div');
      state.className = 'practice-state';
      state.textContent = lessonId ? 'Deze les kon niet worden gevonden.' : 'Geen les geselecteerd.';
      content.appendChild(state);
      return;
    }

    const contentKinds = getLessonContentKinds(lesson);
    if (contentKinds.length === 1) {
      selectedContentKind = contentKinds[0];
      renderPracticeStep();
      return;
    }

    renderContentStep();
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Leskeuze',
      backAction: goChoice,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Oefenen',
      icon: '✏️',
      subtitle: 'Kies eerst WAT je wilt oefenen en daarna HOE.',
      navigation: createPacoNavigation({ app, active: 'practice', student, viewMode: context?.mode, navigate }),
      content
    });
    if (!lessonId || !student) { render(null); return; }
    try {
      const records = await app.loadLessons();
      render(app.mapLessons(records).find(item => String(item.id) === String(lessonId)) || null);
    } catch (error) {
      console.error('Practice menu load error:', error);
      render(null);
    }
  }

  return Object.freeze({ mount, content });
}
