export function createLessonRepository(db) {
  if (!db) throw new Error('Lesson repository requires a database client');

  async function list() {
    const { data, error } = await db
      .from('lessons')
      .select('*, lesson_items(*)')
      .order('id', { ascending: true });
    if (error) throw error;

    return (data || []).map(lesson => ({
      ...lesson,
      lesson_items: [...(lesson.lesson_items || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    }));
  }

  return { list };
}
