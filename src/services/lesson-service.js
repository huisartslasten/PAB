// Lesson data boundary. This is the canonical persistence service for lessons.
// The TEST schema stores the columns exposed below; domain/editor models may
// contain richer fields, but persistence must never send unsupported columns.

function normalizeLessonPayload(payload = {}) {
  return {
    student: payload.student ?? null,
    subject: payload.subject ?? '',
    title: payload.title ?? '',
    type: payload.type ?? '',
    sort_order: Number(payload.sort_order ?? 0),
    archived: Boolean(payload.archived ?? false),
    deleted: Boolean(payload.deleted ?? false)
  };
}

function normalizeLessonItems(items = []) {
  return (Array.isArray(items) ? items : []).map((item, index) => ({
    question: String(item.question ?? ''),
    answer: String(item.answer ?? ''),
    hint: String(item.hint ?? ''),
    sort_order: Number(item.sort_order ?? index)
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
        .insert(normalizeLessonPayload(payload))
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
        // Lesson persistence owns the existing create -> item insert -> rollback sequence.
        await db.from('lessons').delete().eq('id', lesson.id);
        throw error;
      }
    },

    async updateLesson(id, payload) {
      const { data, error } = await db
        .from('lessons')
        .update(normalizeLessonPayload(payload))
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
    },

    async emptyTrash() {
      const { data: trashedLessons, error: listError } = await db
        .from('lessons')
        .select('id')
        .eq('deleted', true);
      if (listError) throw listError;

      const lessonIds = (trashedLessons || []).map(lesson => lesson.id);
      if (!lessonIds.length) return 0;

      // Test history is intentionally retained for archived lessons, but the user's
      // permanent-delete policy explicitly removes it when a lesson leaves the trash.
      const { error: attemptsError } = await db
        .from('test_attempts')
        .delete()
        .in('lesson_id', lessonIds);
      if (attemptsError) throw attemptsError;

      const { data: deletedLessons, error: deleteError } = await db
        .from('lessons')
        .delete()
        .in('id', lessonIds)
        .select('id');
      if (deleteError) throw deleteError;

      return (deletedLessons || []).length;
    }
  };
}