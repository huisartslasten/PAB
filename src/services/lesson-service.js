// Lesson data boundary. This is the first domain service extracted from the monolith.
// It intentionally mirrors the existing V4.78 query shape so behavior can be regression-tested
// before the old implementation is removed.

export function createLessonService(db) {
  if (!db) throw new Error('A Supabase client is required.');

  return {
    async listAll() {
      const { data, error } = await db
        .from('lessons')
        .select('*, lesson_items(*)')
        .order('id', { ascending: true });

      if (error) throw error;

      return (data || []).map(lesson => ({
        ...lesson,
        lesson_items: (lesson.lesson_items || []).sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
        )
      }));
    },

    async updateLesson(id, payload) {
      const { data, error } = await db
        .from('lessons')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async replaceLessonItems(lessonId, items) {
      const removed = await db.from('lesson_items').delete().eq('lesson_id', lessonId);
      if (removed.error) throw removed.error;

      if (!items.length) return [];

      const rows = items.map(item => ({
        ...item,
        lesson_id: lessonId,
        hint: item.hint || '',
        min_words: Number(item.min_words || 0),
        required_terms: Array.isArray(item.required_terms) ? item.required_terms : []
      }));

      const { data, error } = await db.from('lesson_items').insert(rows).select();
      if (error) throw error;
      return data || [];
    },

    async archive(id) {
      const { error } = await db.from('lessons').update({ archived: true }).eq('id', id);
      if (error) throw error;
    },

    async moveToTrash(id) {
      const { error } = await db
        .from('lessons')
        .update({ deleted: true, archived: false })
        .eq('id', id);
      if (error) throw error;
    },

    async restore(id) {
      const { error } = await db
        .from('lessons')
        .update({ archived: false, deleted: false })
        .eq('id', id);
      if (error) throw error;
    }
  };
}
