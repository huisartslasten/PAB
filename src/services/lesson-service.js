// Lesson data boundary. This is the canonical persistence service for lessons.
const RESPONSE_TYPES = new Set(['text', 'number', 'fraction', 'multiple_choice']);
const DIFFICULTIES = new Set(['hard', 'harder']);

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

function normalizeParts(parts = null, fallback = '', defaultRole = 'answer') {
  if (!Array.isArray(parts)) return String(fallback ?? '').split('\n').map(value => value.trim()).filter(Boolean).map(text => ({ text, role: defaultRole }));
  return parts.map(part => ({ text: String(typeof part === 'string' ? part : part?.text ?? '').trim(), role: part?.role === 'extra' ? 'extra' : 'answer' })).filter(part => part.text);
}

function normalizeDifficulty(value) {
  const normalized = String(value ?? '').trim().toLowerCase();
  return DIFFICULTIES.has(normalized) ? normalized : null;
}

function normalizeContentData(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value;
}

function normalizeLessonItems(items = []) {
  return (Array.isArray(items) ? items : []).map((item, index) => {
    const questionParts = normalizeParts(item.question_parts, item.question);
    const answerParts = normalizeParts(item.answer_parts, item.answer);
    const answer = String(item.answer ?? '').trim() || answerParts.filter(part => part.role === 'answer').map(part => part.text).join('\n');
    return {
      question: String(item.question ?? '').trim() || questionParts.map(part => part.text).join('\n'),
      answer,
      question_parts: questionParts,
      answer_parts: answerParts,
      content_data: normalizeContentData(item.content_data),
      hint: String(item.hint ?? ''),
      response_type: RESPONSE_TYPES.has(item.response_type) ? item.response_type : 'text',
      answer_options: Array.isArray(item.answer_options) ? item.answer_options.map(option => String(option ?? '').trim()).filter(Boolean) : [],
      difficulty: normalizeDifficulty(item.difficulty),
      sort_order: Number(item.sort_order ?? index)
    };
  });
}

export function createLessonService(db) {
  if (!db) throw new Error('A Supabase client is required.');

  async function permanentlyDelete(id) {
    const { error: attemptsError } = await db.from('test_attempts').delete().eq('lesson_id', id);
    if (attemptsError) throw attemptsError;
    const { data, error } = await db.from('lessons').delete().eq('id', id).select('id');
    if (error) throw error;
    return (data || []).length;
  }

  return {
    async listAll() {
      const { data, error } = await db.from('lessons').select('*, lesson_items(*)').order('id', { ascending: true });
      if (error) throw error;
      return (data || []).map(lesson => ({ ...lesson, lesson_items: (lesson.lesson_items || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) }));
    },
    async createLesson(payload) {
      const normalized = normalizeLessonPayload(payload);
      const { data, error } = await db.from('lessons').insert(normalized).select().single();
      if (error) throw error;
      return data;
    },
    async createLessonWithItems({ lesson: lessonPayload, items = [] } = {}) {
      const lesson = await this.createLesson(lessonPayload);
      const rows = normalizeLessonItems(items).map(item => ({ ...item, lesson_id: lesson.id }));
      if (!rows.length) return Object.freeze({ lesson, items: [] });
      try {
        const { data, error } = await db.from('lesson_items').insert(rows).select();
        if (error) throw error;
        return Object.freeze({ lesson, items: data || [] });
      } catch (error) {
        await db.from('lessons').delete().eq('id', lesson.id);
        throw error;
      }
    },
    async updateLesson(id, payload) {
      const normalized = normalizeLessonPayload(payload);
      const { data, error } = await db.from('lessons').update(normalized).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async replaceLessonItems(lessonId, items) {
      const removed = await db.from('lesson_items').delete().eq('lesson_id', lessonId);
      if (removed.error) throw removed.error;
      const rows = normalizeLessonItems(items).map(item => ({ ...item, lesson_id: lessonId }));
      if (!rows.length) return [];
      const { data, error } = await db.from('lesson_items').insert(rows).select();
      if (error) throw error;
      return data || [];
    },
    async archive(id) { const { error } = await db.from('lessons').update({ archived: true }).eq('id', id); if (error) throw error; },
    async moveToTrash(id) { const { error } = await db.from('lessons').update({ deleted: true, archived: false }).eq('id', id); if (error) throw error; },
    async restore(id) { const { error } = await db.from('lessons').update({ archived: false, deleted: false }).eq('id', id); if (error) throw error; },
    async permanentlyDelete(id) { return permanentlyDelete(id); },
    async emptyTrash() {
      const { data: trashedLessons, error: listError } = await db.from('lessons').select('id').eq('deleted', true);
      if (listError) throw listError;
      const lessonIds = (trashedLessons || []).map(lesson => lesson.id);
      if (!lessonIds.length) return 0;
      let deletedCount = 0;
      for (const lessonId of lessonIds) deletedCount += await permanentlyDelete(lessonId);
      return deletedCount;
    }
  };
}
