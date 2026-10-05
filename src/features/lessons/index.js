// Lessons feature boundary.
// The legacy V4.78 implementation remains the reference until each operation
// is verified against the existing UI and Supabase behavior.

export function createLessonsFeature({
  lessonService,
  state,
  render = () => {},
  notify = () => {}
} = {}) {
  if (!lessonService) throw new Error('createLessonsFeature requires lessonService');
  if (!state) throw new Error('createLessonsFeature requires state');

  async function refresh() {
    const data = await lessonService.listAll();
    state.lessons = Array.isArray(data) ? data : [];
    render(state.lessons);
    return state.lessons;
  }

  async function updateLesson(id, payload) {
    const result = await lessonService.updateLesson(id, payload);
    await refresh();
    notify({ type: 'lesson-updated', id });
    return result;
  }

  async function archiveLesson(id) {
    const result = await lessonService.archive(id);
    await refresh();
    notify({ type: 'lesson-archived', id });
    return result;
  }

  async function trashLesson(id) {
    const result = await lessonService.moveToTrash(id);
    await refresh();
    notify({ type: 'lesson-trashed', id });
    return result;
  }

  async function restoreLesson(id) {
    const result = await lessonService.restore(id);
    await refresh();
    notify({ type: 'lesson-restored', id });
    return result;
  }

  return {
    refresh,
    updateLesson,
    archiveLesson,
    trashLesson,
    restoreLesson
  };
}
