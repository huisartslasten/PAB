// Persistence boundary for the V4.78 saveLesson() database sequence.
// Contract: existing lesson -> update lesson -> delete items -> insert items;
// new lesson -> insert lesson -> obtain id -> insert items.
// Test-date persistence and UI refresh remain outside this boundary.

export function createLessonSavePersistence(db) {
  if (!db) throw new Error('A Supabase client is required.');

  async function save({ lessonId = null, lesson = {}, items = [] } = {}) {
    let id = lessonId;
    let savedLesson = null;
    let error = null;

    if (id) {
      const updated = await db
        .from('lessons')
        .update(lesson)
        .eq('id', id);
      error = updated.error;

      if (!error) {
        const removed = await db.from('lesson_items').delete().eq('lesson_id', id);
        error = removed.error;
      }
    } else {
      const created = await db
        .from('lessons')
        .insert(lesson)
        .select()
        .single();
      error = created.error;
      savedLesson = created.data || null;
      id = savedLesson?.id;
    }

    if (!error) {
      const rows = (Array.isArray(items) ? items : []).map(item => ({
        ...item,
        lesson_id: id,
        hint: item.hint || '',
        min_words: Number(item.min_words || 0),
        required_terms: Array.isArray(item.required_terms) ? item.required_terms : []
      }));

      const inserted = await db.from('lesson_items').insert(rows);
      error = inserted.error;
    }

    if (error) throw error;

    return Object.freeze({ lessonId: id, lesson: savedLesson, items });
  }

  return Object.freeze({ save });
}
