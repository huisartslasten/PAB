import { createDashboardRuntime } from '../features/dashboard/runtime.js';
import { createLessonsRuntime } from '../features/lessons/runtime.js';
import { createLessonChoiceRuntime } from '../features/lessons/lesson-choice-runtime.js';
import { createLessonViewRuntime } from '../features/lessons/view-runtime.js';
import { createLessonLearningViewRuntime } from '../features/lessons/lesson-learning-view-runtime.js';
import { createQuestionsRuntime } from '../features/lessons/questions-runtime.js';
import { createTestRuntime } from '../features/lessons/test-runtime.js';
import { createLessonEditorRuntime } from '../features/lessons/lesson-editor-runtime.js';
import { createLearningMaterialEditorRuntime } from '../features/learning-material/editor-runtime.js';
import { createLearningMaterialViewRuntime } from '../features/learning-material/view-runtime.js';
import { createPracticeMenuRuntime } from '../features/practice/menu-runtime.js';
import { createPracticeTestRuntime } from '../features/practice/practice-test-runtime.js';
import { createGamesRuntime } from '../features/practice/games-runtime.js';
import { createDoubleOrNothingPageRuntime } from '../features/practice/double-or-nothing/page-runtime.js';
import { createTicTacToePageRuntime } from '../features/practice/tic-tac-toe/page-runtime.js';
import { createFlashcardsPageRuntime } from '../features/practice/flashcards/page-runtime.js';
import { createAgendaPageRuntime } from '../features/agenda/page-runtime.js';
import { createMonthCalendarRuntime } from '../features/agenda/month-calendar-runtime.js';
import { createTestHistoryRuntime } from '../features/test-history/runtime.js';
import { createManagementRuntime } from '../features/management/runtime.js';
import { createArchiveRuntime } from '../features/management/archive-runtime.js';
import { createFeedbackRuntime } from '../features/management/feedback-runtime.js';
import { createCreatorRuntime } from '../features/management/creator-runtime.js';
import { readViewContext } from '../core/view-context.js';

function defineRoute(renderer, styles = []) { Object.defineProperty(renderer, 'styles', { value: Object.freeze([...styles]), enumerable: false, configurable: false, writable: false }); return renderer; }

export function createPacoRouteRegistry({ app, mounts, documentRef = document } = {}) {
  if (!app) throw new TypeError('Paco route registry requires app.'); if (!mounts?.templateMount) throw new TypeError('Paco route registry requires template mount.');
  const routes = {};
  routes['dashboard.html'] = defineRoute(({ url, navigate }) => createDashboardRuntime({ app, templateMount: mounts.templateMount, chooserMount: mounts.chooserMount, context: readViewContext(url.searchParams), documentRef, navigate }));
  routes['lessons.html'] = defineRoute(({ url, navigate }) => createLessonsRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), selectedSubject: url.searchParams.get('subject') || '', documentRef, navigate }), ['src/components/lesson-list.css']);
  routes['lesson-choice.html'] = defineRoute(({ url, navigate }) => createLessonChoiceRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/lesson-choice.css']);
  routes['lesson-view.html'] = defineRoute(({ url, navigate }) => createLessonViewRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-view.css']);
  routes['lesson-learning.html'] = defineRoute(({ url, navigate }) => createLessonLearningViewRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-learning-view.css']);
  routes['learning-material.html'] = defineRoute(({ url, navigate }) => createLearningMaterialViewRuntime({ app, templateMount: mounts.templateMount, context: { ...readViewContext(url.searchParams), subject: url.searchParams.get('subject') || '', subvak: url.searchParams.get('subvak') || '', saved: url.searchParams.get('saved') || '' }, topicId: url.searchParams.get('topic_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-learning-view.css']);
  routes['questions.html'] = defineRoute(({ url, navigate }) => createQuestionsRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/questions.css']);
  routes['test.html'] = defineRoute(({ url, navigate }) => createTestRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css', 'src/features/lessons/test.css']);
  routes['lesson-editor.html'] = defineRoute(({ url, navigate }) => createLessonEditorRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-editor.css']);
  routes['learning-material-editor.html'] = defineRoute(({ url, navigate }) => createLearningMaterialEditorRuntime({ app, templateMount: mounts.templateMount, context: { ...readViewContext(url.searchParams), subject: url.searchParams.get('subject') || '', subvak: url.searchParams.get('subvak') || '' }, topicId: url.searchParams.get('topic_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-editor.css', 'src/features/learning-material/editor.css']);
  routes['oefenen.html'] = defineRoute(({ url, navigate }) => createPracticeMenuRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-context-view.css', 'src/features/practice/practice-menu.css']);
  routes['oefentoets.html'] = defineRoute(({ url, navigate }) => createPracticeTestRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-context-view.css', 'src/features/lessons/practice-page.css']);
  routes['games.html'] = defineRoute(({ url, navigate }) => createGamesRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-context-view.css', 'src/features/practice/games.css']);
  routes['double-or-nothing.html'] = defineRoute(({ url, navigate }) => createDoubleOrNothingPageRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-context-view.css', 'src/features/practice/double-or-nothing.css']);
  routes['tic-tac-toe.html'] = defineRoute(({ url, navigate }) => createTicTacToePageRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-context-view.css', 'src/features/practice/tic-tac-toe.css']);
  routes['flashcards-template.html'] = defineRoute(({ url, navigate }) => createFlashcardsPageRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), lessonId: url.searchParams.get('lesson_id') || '', documentRef, navigate }), ['src/features/lessons/lesson-context-view.css', 'src/features/practice/flashcards/flashcards.css']);
  routes['agenda.html'] = defineRoute(({ url, navigate }) => createAgendaPageRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }), ['src/features/agenda/agenda.css']);
  routes['month-calendar.html'] = defineRoute(({ url, navigate }) => createMonthCalendarRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }), ['src/features/agenda/month-calendar.css']);
  routes['test-history.html'] = defineRoute(({ url, navigate }) => createTestHistoryRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }), ['src/features/test-history/test-history.css']);
  routes['management.html'] = defineRoute(({ url, navigate }) => createManagementRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }), ['src/features/management/management-support.css']);
  routes['archive.html'] = defineRoute(({ url, navigate }) => createArchiveRuntime({ app, templateMount: mounts.templateMount, context: readViewContext(url.searchParams), documentRef, navigate }), ['src/features/management/management-support.css']);
  routes['feedback.html'] = defineRoute(({ url, navigate }) => createFeedbackRuntime({ app, templateMount: mounts.templateMount, documentRef, navigate }), ['src/features/management/management-support.css']);
  routes['creator.html'] = defineRoute(({ url, navigate }) => createCreatorRuntime({ app, templateMount: mounts.templateMount, documentRef, navigate }), ['src/features/management/creator.css']);
  return Object.freeze(routes);
}
