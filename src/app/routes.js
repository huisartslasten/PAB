import { readViewContext } from '../core/view-context.js';

function defineRoute(renderer, styles = []) {
  Object.defineProperty(renderer, 'styles', {
    value: Object.freeze([...styles]),
    enumerable: false,
    configurable: false,
    writable: false
  });
  return renderer;
}

function defineLazyRoute(loadModule, exportName, buildArgs, styles = []) {
  return defineRoute(async context => {
    const module = await loadModule();
    const factory = module?.[exportName];
    if (typeof factory !== 'function') {
      throw new TypeError(`PacoGO route module does not expose ${exportName}.`);
    }
    return factory(buildArgs(context));
  }, styles);
}

export function createPacoRouteRegistry({ app, mounts, documentRef = document } = {}) {
  if (!app) throw new TypeError('Paco route registry requires an app.');
  if (!mounts?.templateMount) throw new TypeError('Paco route registry requires template mount.');

  const routes = {};

  routes['dashboard.html'] = defineLazyRoute(
    () => import('../features/dashboard/runtime.js'),
    'createDashboardRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, chooserMount: mounts.chooserMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/dashboard/dashboard.css']
  );
  routes['lessons.html'] = defineLazyRoute(
    () => import('../features/lessons/runtime.js'),
    'createLessonsRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), selectedSubject: url.searchParams.get('subject') || '', documentRef, navigate }),
    ['src/components/lesson-list.css']
  );
  routes['lesson-choice.html'] = defineLazyRoute(
    () => import('../features/lessons/lesson-choice-runtime.js'),
    'createLessonChoiceRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/lesson-choice.css']
  );
  routes['lesson-view.html'] = defineLazyRoute(
    () => import('../features/lessons/view-runtime.js'),
    'createLessonViewRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-view.css']
  );
  routes['lesson-learning.html'] = defineLazyRoute(
    () => import('../features/lessons/lesson-learning-view-runtime.js'),
    'createLessonLearningViewRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-learning-view.css']
  );
  routes['learning-material.html'] = defineLazyRoute(
    () => import('../features/learning-material/view-runtime.js'),
    'createLearningMaterialViewRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: { ...readViewContext(url.searchParams), subject: url.searchParams.get('subject') || '', subvak: url.searchParams.get('subvak') || '' }, topicId: url.searchParams.get('topic_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-learning-view.css']
  );
  routes['questions.html'] = defineLazyRoute(
    () => import('../features/lessons/questions-runtime.js'),
    'createQuestionsRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/questions.css']
  );
  routes['test.html'] = defineLazyRoute(
    () => import('../features/lessons/test-runtime.js'),
    'createTestRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/lessons/test.css']
  );
  routes['lesson-editor.html'] = defineLazyRoute(
    () => import('../features/lessons/lesson-editor-runtime.js'),
    'createLessonEditorRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-editor.css']
  );
  routes['learning-material-editor.html'] = defineLazyRoute(
    () => import('../features/learning-material/editor-runtime.js'),
    'createLearningMaterialEditorRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: { ...readViewContext(url.searchParams), subject: url.searchParams.get('subject') || '', subvak: url.searchParams.get('subvak') || '' }, topicId: url.searchParams.get('topic_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-editor.css', 'src/features/learning-material/editor.css']
  );
  routes['oefenen.html'] = defineLazyRoute(
    () => import('../features/practice/menu-runtime.js'),
    'createPracticeMenuRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/practice/practice-menu.css']
  );
  routes['oefentoets.html'] = defineLazyRoute(
    () => import('../features/practice/practice-test-runtime.js'),
    'createPracticeTestRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css']
  );
  routes['games.html'] = defineLazyRoute(
    () => import('../features/practice/games-runtime.js'),
    'createGamesRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/practice/games.css']
  );
  routes['skills.html'] = defineLazyRoute(
    () => import('../features/skills/runtime.js'),
    'createSkillsRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), skillId: url.searchParams.get('skill') || '', durationSeconds: Number(url.searchParams.get('duration') || 180), documentRef, navigate })
  );
  routes['double-or-nothing.html'] = defineLazyRoute(
    () => import('../features/practice/double-or-nothing/page-runtime.js'),
    'createDoubleOrNothingPageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/practice/double-or-nothing.css']
  );
  routes['millionaire.html'] = defineLazyRoute(
    () => import('../features/practice/millionaire/page-runtime.js'),
    'createMillionairePageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/practice/millionaire/millionaire.css']
  );
  routes['memory.html'] = defineLazyRoute(
    () => import('../features/practice/memory/page-runtime.js'),
    'createMemoryPageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/practice/memory/memory.css']
  );
  routes['flash-question.html'] = defineLazyRoute(
    () => import('../features/practice/flash/page-runtime.js'),
    'createFlashPageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/practice/flash/flash.css']
  );
  routes['tic-tac-toe.html'] = defineLazyRoute(
    () => import('../features/practice/tic-tac-toe/page-runtime.js'),
    'createTicTacToePageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/practice/tic-tac-toe.css']
  );
  routes['drop4.html'] = defineLazyRoute(
    () => import('../features/practice/drop4/page-runtime.js'),
    'createDrop4PageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/practice/drop4/drop4.css']
  );
  routes['connect-the-dots.html'] = defineLazyRoute(
    () => import('../features/practice/connect-the-dots/page-runtime.js'),
    'createConnectTheDotsPageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/practice/connect-the-dots/connect-the-dots.css']
  );
  routes['word-reveal.html'] = defineLazyRoute(
    () => import('../features/practice/word-reveal/page-runtime.js'),
    'createWordRevealPageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/practice/word-reveal.css']
  );
  routes['word-chase.html'] = defineLazyRoute(
    () => import('../features/practice/word-chase/page-runtime.js'),
    'createWordChasePageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/practice/word-chase/word-chase.css']
  );
  routes['lexo.html'] = defineLazyRoute(
    () => import('../features/practice/lexo/page-runtime.js'),
    'createLexoPageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/practice/lexo/lexo.css']
  );
  routes['flashcards-template.html'] = defineLazyRoute(
    () => import('../features/practice/flashcards/page-runtime.js'),
    'createFlashcardsPageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }),
    ['src/features/lessons/lesson-context-view.css', 'src/features/practice/flashcards/flashcards.css']
  );
  routes['agenda.html'] = defineLazyRoute(
    () => import('../features/agenda/page-runtime.js'),
    'createAgendaPageRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/agenda/agenda.css']
  );
  routes['month-calendar.html'] = defineLazyRoute(
    () => import('../features/agenda/month-calendar-runtime.js'),
    'createMonthCalendarRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/agenda/month-calendar.css']
  );
  routes['test-history.html'] = defineLazyRoute(
    () => import('../features/test-history/runtime.js'),
    'createTestHistoryRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/management/management-support.css']
  );
  routes['management.html'] = defineLazyRoute(
    () => import('../features/management/runtime.js'),
    'createManagementRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/management/management-support.css']
  );
  routes['challenge-settings.html'] = defineLazyRoute(
    () => import('../features/management/challenge-configuration-runtime.js'),
    'createChallengeConfigurationRuntime',
    ({ navigate }) => ({ app, templateMount: mounts.templateMount, documentRef, navigate }),
    ['src/features/management/management-support.css', 'src/features/management/challenge-configuration.css']
  );
  routes['skill-create.html'] = defineLazyRoute(
    () => import('../features/management/skill-creation-runtime.js'),
    'createSkillCreationRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/management/management-support.css']
  );
  routes['skill-editor.html'] = defineLazyRoute(
    () => import('../features/management/skill-editor-runtime.js'),
    'createSkillEditorRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), createMode: url.searchParams.get('create') === '1', category: url.searchParams.get('category') || 'math', documentRef, navigate }),
    ['src/features/management/management-support.css']
  );
  routes['archive.html'] = defineLazyRoute(
    () => import('../features/management/archive-runtime.js'),
    'createArchiveRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/management/management-support.css']
  );
  routes['feedback.html'] = defineLazyRoute(
    () => import('../features/management/feedback-runtime.js'),
    'createFeedbackRuntime',
    ({ navigate }) => ({ app, templateMount: mounts.templateMount, documentRef, navigate }),
    ['src/features/management/management-support.css']
  );
  routes['creator.html'] = defineLazyRoute(
    () => import('../features/management/creator-runtime.js'),
    'createCreatorRuntime',
    ({ url, navigate }) => ({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }),
    ['src/features/management/management-support.css', 'src/features/management/creator.css']
  );

  return Object.freeze(routes);
}
