import { createDashboardRuntime } from '../features/dashboard/runtime.js';
import { createLessonsRuntime } from '../features/lessons/runtime.js';
import { createLessonChoiceRuntime } from '../features/lessons/lesson-choice-runtime.js';
import { createLessonViewRuntime } from '../features/lessons/view-runtime.js';
import { createQuestionsRuntime } from '../features/lessons/questions-runtime.js';
import { createTestRuntime } from '../features/lessons/test-runtime.js';
import { createPracticeMenuRuntime } from '../features/practice/menu-runtime.js';
import { createFlashcardsPageRuntime } from '../features/practice/flashcards/page-runtime.js';
import { createAgendaPageRuntime } from '../features/agenda/page-runtime.js';
import { createTestHistoryRuntime } from '../features/test-history/runtime.js';
import { createManagementRuntime } from '../features/management/runtime.js';
import { createCreatorRuntime } from '../features/management/creator-runtime.js';
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

export function createPacoRouteRegistry({ app, mounts, documentRef = document } = {}) {
  if (!app) throw new TypeError('Paco route registry requires an app.');
  if (!mounts?.templateMount) throw new TypeError('Paco route registry requires a template mount.');
  const routes = {};
  routes['dashboard.html'] = defineRoute(({ url, navigate }) => {
    const context = readViewContext(url.searchParams);
    return createDashboardRuntime({
      app,
      templateMount: mounts.templateMount,
      chooserMount: mounts.chooserMount,
      context,
      documentRef,
      navigate
    });
  });
  routes['lessons.html'] = defineRoute(({ url, navigate }) => {
    const context = readViewContext(url.searchParams);
    return createLessonsRuntime({
      app,
      templateMount: mounts.templateMount,
      context,
      selectedSubject: url.searchParams.get('subject') || '',
      documentRef,
      navigate
    });
  }, [
    'src/components/lesson-list.css'
  ]);
  routes['lesson-choice.html'] = defineRoute(({ url, navigate }) => createLessonChoiceRuntime({
    app,
    templateMount: mounts.templateMount,
    context: readViewContext(url.searchParams),
    lessonId: url.searchParams.get('lesson_id') || '',
    documentRef,
    navigate
  }), [
    'src/features/lessons/lesson-context-view.css',
    'src/features/lessons/lesson-choice.css'
  ]);
  routes['lesson-view.html'] = defineRoute(({ url, navigate }) => createLessonViewRuntime({
    app,
    templateMount: mounts.templateMount,
    context: readViewContext(url.searchParams),
    lessonId: url.searchParams.get('lesson_id') || '',
    documentRef,
    navigate
  }), [
    'src/features/lessons/lesson-view.css'
  ]);
  routes['questions.html'] = defineRoute(({ url, navigate }) => createQuestionsRuntime({
    app,
    templateMount: mounts.templateMount,
    context: readViewContext(url.searchParams),
    lessonId: url.searchParams.get('lesson_id') || '',
    documentRef,
    navigate
  }), [
    'src/features/lessons/questions.css'
  ]);
  routes['test.html'] = defineRoute(({ url, navigate }) => createTestRuntime({
    app,
    templateMount: mounts.templateMount,
    context: readViewContext(url.searchParams),
    lessonId: url.searchParams.get('lesson_id') || '',
    documentRef,
    navigate
  }), [
    'src/features/lessons/lesson-context-view.css',
    'src/features/lessons/practice-page.css',
    'src/features/lessons/test.css'
  ]);
  routes['oefenen.html'] = defineRoute(({ url, navigate }) => createPracticeMenuRuntime({
    app,
    templateMount: mounts.templateMount,
    context: readViewContext(url.searchParams),
    lessonId: url.searchParams.get('lesson_id') || '',
    documentRef,
    navigate
  }), [
    'src/features/lessons/lesson-context-view.css',
    'src/features/practice/practice-menu.css'
  ]);
  routes['flashcards-template.html'] = defineRoute(({ url, navigate }) => createFlashcardsPageRuntime({
    app,
    templateMount: mounts.templateMount,
    context: readViewContext(url.searchParams),
    lessonId: url.searchParams.get('lesson_id') || '',
    documentRef,
    navigate
  }), [
    'src/features/lessons/lesson-context-view.css',
    'src/features/practice/flashcards/flashcards.css'
  ]);
  routes['agenda.html'] = defineRoute(({ url, navigate }) => createAgendaPageRuntime({
    app,
    templateMount: mounts.templateMount,
    context: readViewContext(url.searchParams),
    documentRef,
    navigate
  }));
  routes['test-history.html'] = defineRoute(({ url, navigate }) => createTestHistoryRuntime({
    app,
    templateMount: mounts.templateMount,
    context: readViewContext(url.searchParams),
    documentRef,
    navigate
  }), [
    'src/features/test-history/test-history.css'
  ]);
  routes['management.html'] = defineRoute(({ url, navigate }) => createManagementRuntime({
    app,
    templateMount: mounts.templateMount,
    context: readViewContext(url.searchParams),
    documentRef,
    navigate
  }), [
    'src/features/management/management-support.css'
  ]);
  routes['creator.html'] = defineRoute(({ url, navigate }) => createCreatorRuntime({
    app,
    templateMount: mounts.templateMount,
    documentRef,
    navigate
  }), [
    'src/features/management/creator.css'
  ]);
  return Object.freeze(routes);
}
