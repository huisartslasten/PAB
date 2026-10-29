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

  function render(lesson, access = []) {
    content.replaceChildren();
    if (!lessonId || !lesson) {
      const state = documentRef.createElement('div');
      state.className = 'games-state';
      state.textContent = lessonId ? 'Deze les kon niet worden gevonden.' : 'Geen les geselecteerd.';
      content.appendChild(state);
      return;
    }

    const accessByGame = new Map(access.map(record => [record.gameKey, record]));
    const progress = access[0] || { creditedTests: 0, requiredTests: 10, minimumScore: 9 };
    const field = createLessonContextField(lesson, { documentRef });
    const grid = createActivityCardGrid({
      items: getActivePracticeGames().map(game => {
        const state = accessByGame.get(game.id);
        const unlocked = state?.unlocked === true;
        const locked = !unlocked;
        return {
          ...game,
          title: game.label,
          locked,
          description: locked
            ? `🔒 ${game.label} — ${progress.creditedTests} / ${progress.requiredTests} toetsen behaald — Nog ${Math.max(0, progress.requiredTests - progress.creditedTests)} toets${progress.requiredTests - progress.creditedTests === 1 ? '' : 'en'} met minimaal een ${progress.minimumScore}.`
            : game.description,
          actionLabel: locked ? 'Vergrendeld' : 'Spelen →'
        };
      }),
      documentRef,
      onOpen: openGame
    });
    field.appendChild(grid);
    content.appendChild(field);
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
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
      const [records, access] = await Promise.all([
        app.loadLessons(),
        app.gameAccess.getAccess(student)
      ]);
      const lesson = app.mapLessons(records).find(item => String(item.id) === String(lessonId));
      render(lesson || null, access);
    } catch (error) {
      console.error('Games menu load error:', error);
      render(null);
    }
  }

  return Object.freeze({ mount, content });
}
