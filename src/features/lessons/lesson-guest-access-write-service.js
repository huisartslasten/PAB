// Pure persistence boundary for V4.78 guest-lesson assignment actions.
// UI, authorization, rendering, state and messages remain outside this service.

function requireDb(db) {
  if (!db || typeof db.from !== 'function') {
    throw new Error('A guest-lesson database client is required.');
  }
  return db;
}

export async function findGuestByName({ db, guestName } = {}) {
  const client = requireDb(db);
  const { data, error } = await client
    .from('guest_users')
    .select('id')
    .eq('name', guestName)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function findGuestLessonAssignment({ db, guestId, lessonId } = {}) {
  const client = requireDb(db);
  const { data, error } = await client
    .from('guest_lessons')
    .select('id')
    .eq('guest_id', guestId)
    .eq('lesson_id', lessonId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateGuestLessonAssignment({ db, assignmentId, active } = {}) {
  const client = requireDb(db);
  const { error } = await client
    .from('guest_lessons')
    .update({ active })
    .eq('id', assignmentId);
  if (error) throw error;
  return Object.freeze({ ok: true, assignmentId, active: Boolean(active) });
}

export async function createGuestLessonAssignment({ db, guestId, lessonId, active = true } = {}) {
  const client = requireDb(db);
  const { error } = await client
    .from('guest_lessons')
    .insert({ guest_id: guestId, lesson_id: lessonId, active: Boolean(active) });
  if (error) throw error;
  return Object.freeze({ ok: true, guestId, lessonId, active: Boolean(active) });
}
