// Staged runtime entry point for the professional architecture.
// It is deliberately not referenced by index.html yet.
// The entry point assembles dependencies without taking over the legacy DOM.

import { createAppContext } from '../core/app-context.js';
import { createLessonService } from '../services/lesson-service.js';
import { createFeatureRegistry } from './feature-registry.js';

export function createRefactorRuntime({
  supabaseLib = window.supabase,
  session = null,
  agendaStorage = null,
  agendaMatcher = null,
  evaluateWord = null,
  recordWordResult = null,
  render = {}
} = {}) {
  const context = createAppContext({ supabaseLib, session });
  const lessonService = createLessonService(context.db);

  const features = createFeatureRegistry({
    context,
    lessonService,
    agendaStorage,
    agendaMatcher,
    evaluateWord,
    recordWordResult,
    render
  });

  return Object.freeze({ context, lessonService, features });
}
