// Canonical persistence boundary for game results.
// Game runtimes own scoring rules; this service owns Supabase result storage
// and high-score reads shared by all games.

function requireDb(db) {
  if (!db || typeof db.from !== 'function') {
    throw new Error('A Supabase client is required.');
  }
}

function normalizeStudent(student) {
  const value = String(student ?? '').trim();
  if (!value) throw new Error('A student is required.');
  return value;
}

function normalizeLessonId(lessonId) {
  const value = Number(lessonId);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error('A valid lesson is required.');
  }
  return value;
}

function normalizeScore(score) {
  const value = Math.floor(Number(score));
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('A valid non-negative score is required.');
  }
  return value;
}

export function createGameResultService(db) {
  requireDb(db);

  async function findGameId(gameKey) {
    const key = String(gameKey ?? '').trim();
    if (!key) throw new Error('A game key is required.');

    const { data, error } = await db
      .from('games')
      .select('id')
      .eq('key', key)
      .eq('active', true)
      .maybeSingle();

    if (error) throw error;
    if (!data?.id) throw new Error(`Game "${key}" is not available.`);
    return data.id;
  }

  async function getHighScore({ gameKey, lessonId, student }) {
    const gameId = await findGameId(gameKey);
    const normalizedLessonId = normalizeLessonId(lessonId);
    const normalizedStudent = normalizeStudent(student);

    const { data, error } = await db
      .from('game_results')
      .select('score')
      .eq('game_id', gameId)
      .eq('lesson_id', normalizedLessonId)
      .eq('student', normalizedStudent)
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return Math.max(0, Math.floor(Number(data?.score) || 0));
  }

  async function saveResult({ gameKey, lessonId, student, score }) {
    const gameId = await findGameId(gameKey);
    const normalizedLessonId = normalizeLessonId(lessonId);
    const normalizedStudent = normalizeStudent(student);
    const normalizedScore = normalizeScore(score);

    const { error } = await db
      .from('game_results')
      .insert({
        game_id: gameId,
        lesson_id: normalizedLessonId,
        student: normalizedStudent,
        score: normalizedScore
      });

    if (error) throw error;
    return normalizedScore;
  }

  return Object.freeze({
    findGameId,
    getHighScore,
    saveResult
  });
}
