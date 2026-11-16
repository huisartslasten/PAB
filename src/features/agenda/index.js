import { createAgendaReadService } from './read-service.js';
import { createAgendaRuntime } from './runtime.js';
import { createAgendaRuntimeEntry, installAgendaRuntimeEntry } from './runtime-entry.js';

export { createAgendaReadService, createAgendaRuntime, createAgendaRuntimeEntry, installAgendaRuntimeEntry };

export function createAgendaFeature({
  state,
  storage,
  lessonMatcher,
  render = () => {},
  notify = () => {},
  documentRef = globalThis.document,
  demoItems = () => [],
  onEdit = () => {},
  onDelete = () => {},
  onLessonMatch = () => '',
  now = () => new Date()
} = {}) {
  if (!state) throw new Error('createAgendaFeature requires state');

  const readService = createAgendaReadService({
    storage,
    lessons: () => state.lessons || [],
    currentStudent: () => state.currentStudent || '',
    demoItems,
    now
  });
  const runtime = createAgendaRuntime({
    storage,
    documentRef,
    currentStudent: () => state.currentStudent || '',
    lessons: () => state.lessons || [],
    demoItems,
    onEdit,
    onDelete,
    onLessonMatch,
    now
  });

  function list() {
    const items = readService.buildAgendaItemsForRender(state.currentStudent || '');
    render(items);
    return items;
  }

  function matchLesson(item) {
    return typeof lessonMatcher === 'function'
      ? lessonMatcher(item, state.currentStudent, state.lessons)
      : null;
  }

  function save(items) {
    if (typeof storage?.saveItems === 'function') storage.saveItems(items, state.currentStudent);
    render(items);
    notify({ type: 'agenda-saved', count: items.length });
    return items;
  }

  return Object.freeze({ list, matchLesson, save, readService, runtime });
}
