export function createLessonEditorState(initial = {}) {
  let mode = initial.lessonId != null ? 'edit' : 'create';
  let draft = {
    lessonId: initial.lessonId ?? null,
    student: initial.student ?? '',
    subject: initial.subject ?? '',
    title: initial.title ?? '',
    type: initial.type ?? 'words',
    testDate: initial.testDate ?? '',
    items: Array.isArray(initial.items) ? [...initial.items] : []
  };

  function patch(values = {}) {
    draft = { ...draft, ...values };
    return get();
  }

  function setItems(items = []) {
    draft = { ...draft, items: Array.isArray(items) ? [...items] : [] };
    return get();
  }

  function get() {
    return { mode, ...draft, items: [...draft.items] };
  }

  function reset(next = {}) {
    mode = next.lessonId != null ? 'edit' : 'create';
    draft = { lessonId: next.lessonId ?? null, student: next.student ?? '', subject: next.subject ?? '', title: next.title ?? '', type: next.type ?? 'words', testDate: next.testDate ?? '', items: Array.isArray(next.items) ? [...next.items] : [] };
    return get();
  }

  return Object.freeze({ get, patch, setItems, reset });
}
