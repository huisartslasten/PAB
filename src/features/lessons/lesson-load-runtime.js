// Runtime orchestration for the V4.78 lesson-loading path.
// Contract source: legacy loadLessons() in TEST V4.78.
// No DOM querying or Supabase calls are performed here directly.

export async function loadLessonsRuntime({
  listLessons,
  setLessons,
  showMessage,
  showHome
} = {}) {
  if (typeof listLessons !== 'function') {
    throw new Error('A lesson-list function is required.');
  }
  if (typeof setLessons !== 'function') {
    throw new Error('A lesson-state setter is required.');
  }
  if (typeof showMessage !== 'function') {
    throw new Error('A message function is required.');
  }
  if (typeof showHome !== 'function') {
    throw new Error('A home navigation function is required.');
  }

  try {
    const loaded = await listLessons();
    setLessons(loaded || []);
    showHome();
    return Object.freeze({ ok: true, lessons: loaded || [] });
  } catch (error) {
    showMessage('Lessen laden mislukt: ' + (error?.message || error), 'error');
    return Object.freeze({ ok: false, error });
  }
}
