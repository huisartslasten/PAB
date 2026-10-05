// Agenda feature boundary.
// Rendering/import logic stays in the V4.78 runtime until exact behavior
// has been mapped and verified. This module defines the future public API.

export function createAgendaFeature({
  state,
  storage,
  lessonMatcher,
  render = () => {},
  notify = () => {}
} = {}) {
  if (!state) throw new Error('createAgendaFeature requires state');

  const getItems = typeof storage?.getItems === 'function'
    ? storage.getItems
    : () => [];
  const saveItems = typeof storage?.saveItems === 'function'
    ? storage.saveItems
    : () => {};

  function list() {
    const items = getItems(state.currentStudent) || [];
    render(items);
    return items;
  }

  function matchLesson(item) {
    return typeof lessonMatcher === 'function'
      ? lessonMatcher(item, state.currentStudent, state.lessons)
      : null;
  }

  function save(items) {
    saveItems(items, state.currentStudent);
    render(items);
    notify({ type: 'agenda-saved', count: items.length });
    return items;
  }

  return { list, matchLesson, save };
}
