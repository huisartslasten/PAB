// Deterministic persistence boundary for V4.78 createLessonFromPhoto().
// Preserves create -> item insert -> rollback-on-item-failure behavior.

function requireDb(db) {
  if (!db || typeof db.from !== 'function') throw new Error('A Supabase client is required.');
}

function normalizePairs(pairs = []) {
  return (Array.isArray(pairs) ? pairs : [])
    .map(pair => ({
      question: String(pair?.question || '').trim(),
      answer: String(pair?.answer || '').trim()
    }))
    .filter(pair => pair.question && pair.answer);
}

export async function createLessonFromPhotoPersistence({
  db,
  student,
  subject,
  title,
  type,
  pairs
} = {}) {
  requireDb(db);
  const normalizedPairs = normalizePairs(pairs);
  if (!student || !subject || !title || !normalizedPairs.length) {
    throw new Error('Photo lesson persistence requires student, subject, title, and at least one pair.');
  }

  const created = await db
    .from('lessons')
    .insert({ student, subject, title, type })
    .select()
    .single();
  if (created.error) throw created.error;

  const rows = normalizedPairs.map((pair, index) => ({
    lesson_id: created.data.id,
    question: pair.question,
    answer: pair.answer,
    sort_order: index
  }));

  const inserted = await db.from('lesson_items').insert(rows);
  if (inserted.error) {
    await db.from('lessons').delete().eq('id', created.data.id);
    throw inserted.error;
  }

  return Object.freeze({
    lesson: created.data,
    pairs: normalizedPairs
  });
}
