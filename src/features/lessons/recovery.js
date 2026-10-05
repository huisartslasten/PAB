export function createLessonRecovery({ lessonService, refresh = async () => {} } = {}) {
  if (!lessonService) throw new Error('createLessonRecovery requires lessonService');

  async function archive(id) {
    const result = await lessonService.archive(id);
    await refresh();
    return result;
  }

  async function trash(id) {
    const result = await lessonService.moveToTrash(id);
    await refresh();
    return result;
  }

  async function restore(id) {
    const result = await lessonService.restore(id);
    await refresh();
    return result;
  }

  return Object.freeze({ archive, trash, restore });
}
