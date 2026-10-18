// Lesson data boundary. This is the canonical persistence service for lessons.
// The TEST schema stores the lesson columns exposed below; item ordering belongs
// to lesson_items and must never be sent to the lessons table.

function normalizeLessonPayload(payload = {}) {
  return {
    student: payload.student ?? null,
    subject: payload.subject ?? '',
    subvak: payload.subvak ?? '',
    title: payload.title ?? '',
    type: payload.type ?? '',
    archived: Boolean(payload.archived ?? false),
    deleted: Boolean(payload.deleted ?? false)
  };
}

function normalizeLessonItems(items = []) {
  return (Array.isArray(items) ? items : []).map((item, index) => ({
    question: String(item.question ?? ''),
    answer: String(item.answer ?? ''),
    hint: String(item.hint ?? ''),
    response_type: ['text', 'number', 'fraction', 'multiple_choice'].includes(item.response_type)
      ? item.response_type
      : 'text',
    answer_options: Array.isArray(item.answer_options)
      ? item.answer_options.map(option => String(option ?? '').trim()).filter(Boolean)
      : [],
    sort_order: Number(item.sort_order ?? index)
  }));
}

export function createLessonService(db) {
  if (!db) throw new Error('A Supabase client is required.');

  async function permanentlyDelete(id) {
    const { error: attemptsError } = await db
      .from('test_attempts')
      .delete()
      .eq('lesson_id', id);
    if (attemptsError) throw attemptsError;

    const { data, error } = await db
      .from('lessons')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw error;

    return (data || []).length;
  }

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
      const { error } = await db.from('lessons').update({ archived: false, deleted: false }).eq('id', id);
      if (error) throw error;
    },

    async permanentlyDelete(id) {
      return permanentlyDelete(id);
    },

    async emptyTrash() {
      const { data: trashedLessons, error: listError } = await db
        .from('lessons')
        .select('id')
        .eq('deleted', true);
      if (listError) throw listError;

      const lessonIds = (trashedLessons || []).map(lesson => lesson.id);
      if (!lessonIds.length) return 0;

      let deletedCount = 0;
      for (const lessonId of lessonIds) {
        deletedCount += await permanentlyDelete(lessonId);
      }
      return deletedCount;
    }
  };
}
