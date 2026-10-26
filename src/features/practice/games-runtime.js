import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createActivityCardGrid } from '../../components/activity-card-grid.js';
import { getActivePracticeGames } from './practice-domain.js';
import { createLessonContextField } from '../lessons/lesson-context-view.js';
import { buildViewUrl } from '../../core/view-context.js';

export function createGamesRuntime({ app, templateMount, context, lessonId = '', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Games runtime requires an app.');
  if (!templateMount) throw new TypeError('Games runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Games runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');

  const goPractice = () => {
    const target = buildViewUrl('oefenen.html', { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  const openGame = game => {
    const target = buildViewUrl(game.path, { student, mode: context?.mode });
    if (lessonId) target.searchParams.set('lesson_id', lessonId);
    return navigate(target);
  };

  function render(lesson) {
    content.replaceChildren();
    if (!lessonId || !lesson) {
      const state = documentRef.createElement('div');
      state.className = 'games-state';
      state.textContent = lessonId ? 'Deze les kon niet worden gevonden.' : 'Geen les geselecteerd.';
      content.appendChild(state);
      return;
    }

    const field = createLessonContextField(lesson, { documentRef });
    const grid = createActivityCardGrid({
      items: getActivePracticeGames().map(game => ({
        ...game,
        title: game.label,
        actionLabel: 'Spelen →'
      })),
      documentRef,
      onOpen: openGame
    });
    field.appendChild(grid);
    content.appendChild(field);
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Oefenen',
      backAction: goPractice,
      greeting: `Hoi ${student}! 🐶`,
      title: 'Spelletjes',
      icon: '🎮',
      subtitle: 'Kies een spelletje voor deze les.',
      navigation: createPacoNavigation({ app, active: 'lessons', student, viewMode: context?.mode, navigate }),
      content
    });

    if (!lessonId || !student) {
      render(null);
      return;
    }

    try {
      const records = await app.loadLessons();
      const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
      render(lesson || null);
    } catch (error) {
      console.error('Games menu load error:', error);
      render(null);
    }
  }

  return Object.freeze({ mount, content });
}
