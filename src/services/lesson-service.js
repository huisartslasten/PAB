// Lesson data boundary. This is the first domain service extracted from the monolith.
// It intentionally mirrors the existing V4.78 query shape so behavior can be regression-tested
// before the old implementation is removed.

function normalizeLessonItems(items = []) {
  return (Array.isArray(items) ? items : []).map(item => ({
    ...item,
    hint: item.hint || '',
    min_words: Number(item.min_words || 0),
    required_terms: Array.isArray(item.required_terms) ? item.required_terms : []
  }));
}

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

    async createLesson(payload) {
      const { data, error } = await db
        .from('lessons')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async createLessonWithItems({ lesson: lessonPayload, items = [] } = {}) {
      const lesson = await this.createLesson(lessonPayload);
      const normalizedItems = normalizeLessonItems(items);

      if (!normalizedItems.length) {
        return Object.freeze({ lesson, items: [] });
      }

      const rows = normalizedItems.map(item => ({
        ...item,
        lesson_id: lesson.id
      }));

      try {
        const { data, error } = await db.from('lesson_items').insert(rows).select();
        if (error) throw error;
        return Object.freeze({ lesson, items: data || [] });
      } catch (error) {
        // Preserve the existing V4.78 create -> item insert -> rollback contract.
        // Lesson persistence owns this transaction-like sequence; callers do not.
        await db.from('lessons').delete().eq('id', lesson.id);
        throw error;
      }
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

      const rows = normalizeLessonItems(items).map(item => ({
        ...item,
        lesson_id: lessonId
      }));

      if (!rows.length) return [];

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
