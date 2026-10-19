import { createDashboardRuntime } from '../features/dashboard/runtime.js';
import { createLessonsRuntime } from '../features/lessons/runtime.js';
import { createLessonChoiceRuntime } from '../features/lessons/lesson-choice-runtime.js';
import { createQuestionsRuntime } from '../features/lessons/questions-runtime.js';
import { createAgendaPageRuntime } from '../features/agenda/page-runtime.js';
import { createTestHistoryRuntime } from '../features/test-history/runtime.js';
import { createManagementRuntime } from '../features/management/runtime.js';
import { readViewContext } from '../core/view-context.js';

export function createPacoRouteRegistry({ app, mounts, documentRef = document } = {}) {
  if (!app) throw new TypeError('Paco route registry requires an app.');
  if (!mounts?.templateMount) throw new TypeError('Paco route registry requires a template mount.');

  const routes = {};

  routes['dashboard.html'] = ({ url, navigate }) => {
    const context = readViewContext(url.searchParams);
    const chooserMount = mounts.chooserMount;
    if (!chooserMount) throw new TypeError('Dashboard route requires a chooser mount.');
    return createDashboardRuntime({ app, templateMount: mounts.templateMount, chooserMount, context, documentRef, navigate });
  };

  routes['lessons.html'] = ({ url, navigate }) => {
    const context = readViewContext(url.searchParams);
    const selectedSubject = url.searchParams.get('subject') || '';
    return createLessonsRuntime({ app, templateMount: mounts.templateMount, context, selectedSubject, documentRef, navigate });
  };

  routes['lesson-choice.html'] = ({ url, navigate }) => createLessonChoiceRuntime({
    app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate
  });

  routes['questions.html'] = ({ url, navigate }) => createQuestionsRuntime({
    app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate
  });

  routes['agenda.html'] = ({ url, navigate }) => createAgendaPageRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate });
  routes['test-history.html'] = ({ url, navigate }) => createTestHistoryRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate });
  routes['management.html'] = ({ url, navigate }) => createManagementRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate });

  return Object.freeze(routes);
}
