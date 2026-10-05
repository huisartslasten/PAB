// Central registry for migrated PacoGO features.
// This is intentionally dependency-injection based: importing this file does not
// replace any V4.78 global or render any UI by itself.

import { createLessonsFeature } from '../features/lessons/index.js';
import { createAgendaFeature } from '../features/agenda/index.js';
import { createWordtrainerFeature } from '../features/wordtrainer/index.js';

export function createFeatureRegistry({
  context,
  lessonService,
  agendaStorage,
  agendaMatcher,
  evaluateWord,
  recordWordResult,
  render = {}
} = {}) {
  if (!context?.state) throw new Error('createFeatureRegistry requires context.state');
  if (!lessonService) throw new Error('createFeatureRegistry requires lessonService');

  const lessons = createLessonsFeature({
    lessonService,
    state: context.state,
    render: render.lessons,
    notify: render.notify
  });

  const agenda = createAgendaFeature({
    state: context.state,
    storage: agendaStorage,
    lessonMatcher: agendaMatcher,
    render: render.agenda,
    notify: render.notify
  });

  const wordtrainer = evaluateWord
    ? createWordtrainerFeature({
        state: context.state,
        evaluate: evaluateWord,
        recordResult: recordWordResult,
        render: render.wordtrainer
      })
    : null;

  return Object.freeze({ lessons, agenda, wordtrainer });
}
